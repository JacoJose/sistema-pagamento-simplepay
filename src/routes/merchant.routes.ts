import { Router } from "express"
import { MerchantController } from "../controllers/merchant.controller"
import { authenticateMerchant } from "../middlewares/auth.middleware"

const merchantRoutes = Router()
const merchantController = new MerchantController()

// Rotas Públicas (TICKET-BANK-01)
merchantRoutes.post("/register", (req, res, next) => merchantController.register(req, res, next))
merchantRoutes.post("/login", (req, res, next) => merchantController.login(req, res, next))

// Rotas Protegidas por Autenticação JWT
merchantRoutes.get("/", authenticateMerchant, (req, res, next) => merchantController.getAll(req, res, next))
merchantRoutes.get("/:id", authenticateMerchant, (req, res, next) => merchantController.getById(req, res, next))
merchantRoutes.put("/:id", authenticateMerchant, (req, res, next) => merchantController.update(req, res, next))
merchantRoutes.delete("/:id", authenticateMerchant, (req, res, next) => merchantController.delete(req, res, next))

export { merchantRoutes }