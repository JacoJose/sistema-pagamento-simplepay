import { Request, Response, NextFunction } from "express"
import { AuthService } from "../services/auth.service"

const authService = new AuthService()

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {

      const user = await authService.register(req.body)

      res.status(201).json({
        message: "User Created",
        user
      })

    } catch (error) {
      next(error)
    }
  }

  public async login() {

  }
}