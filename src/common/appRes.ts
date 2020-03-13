// @ts-check
import { Response, Request, NextFunction } from 'express'
import { ResJson } from '../class/resJson'

export class AppRes {
  public static sendJson (res: Response, isSuccess: boolean = false, message: string = '' , jsonData: any = null) {
    const obj: ResJson = {
      data: jsonData,
      message: message,
      success: isSuccess
    }
    res.set('Cache-Control', 'no-cache').json(obj)
    return

  }

  public static sendError (next: NextFunction, message: string, err?: any): void {
    let errors: any = []
    if (err instanceof Array) {
      err.forEach((e) => {
        errors.push(e)
      })
    } else {
      errors.push(err)
    }
    next({ message: message, data: errors })
    return
  }
}
