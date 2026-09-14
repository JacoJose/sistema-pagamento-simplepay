import { Router } from "express"
import { CommentController } from "../controllers/comment.controller"
import { authenticateUser } from "../middlewares/auth.middleware"

const commentRoutes = Router()
const commentController = new CommentController()

commentRoutes.post("/", authenticateUser, (req, res, next) => commentController.create(req, res, next))
commentRoutes.get("/post/:postId", authenticateUser, (req, res, next) => commentController.getByPost(req, res, next))

export default commentRoutes
