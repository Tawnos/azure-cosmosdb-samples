// @ts-check
import bodyParser from 'body-parser'
import cookieParser from 'cookie-parser'
import express from 'express'
import { NextFunction, Request, Response } from 'express'
import logger from 'morgan'
import cors from 'cors'
import { AppRes } from './common/appRes'
import { AppConfig } from './config/appConfig'
import CosmonDbRouter from './routes/cosmosdbRouter'

class App {
  public express: express.Express

  constructor() {
    this.express = express()
    this.middleware()
    this.routes()
  }

  private middleware(): void {
    this.express.use(cors({
      credentials: true,
      methods: 'GET',
      origin: ['']
    }))
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      console.debug((new Date().toLocaleDateString()) +
        '@@@Request Url' + req.url)
      next()
    })
    this.express.use(bodyParser.json({
      limit: AppConfig.MAX_REQUEST_SIZE
    }))
    this.express.use(cookieParser())
    this.express.use(logger('dev'))
  }

  private routes(): void {
    this.express.use('/api/cosmosdb', CosmonDbRouter)
    this.express.use((req: Request, res: Response, next: NextFunction) => {
      next({ message: `Requested Path is undefined. url=${req.url}` })
    })
    this.express.use((err: any, req: Request, res: Response, next: NextFunction) => {
      if (!res.headersSent) {
        AppRes.sendJson(res, false, err.message, err.data)
      }
    })
  }
}

const port = AppConfig.PORT_NUMBER
const app = new App()
app.express.listen(port, () => {
  console.info(`Waiting at port ${port}. DateTime=${escape(new Date().toLocaleDateString())}`)
}).on('error', (error) => {
  console.error(`Port ${port} does not open. \r\n${error.message}`)
  process.exit(1)
})
