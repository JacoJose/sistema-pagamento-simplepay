import { NextFunction, Request, Response } from "express"
import { AppError } from "../middlewares/error.middleware"
import { ImageService } from "../services/image.service"

const imageService = new ImageService()

export class ImageController {
  public async upload(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.file) {
        throw new AppError("No image file provided in request.", 400)
      }

      const file = req.file
      const publicUrl = `${req.protocol}://${req.get("host")}/uploads/${file.filename}`

      const savedImage = await imageService.createImage({
        filename: file.filename,
        mimetype: file.mimetype,
        url: publicUrl,
      })

      res.status(201).json({
        message: "Image uploaded and metadata saved successfully.",
        image: savedImage,
      })
    } catch (error) {
      next(error)
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const image = await imageService.getImageById(id)
      res.status(200).json(image)
    } catch (error) {
      next(error)
    }
  }

  public async list(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const images = await imageService.getAllImages()
      res.status(200).json(images)
    } catch (error) {
      next(error)
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const result = await imageService.deleteImage(id)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
