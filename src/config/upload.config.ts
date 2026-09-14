import dotenv from "dotenv"
import fs from "fs"
import path from "path"

dotenv.config()

const directory = path.resolve(process.env.UPLOAD_DIR!)

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true })
}

export const uploadConfig = {
  directory,
}
