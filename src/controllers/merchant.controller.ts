import { Request, Response, NextFunction } from "express"
import { MerchantService } from "../services/merchant.service"
import { AuthenticatedRequest } from "../middlewares/auth.middleware"

const merchantService = new MerchantService()

export class MerchantController {
  public async register(req: Request, res: Response, next: NextFunction) {
    try {
      const merchant = await merchantService.register(req.body)
      return res.status(201).json(merchant)
    } catch (error) {
      next(error)
    }
  }

  public async login(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await merchantService.login(req.body)
      return res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }

  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const merchants = await merchantService.getAllMerchants()
      return res.status(200).json(merchants)
    } catch (error) {
      next(error)
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const id = String(req.params.id)
      const merchant = await merchantService.getMerchantById(id)
      return res.status(200).json(merchant)
    } catch (error) {
      next(error)
    }
  }

  public async update(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authenticatedMerchantId = req.user?.id as string
      const id = String(req.params.id)
      const updatedMerchant = await merchantService.updateMerchant(authenticatedMerchantId, id, req.body)
      return res.status(200).json(updatedMerchant)
    } catch (error) {
      next(error)
    }
  }

  public async delete(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const authenticatedMerchantId = req.user?.id as string
      const id = String(req.params.id)
      const response = await merchantService.deleteMerchant(authenticatedMerchantId, id)
      return res.status(200).json(response)
    } catch (error) {
      next(error)
    }
  }

  // [TICKET-BANK-02] cadastrar e atualizar Chave PIX -- Samuel
  async setPixKey(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const merchantId = req.user?.id
      const { pixKey, keyType } = req.body

      return res.status(200).json({ message: "Chave PIX configurada com sucesso." })
    } catch (error) {
      next(error)
    }
  }

  // [TICKET-BANK-02] configurar URL do Webhook 
  async updateWebhook(req: AuthenticatedRequest, res: Response, next: NextFunction) {
    try {
      const merchantId = req.user?.id
      const { webhookUrl } = req.body

      return res.status(200).json({ message: "URL de Webhook atualizada com sucesso." })
    } catch (error) {
      next(error)
    }
  }
}