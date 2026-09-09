import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { AppError } from "../middlewares/error.middleware"

const prisma = new PrismaClient()


export interface RegisterDTO {
  name: string
  email: string
  password: string
  role?: string
  zipCode: string
}

export interface LoginDTO {
  email: string
  password: string
}

export class AuthService {
  public async register(data: RegisterDTO) {
    if (!data.name || data.name.trim().length < 2) {
      throw new AppError("Name must be at least 2 characters long.", 400)
    }

    if (!data.email || !data.email.includes("@")) {
      throw new AppError("A valid email address is required.", 400)
    }

    if (!data.password || data.password.length < 6) {
      throw new AppError("Password must be at least 6 characters long.", 400)
    }

    if (!data.zipCode || data.zipCode.trim().length < 8) {
      throw new AppError("A valid zip code is required.", 400)
    }

    const role = data.role === "MERCHANT" ? "MERCHANT" : "CONSUMER"

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (existingUser) {
      throw new AppError("A user with this email already exists.", 400)
    }

    const saltRounds = 10
    const hashedPassword = await bcrypt.hash(data.password, saltRounds)

    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
        role: role,
        zipCode: data.zipCode,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zipCode: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    return user
  }


  public async login(data: LoginDTO) {
    if (!data.email || !data.password) {
      throw new AppError("Email and password are required.", 400)
    }

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    })

    if (!user) {
      throw new AppError("Invalid email or password.", 401)
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.password)

    if (!isPasswordValid) {
      throw new AppError("Invalid email or password.", 401)
    }

    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret"
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
      },
      jwtSecret,
      { expiresIn: "1d" }
    )

    const { password, ...userWithoutPassword } = user

    return {
      user: userWithoutPassword,
      token,
    }
  }


  public async getProfile(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zipCode: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new AppError("User profile not found.", 404)
    }

    return user
  }
}
