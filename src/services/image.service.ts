import { PrismaClient } from "@prisma/client"
import { AppError } from "../middlewares/error.middleware"

const prisma = new PrismaClient()

export interface CreateImageData {
  filename: string
  mimetype: string
  url: string
  userId?: string
  postId?: string
}

export class ImageService {
  public async createImage(data: CreateImageData) {
    if (!data.filename) {
      throw new AppError("Filename is required.", 400)
    }

    if (!data.mimetype) {
      throw new AppError("Mimetype is required.", 400)
    }

    if (!data.url) {
      throw new AppError("URL is required.", 400)
    }

    return await prisma.image.create({
      data: {
        filename: data.filename,
        mimetype: data.mimetype,
        url: data.url,
        userId: data.userId || null,
        postId: data.postId || null,
      },
    })
  }

  public async getImageById(id: string) {
    const image = await prisma.image.findUnique({
      where: { id },
    })

    if (!image) {
      throw new AppError("Image not found.", 404)
    }

    return image
  }

  public async getAllImages() {
    return await prisma.image.findMany({
      orderBy: { createdAt: "desc" },
    })
  }

  public async deleteImage(id: string) {
    const image = await prisma.image.findUnique({
      where: { id },
    })

    if (!image) {
      throw new AppError("Image not found.", 404)
    }

    await prisma.image.delete({
      where: { id },
    })

    return { message: "Image deleted successfully." }
  }
}
