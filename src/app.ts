import cors from 'cors'
import express, { NextFunction, type Request, type Response } from 'express'
import router from './routes'

const app = express()

app.use(cors())
app.use(express.json())



app.use((req: Request, _res: Response, next: NextFunction) => {
  console.log(`${new Date().toISOString()}, ${req.method}, ${req.url} `)
  next()
})


app.use("/api/v1/", router)


export default app