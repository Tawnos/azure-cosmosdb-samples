// @ts-check
import { NextFunction, Request, Router, Response } from 'express'
import { CosmosDbController } from '../controllers/cosmosdb.controller'

export class CosmonDbRouter {

  router: Router
  controller: CosmosDbController

  constructor () {
    this.router = Router()
    this.controller = new CosmosDbController()
    this.init()
  }

  init () {
    this.router.get('/list', this.controller.fetchList)
    this.router.get('/detail', this.controller.fetch)
    this.router.get('/create', this.controller.create)
    this.router.get('/update', this.controller.update)
    this.router.get('/delete', this.controller.delete)
  }
}

const cosmosdbRouter = new CosmonDbRouter()
cosmosdbRouter.init()

export default cosmosdbRouter.router
