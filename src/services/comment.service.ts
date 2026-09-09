import { PrismaClient } from "@prisma/client"
import { AppError } from "../middlewares/error.middleware"

const prisma = new PrismaClient()

export interface CreateCommentData {
  postId: string
  authorId: string
  text: string
}

export class CommentService {
  public async createComment(data: CreateCommentData) {
    if (!data.postId) {
      throw new AppError("postId is required to create a comment.", 400)
    }
    if (!data.authorId) {
      throw new AppError("authorId is required to create a comment.", 400)
    }
    if (!data.text || data.text.trim().length === 0) {
      throw new AppError("Comment text cannot be empty.", 400)
    }

    const post = await prisma.post.findUnique({
      where: { id: data.postId },
    })

    if (!post) {
      throw new AppError("Post not found.", 404)
    }

    const author = await prisma.user.findUnique({
      where: { id: data.authorId },
    })

    if (!author) {
      throw new AppError("Comment author not found.", 404)
    }

    return await prisma.comment.create({
      data: {
        postId: data.postId,
        authorId: data.authorId,
        text: data.text,
      },
    })
  }

  public async getCommentsByPost(postId: string) {
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    if (!post) {
      throw new AppError("Post not found.", 404)
    }

    return await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: "asc" },
      include: {
        author: {
          select: { id: true, name: true, email: true },
        },
      },
    })
  }
}
