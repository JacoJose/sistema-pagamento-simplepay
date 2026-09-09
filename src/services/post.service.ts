import { PrismaClient } from "@prisma/client"
import { AppError } from "../middlewares/error.middleware"

const prisma = new PrismaClient()

export interface CreatePostData {
  title: string
  description: string
  imageUrl: string
  authorId: string
}

export class PostService {
  public async createPost(data: CreatePostData) {
    if (!data.title || data.title.trim().length < 3) {
      throw new AppError("Title must be at least 3 characters long.", 400)
    }
    if (!data.description || data.description.trim().length < 5) {
      throw new AppError("Description must be at least 5 characters long.", 400)
    }
    if (!data.imageUrl || !data.imageUrl.startsWith("http")) {
      throw new AppError("A valid image URL is required.", 400)
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

    return await prisma.post.create({
      data: {
        title: data.title,
        description: data.description,
        imageUrl: data.imageUrl,
        authorId: data.authorId,
        likesCount: 0,
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
    })
  }

  public async getPostById(id: string) {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: { id: true, name: true, email: true, role: true },
        },
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
          select: { id: true, name: true, email: true, role: true },
        },
      },
    })
  }
}
