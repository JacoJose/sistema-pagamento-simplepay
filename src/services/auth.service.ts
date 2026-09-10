import { PrismaClient, User } from "@prisma/client"


const prisma = new PrismaClient()


export class AuthService {
  public async register(data: User) {

    const user = await prisma.user.create({
      data,
    })

    return user
  }
}