// @ts-check
import { CosmosClient, Database, Container } from '@azure/cosmos'
import { NextFunction, Request, Response } from 'express'
import { AppRes } from '../common/appRes'
import { AppConfig } from '../config/appConfig'

export class CosmosDbController {
  private _errors: any

  public async fetchList(req: Request, res: Response, next: NextFunction) {
    try {
      const { endpoint, key, databaseId, containerId } = AppConfig.COSMOSDB_CONFIG
      const client: CosmosClient = new CosmosClient({ endpoint, key })
      const database: Database = client.database(databaseId)
      const container: Container = database.container(containerId)

      const querySpec = {
        query: "SELECT * FROM Items"
      }
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll()
      console.info("fetch success!")
      AppRes.sendJson(res, true, "fetch success!", items)
    } catch (e) {
      console.error(e.message)
      this._errors.push(e.message)
      AppRes.sendError(next, "fetch error.", this._errors)
    }
  }

  public async fetch(req: Request, res: Response, next: NextFunction) {
    try {
      const { endpoint, key, databaseId, containerId } = AppConfig.COSMOSDB_CONFIG
      const client: CosmosClient = new CosmosClient({ endpoint, key })
      const database: Database = client.database(databaseId)
      const container: Container = database.container(containerId)

      const querySpec = {
        query: "SELECT * FROM Items WHERE Items.id = @itemId",
        parameters: [
          {
            name: "@itemId",
            value: `${req.query.id}`
          }
        ]
      }
      const { resources: items } = await container.items
        .query(querySpec)
        .fetchAll()
      console.info("fetch success!")
      if (items.length == 0) {
        AppRes.sendJson(res, true, "No data.", items)
      } else {
        AppRes.sendJson(res, true, "fetch success!", items)
      }
    } catch (e) {
      console.error(e.message)
      this._errors.push(e.message)
      AppRes.sendError(next, "fetch error.", this._errors)
    }
  }

  public async create(req: Request, res: Response, next: NextFunction) {
    try {
      const { endpoint, key, databaseId, containerId } = AppConfig.COSMOSDB_CONFIG
      const client: CosmosClient = new CosmosClient({ endpoint, key })
      const database: Database = client.database(databaseId)
      const container: Container = database.container(containerId)

      const newItem = {
        id: req.query.id,
        category: req.query.category,
        name: req.query.name,
        description: "",
        isAlive: true
      }
      await container.items.create(newItem)
      AppRes.sendJson(res, true, "create success!", newItem)
    } catch (e) {
      console.error(e.message)
      this._errors.push(e.message)
      AppRes.sendError(next, "create error.", this._errors)
    }
  }

  public async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { endpoint, key, databaseId, containerId } = AppConfig.COSMOSDB_CONFIG
      const client: CosmosClient = new CosmosClient({ endpoint, key })
      const database: Database = client.database(databaseId)
      const container: Container = database.container(containerId)

      const updateItem = {
        id: req.query.id,
        category: req.query.category,
        name: req.query.name
      }
      await container.item(req.query.id, req.query.category)
        .replace(updateItem);
        AppRes.sendJson(res, true, "update success!", updateItem)
    } catch (e) {
      console.error(e.message)
      this._errors.push(e.message)
      AppRes.sendError(next, "update error.", this._errors)
    }
  }

  public async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const { endpoint, key, databaseId, containerId } = AppConfig.COSMOSDB_CONFIG
      const client: CosmosClient = new CosmosClient({ endpoint, key })
      const database: Database = client.database(databaseId)
      const container: Container = database.container(containerId)
      await container.item(req.query.id, req.query.category).delete()
      AppRes.sendJson(res, true, `delete item id=${req.query.id} category=${req.query.category}`)
    } catch (e) {
      console.error(e.message)
      this._errors.push(e.message)
      AppRes.sendError(next, "delete error.", this._errors)
    }
  }
}
