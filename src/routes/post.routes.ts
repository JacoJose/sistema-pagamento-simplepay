import { Router } from "express"
import { PostController } from "../controllers/post.controller"

const postRoutes = Router()
const postController = new PostController()

postRoutes.post("/", (req, res, next) => postController.create(req, res, next))
postRoutes.post("/:id/like", (req, res, next) => postController.like(req, res, next))
postRoutes.get("/", (req, res, next) => postController.list(req, res, next))
postRoutes.get("/:id", (req, res, next) => postController.getById(req, res, next))

export default postRoutes
