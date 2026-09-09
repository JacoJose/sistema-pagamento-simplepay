import { Router } from "express"
import { UserController } from "../controllers/user.controller"
import { authenticateUser } from "../middlewares/auth.middleware"

const userRoutes = Router()
const userController = new UserController()

userRoutes.get("/", authenticateUser, (req, res, next) => userController.getAll(req, res, next))
userRoutes.get("/:id", authenticateUser, (req, res, next) => userController.getById(req, res, next))
userRoutes.post("/", (req, res, next) => userController.create(req, res, next))
userRoutes.put("/:id", authenticateUser, (req, res, next) => userController.update(req, res, next))
userRoutes.delete("/:id", authenticateUser, (req, res, next) => userController.delete(req, res, next))

export default userRoutes
