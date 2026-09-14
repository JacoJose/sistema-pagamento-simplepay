import { PrismaClient } from "@prisma/client"
import bcrypt from "bcrypt"
import { AppError } from "../middlewares/error.middleware"

const prisma = new PrismaClient()

export interface CreateUserData {
  name: string
  email: string
  password: string
  role?: string
  zipCode: string
  imageId?: string
}

export interface UpdateUserData {
  name?: string
  email?: string
  password?: string
  role?: string
  zipCode?: string
  imageId?: string
}

export class UserService {
  public async getAllUsers() {
    return await prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zipCode: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
      orderBy: { createdAt: "desc" },
    })
  }

  public async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zipCode: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      throw new AppError("User not found.", 404)
    }

    return user
  }

  public async createUser(data: CreateUserData) {
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

    const hashedPassword = await bcrypt.hash(data.password, 10)

    const createPayload: any = {
      name: data.name,
      email: data.email,
      password: hashedPassword,
      role: role,
      zipCode: data.zipCode,
    }

    if (data.imageId) {
      createPayload.avatar = {
        connect: { id: data.imageId },
      }
    }

    return await prisma.user.create({
      data: createPayload,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zipCode: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  public async updateUser(id: string, data: UpdateUserData) {
    const userExists = await prisma.user.findUnique({
      where: { id },
    })

    if (!userExists) {
      throw new AppError("User not found.", 404)
    }

    if (data.email && data.email !== userExists.email) {
      const emailTaken = await prisma.user.findUnique({
        where: { email: data.email },
      })

      if (emailTaken) {
        throw new AppError("A user with this email already exists.", 400)
      }
    }

    const updatePayload: Record<string, any> = {}

    if (data.name !== undefined) updatePayload.name = data.name
    if (data.email !== undefined) updatePayload.email = data.email
    if (data.zipCode !== undefined) updatePayload.zipCode = data.zipCode
    if (data.role !== undefined) {
      updatePayload.role = data.role === "MERCHANT" ? "MERCHANT" : "CONSUMER"
    }

    if (data.password) {
      if (data.password.length < 6) {
        throw new AppError("Password must be at least 6 characters long.", 400)
      }
      updatePayload.password = await bcrypt.hash(data.password, 10)
    }

    if (data.imageId) {
      updatePayload.avatar = {
        connect: { id: data.imageId },
      }
    }

    return await prisma.user.update({
      where: { id },
      data: updatePayload,
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        zipCode: true,
        avatar: true,
        createdAt: true,
        updatedAt: true,
      },
    })
  }

  public async deleteUser(id: string) {
    const userExists = await prisma.user.findUnique({
      where: { id },
    })

    if (!userExists) {
      throw new AppError("User not found.", 404)
    }

    await prisma.user.delete({
      where: { id },
    })

    return { message: "User deleted successfully." }
  }
}
