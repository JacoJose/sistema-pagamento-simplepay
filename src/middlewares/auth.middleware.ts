import { NextFunction, Request, Response } from "express"
import jwt from "jsonwebtoken"
import { AppError } from "./error.middleware"
import { Prisma } from "@prisma/client"
import { PrismaClient } from "@prisma/client/extension"

const prisma = new PrismaClient(); // Só para complementar -Samuel

export interface JwtMerchantPayload {
  id: string
  email: string
}

export interface AuthenticatedRequest extends Request {
  user?: JwtMerchantPayload
}

export const authenticateMerchant = (
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
    const decoded = jwt.verify(token, jwtSecret) as JwtMerchantPayload

    req.user = decoded
    next()
  } catch (error) {
    throw new AppError("Invalid or expired authentication token.", 401)
  }
}

//[TICKET-BANK-02] - Samuel
export async function requireApiKeyOrJWT(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  const apiKey = req.headers["x-api-key"] as string | undefined;

  if(apiKey) {
    const merchant = await prisma.merchant.findUnique({where: {apiKey}});
    if(!merchant) return res.status(401).json({ error: "API Key inválido"});
    req.user = {
      id: merchant.id,
      email: merchant.email
    }
    return next();
  }
  return authenticateMerchant(req, res, next);
}