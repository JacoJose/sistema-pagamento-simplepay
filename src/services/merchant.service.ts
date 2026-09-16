import { PrismaClient, Prisma } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AppError } from "../middlewares/error.middleware"

const prisma = new PrismaClient()

export interface CreateMerchantData {
  name: string
  email: string
  password: string
  document: string
}

export interface LoginMerchantData {
  email: string
  password: string
}

export interface UpdateMerchantData {
  name?: string
  email?: string
  password?: string
  document?: string
}

export class MerchantService {
  private readonly merchantSelect = {
    id: true,
    name: true,
    email: true,
    document: true,
    apiKey: true,
    createdAt: true,
    updatedAt: true,
  }

  public async register(data: CreateMerchantData) {
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
      throw new AppError("A valid CPF or CNPJ is required.", 400)
    }

    const existingEmail = await prisma.merchant.findUnique({
      where: { email: data.email },
    })

    if (existingEmail) {
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

  public async login(data: LoginMerchantData) {
    if (!data.email || !data.password) {
      throw new AppError("Email and password are required.", 400)
    }

    const merchant = await prisma.merchant.findUnique({
      where: { email: data.email },
    })

    if (!merchant) {
      throw new AppError("Invalid email or password.", 401)
    }

    const passwordMatch = await bcrypt.compare(data.password, merchant.password)

    if (!passwordMatch) {
      throw new AppError("Invalid email or password.", 401)
    }

    const secret = process.env.JWT_SECRET || "default_jwt_secret"
    const token = jwt.sign({ id: merchant.id, email: merchant.email }, secret, {
      expiresIn: "1d",
    })

    const { password, ...merchantWithoutPassword } = merchant

    return { token, merchant: merchantWithoutPassword }
  }

  public async getAllMerchants() {
    return await prisma.merchant.findMany({
      select: this.merchantSelect,
      orderBy: { createdAt: "desc" },
    })
  }

  public async getMerchantById(id: string) {
    const merchant = await prisma.merchant.findUnique({
      where: { id },
      select: this.merchantSelect,
    })

    if (!merchant) {
      throw new AppError("Merchant not found.", 404)
    }

    return merchant
  }

  public async updateMerchant(authenticatedMerchantId: string, id: string, data: UpdateMerchantData) {
    if (authenticatedMerchantId !== id) {
      throw new AppError("You need authorization to perform this action.", 403)
    }

    const merchantExists = await prisma.merchant.findUnique({
      where: { id },
    })

    if (!merchantExists) {
      throw new AppError("Merchant not found.", 404)
    }

    if (data.email && data.email !== merchantExists.email) {
      const emailTaken = await prisma.merchant.findUnique({
        where: { email: data.email },
      })

      if (emailTaken) {
        throw new AppError("A merchant with this email already exists.", 400)
      }
    }

    if (data.document && data.document !== merchantExists.document) {
      const documentTaken = await prisma.merchant.findUnique({
        where: { document: data.document },
      })

      if (documentTaken) {
        throw new AppError("A merchant with this document already exists.", 400)
      }
    }

    const updatePayload: Prisma.MerchantUpdateInput = {}

    if (data.name !== undefined) updatePayload.name = data.name
    if (data.email !== undefined) updatePayload.email = data.email
    if (data.document !== undefined) updatePayload.document = data.document

    if (data.password) {
      if (data.password.length < 6) {
        throw new AppError("Password must be at least 6 characters long.", 400)
      }
      updatePayload.password = await bcrypt.hash(data.password, 10)
    }

    return await prisma.merchant.update({
      where: { id },
      data: updatePayload,
      select: this.merchantSelect,
    })
  }

  public async deleteMerchant(authenticatedMerchantId: string, id: string) {
    if (authenticatedMerchantId !== id) {
      throw new AppError("You need authorization to perform this action.", 403)
    }

    const merchantExists = await prisma.merchant.findUnique({
      where: { id },
    })

    if (!merchantExists) {
      throw new AppError("Merchant not found.", 404)
    }

    await prisma.merchant.delete({
      where: { id },
    })

    return { message: "Merchant deleted successfully." }
  }
}