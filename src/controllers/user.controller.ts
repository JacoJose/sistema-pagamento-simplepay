import { Request, Response, NextFunction } from "express"
import { MerchantService } from "../services/merchant.service"
import { AuthenticatedRequest } from "../middlewares/auth.middleware"

const merchantService = new MerchantService()

export class MerchantController {
  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const merchants = await merchantService.getAllMerchants()
      res.status(200).json(merchants)
    } catch (error) {
      next(error)
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const merchant = await merchantService.getMerchantById(id)
      res.status(200).json(merchant)
    } catch (error) {
      next(error)
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const merchant = await merchantService.createMerchant(req.body)
      res.status(201).json({
        message: "Merchant created successfully.",
        merchant,
      })
    } catch (error) {
      next(error)
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const authReq = req as AuthenticatedRequest
      const userId = authReq.user?.id!
      const updatedMerchant = await merchantService.updateMerchant(userId, id, req.body)
      res.status(200).json({
        message: "Merchant updated successfully.",
        merchant: updatedMerchant,
      })
    } catch (error) {
      next(error)
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const result = await merchantService.deleteMerchant(id)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
