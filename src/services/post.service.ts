import { PrismaClient } from "@prisma/client"
import { AppError } from "../middlewares/error.middleware"

const prisma = new PrismaClient()

export interface CreatePostData {
  title: string
  description: string
  imageUrl?: string
  authorId: string
  imageId?: string
  imageIds?: string[]
}

export class PostService {
  public async createPost(data: CreatePostData) {
    if (!data.title || data.title.trim().length < 3) {
      throw new AppError("Title must be at least 3 characters long.", 400)
    }
    if (!data.description || data.description.trim().length < 5) {
      throw new AppError("Description must be at least 5 characters long.", 400)
    }
    if (!data.authorId) {
      throw new AppError("authorId is required to create a post.", 400)
    }

    const author = await prisma.user.findUnique({
      where: { id: data.authorId },
    })

    if (!author) {
      throw new AppError("Post author not found.", 404)
    }

    if (author.role !== "MERCHANT" && (author as any).role !== "ENTREPRENEUR") {
      throw new AppError("Business Rule Violation (BR01): Only MERCHANT/ENTREPRENEUR accounts can create post showcases.", 403)
    }

    let finalImageUrl = data.imageUrl

    const connectImages: { id: string }[] = []

    if (data.imageId) {
      const img = await prisma.image.findUnique({ where: { id: data.imageId } })
      if (!img) {
        throw new AppError(`Attached image with id '${data.imageId}' not found.`, 404)
      }
      connectImages.push({ id: data.imageId })
      if (!finalImageUrl) {
        finalImageUrl = img.url
      }
    }

    if (data.imageIds && Array.isArray(data.imageIds)) {
      for (const id of data.imageIds) {
        const img = await prisma.image.findUnique({ where: { id } })
        if (!img) {
          throw new AppError(`Attached image with id '${id}' not found.`, 404)
        }
        connectImages.push({ id })
        if (!finalImageUrl) {
          finalImageUrl = img.url
        }
      }
    }

    if (!finalImageUrl || !finalImageUrl.startsWith("http")) {
      throw new AppError("A valid image URL or imageId is required to create a post.", 400)
    }

    const postData: any = {
      title: data.title,
      description: data.description,
      imageUrl: finalImageUrl,
      authorId: data.authorId,
      likesCount: 0,
    }

    if (connectImages.length > 0) {
      postData.images = {
        connect: connectImages,
      }
    }

    return await prisma.post.create({
      data: postData,
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
        images: true,
      },
    })
  }

  public async likePost(postId: string, userId: string) {
    if (!userId) {
      throw new AppError("userId is required to like a post.", 400)
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      throw new AppError("User not found.", 404)
    }

    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new AppError("Post not found.", 404)
    }

    if (userId === post.authorId) {
      throw new AppError("Business Rule Violation (BR03): Users cannot like their own posts.", 403)
    }

    return await prisma.post.update({
      where: { id: postId },
      data: {
        likesCount: post.likesCount + 1,
      },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
        images: true,
      },
    })
  }

  public async getPostById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
        images: true,
        comments: true,
      },
    })

    if (!post) {
      throw new AppError("Post not found.", 404)
    }

    return post
  }

  public async getAllPosts() {
    return await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true, avatar: true },
        },
        images: true,
      },
    })
  }
}
