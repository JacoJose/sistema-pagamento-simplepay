import { Router } from "express"
import { ImageController } from "../controllers/image.controller"
import { upload } from "../middlewares/upload.middleware"
import { authenticateUser } from "../middlewares/auth.middleware"

const uploadRouter = Router()
const imageController = new ImageController()

uploadRouter.post("/", authenticateUser, upload.single("image"), imageController.upload)
uploadRouter.get("/:id", authenticateUser, imageController.getById)
uploadRouter.get("/", authenticateUser, imageController.list)
uploadRouter.delete("/:id", authenticateUser, imageController.delete)

export default uploadRouter
