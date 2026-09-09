import { Request, Response, NextFunction } from "express"
import { AuthService } from "../services/auth.service"
import { AuthenticatedRequest } from "../middlewares/auth.middleware"
import { AppError } from "../middlewares/error.middleware"

const authService = new AuthService()

export class AuthController {
  public async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await authService.register(req.body)
      res.status(201).json({
        message: "User registered successfully.",
        user,
      })
    } catch (error) {
      next(error)
    }
  }


  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const result = await authService.login(req.body)
      res.status(200).json({
        message: "Login successful.",
        ...result,
      })
    } catch (error) {
      next(error)
    }
  }

  public async me(req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> {
    try {
      if (!req.user || !req.user.id) {
        throw new AppError("User authentication context missing.", 401)
      }

      const userProfile = await authService.getProfile(req.user.id)
      res.status(200).json(userProfile)
    } catch (error) {
      next(error)
    }
  }
}
