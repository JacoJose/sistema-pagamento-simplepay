//rota de register

import { Router } from "express"
import { AuthController } from "../controllers/auth.controller"

const authRoutes = Router()
const authController = new AuthController()

authRoutes.post("/register", (request, response, next) => authController.register(request, response, next))



export default authRoutes
