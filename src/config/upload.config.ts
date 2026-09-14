import fs from "fs"
import path from "path"

const envUploadDir = process.env.UPLOAD_DIR

const directory = path.resolve(envUploadDir!)

if (!fs.existsSync(directory)) {
  fs.mkdirSync(directory, { recursive: true })
}

export const uploadConfig = {
  directory,
}
