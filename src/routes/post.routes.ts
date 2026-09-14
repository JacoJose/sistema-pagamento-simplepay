import { Router } from "express"
import { PostController } from "../controllers/post.controller"
import { authenticateUser } from "../middlewares/auth.middleware"

const postRoutes = Router()
const postController = new PostController()

postRoutes.post("/", authenticateUser, (req, res, next) => postController.create(req, res, next))
postRoutes.post("/:id/like", authenticateUser, (req, res, next) => postController.like(req, res, next))
postRoutes.get("/", authenticateUser, (req, res, next) => postController.list(req, res, next))
postRoutes.get("/:id", authenticateUser, (req, res, next) => postController.getById(req, res, next))

export default postRoutes
