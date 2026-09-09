import { Router } from "express"
import { CommentController } from "../controllers/comment.controller"

const commentRoutes = Router()
const commentController = new CommentController()

commentRoutes.post("/", (req, res, next) => commentController.create(req, res, next))
commentRoutes.get("/post/:postId", (req, res, next) => commentController.getByPost(req, res, next))

export default commentRoutes
