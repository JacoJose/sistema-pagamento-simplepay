import crypto from "crypto"
import multer from "multer"
import path from "path"
import { uploadConfig } from "../config/upload.config"
import { AppError } from "./error.middleware"

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, uploadConfig.directory)
  },
  filename: (_req, file, cb) => {
    const timestamp = Date.now()
    const randomHash = crypto.randomBytes(8).toString("hex")
    const ext = path.extname(file.originalname)
    const uniqueFilename = `${timestamp}-${randomHash}${ext}`
    cb(null, uniqueFilename)
  },
})


const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimeTypes = [
    "image/jpeg",
    "image/png",
    "image/webp",
    "image/gif",
    "image/jpg",
  ]

  if (allowedMimeTypes.includes(file.mimetype)) {
    cb(null, true)
  } else {
    cb(new AppError("Invalid file type. Only JPEG, PNG, WEBP, and GIF images are allowed.", 400))
  }
}

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
})
