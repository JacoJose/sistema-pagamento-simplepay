import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "./error.middleware"

export interface JwtUserPayload {
  id: string
  email: string
  role: string
}

export interface AuthenticatedRequest extends Request {
  user?: JwtUserPayload
}

export const authenticateUser = (
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader) {
    throw new AppError("Authorization header is missing.", 401)
  }

  const [scheme, token] = authHeader.split(" ")

  if (scheme !== "Bearer" || !token) {
    throw new AppError("Invalid authorization format. Use 'Bearer <token>'.", 401)
  }

  try {
    const jwtSecret = process.env.JWT_SECRET || "default_jwt_secret"
    const decoded = jwt.verify(token, jwtSecret) as JwtUserPayload

    req.user = decoded
    next()
  } catch (error) {
    throw new AppError("Invalid or expired authentication token.", 401)
  }
}
