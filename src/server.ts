import cors from 'cors'
import dotenv from 'dotenv'
import express, { type Request, type Response } from 'express'

dotenv.config()
const app = express()
const port = process.env.PORT

app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())


app.get('/', (request: Request, response: Response) => {

  response.json({
    message: 'Bem-vindo à API de Usuários!',
    timestamp: new Date().toISOString(),
    status: 'API funcionando!'
  })
})

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`)
  console.log(`Health: http://localhost:${port}/health`)
})
