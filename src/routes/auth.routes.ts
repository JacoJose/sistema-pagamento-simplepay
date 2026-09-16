import { Router } from "express"
import { AuthController } from "../controllers/auth.controller"
import { authenticateMerchant } from "../middlewares/auth.middleware"

const authRoutes = Router()
const authController = new AuthController()

authRoutes.post("/register", (req, res, next) => authController.register(req, res, next))
authRoutes.post("/login", (req, res, next) => authController.login(req, res, next))

authRoutes.get("/me", authenticateMerchant, (req, res, next) => authController.me(req, res, next))

export { authRoutes }