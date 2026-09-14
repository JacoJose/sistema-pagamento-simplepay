import { NextFunction, Request, Response } from "express"
import { AuthenticatedRequest } from "../middlewares/auth.middleware"
import { AppError } from "../middlewares/error.middleware"
import { PostService } from "../services/post.service"

const postService = new PostService()

export class PostController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest
      const authorId = authReq.user?.id

      if (!authorId) {
        throw new AppError("Authentication required. User ID could not be identified.", 401)
      }

      const { title, description, imageUrl, imageId, imageIds } = req.body

      const post = await postService.createPost({
        title,
        description,
        imageUrl,
        imageId,
        imageIds,
        authorId,
      })

      res.status(201).json(post)
    } catch (error) {
      next(error)
    }
  }

  public async like(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const authReq = req as AuthenticatedRequest
      const userId = authReq.user?.id
      const id = req.params.id as string

      if (!userId) {
        throw new AppError("Authentication required to like a post.", 401)
      }

      const updatedPost = await postService.likePost(id, userId)
      res.status(200).json(updatedPost)
    } catch (error) {
      next(error)
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const post = await postService.getPostById(id)
      res.status(200).json(post)
    } catch (error) {
      next(error)
    }
  }

  public async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const posts = await postService.getAllPosts()
      res.status(200).json(posts)
    } catch (error) {
      next(error)
    }
  }
}
