import { Request, Response, NextFunction } from "express"
import { UserService } from "../services/user.service"

const userService = new UserService()

export class UserController {
  public async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const users = await userService.getAllUsers()
      res.status(200).json(users)
    } catch (error) {
      next(error)
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const user = await userService.getUserById(id)
      res.status(200).json(user)
    } catch (error) {
      next(error)
    }
  }

  public async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const user = await userService.createUser(req.body)
      res.status(201).json({
        message: "User created successfully.",
        user,
      })
    } catch (error) {
      next(error)
    }
  }

  public async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const updatedUser = await userService.updateUser(id, req.body)
      res.status(200).json({
        message: "User updated successfully.",
        user: updatedUser,
      })
    } catch (error) {
      next(error)
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params.id as string
      const result = await userService.deleteUser(id)
      res.status(200).json(result)
    } catch (error) {
      next(error)
    }
  }
}
