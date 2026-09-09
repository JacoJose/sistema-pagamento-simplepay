import { Request, Response, NextFunction } from "express";
import { PostService } from "../services/post.service";

const postService = new PostService();

export class PostController {
  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const post = await postService.createPost(req.body);
      res.status(201).json(post);
    } catch (error) {
      next(error);
    }
  }

  public async like(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const { userId } = req.body;
      const updatedPost = await postService.likePost(id, userId);
      res.status(200).json(updatedPost);
    } catch (error) {
      next(error);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string;
      const post = await postService.getPostById(id);
      res.status(200).json(post);
    } catch (error) {
      next(error);
    }
  }

  public async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const posts = await postService.getAllPosts();
      res.status(200).json(posts);
    } catch (error) {
      next(error);
    }
  }
}
