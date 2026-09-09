import { Request, Response, NextFunction } from "express"
import { CommentService } from "../services/comment.service"

const commentService = new CommentService()

export class CommentController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const comment = await commentService.createComment(req.body)
      res.status(201).json(comment)
    } catch (error) {
      next(error)
    }
  }

  public async getByPost(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const postId = req.params.postId as string
      const comments = await commentService.getCommentsByPost(postId)
      res.status(200).json(comments)
    } catch (error) {
      next(error)
    }
  }
}
