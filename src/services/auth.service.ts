import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AppError } from "../middlewares/error.middleware"

const prisma = new PrismaClient()

export interface RegisterMerchantDTO {
  name: string
  email: string
  password: string
  document: string
}

export interface LoginMerchantDTO {
  email: string
  password: string
}

export class AuthService {
  private readonly merchantSelect = {
    id: true,
    name: true,
    email: true,
    document: true,
    apiKey: true,
    createdAt: true,
    updatedAt: true,
  }

  public async register(data: RegisterMerchantDTO) {
    if (!data.name || data.name.trim().length < 2) {
      throw new AppError("Name must be at least 2 characters long.", 400)
    }

    if (!data.email || !data.email.includes("@")) {
      throw new AppError("A valid email address is required.", 400)
    }

    if (!data.password || data.password.length < 6) {
      throw new AppError("Password must be at least 6 characters long.", 400)
    }

    if (!data.document || data.document.trim().length < 11) {
      throw new AppError("A valid CPF or CNPJ document is required.", 400)
    }

    const existingMerchant = await prisma.merchant.findUnique({
      where: { email: data.email },
    })

    if (existingMerchant) {
      throw new AppError("A merchant with this email already exists.", 400)
    }

    const existingDocument = await prisma.merchant.findUnique({
      where: { document: data.document },
    })

    if (existingDocument) {
      throw new AppError("A merchant with this document already exists.", 400)
    }

    const hashedPassword = await bcrypt.hash(data.password, 10)

    return await prisma.merchant.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        document: data.document,
      },
      select: this.merchantSelect,
    })
  }

  public async login(data: LoginMerchantDTO) {
    if (!data.email || !data.password) {
      throw new AppError("Email and password are required.", 400)
    }

    const merchant = await prisma.merchant.findUnique({
      where: { email: data.email },
    })

    if (!merchant) {
      throw new AppError("Invalid email or password.", 401)
    }

    const isPasswordValid = await bcrypt.compare(data.password, merchant.password)

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password.", 401)
    }

    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret"
    const token = jwt.sign(
      {
        id: merchant.id,
        email: merchant.email,
      },
      jwtSecret,
      { expiresIn: "1d" }
    )

    const { password, ...merchantWithoutPassword } = merchant

    return {
      merchant: merchantWithoutPassword,
      token,
    }
  }

  public async getProfile(merchantId: string) {
    const merchant = await prisma.merchant.findUnique({
      where: { id: merchantId },
      select: this.merchantSelect,
    })

    if (!merchant) {
      throw new AppError("Merchant profile not found.", 404)
    }

    return merchant
  }
}