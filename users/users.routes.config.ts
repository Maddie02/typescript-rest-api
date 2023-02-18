import { CommonRoutesConfig } from '../common/common.routes.config'
import express from 'express'

export class UserRoutes extends CommonRoutesConfig {
    constructor(app: express.Application) {
        super(app, 'UserRoutes')
    }

    configureRoutes() {
        this.app
            .route('/users')
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send('List of users')
            })
            .post((req: express.Request, res: express.Response) => {
                res.status(200).send('Post to users')
            })

        this.app
            .route('/users/:userId')
            .all(
                (
                    req: express.Request,
                    res: express.Response,
                    next: express.NextFunction
                ) => {
                    next()
                }
            )
            .get((req: express.Request, res: express.Response) => {
                res.status(200).send(`GET requested id ${req.params.userId}`)
            })
            .put((req: express.Request, res: express.Response) => {
                res.status(200).send(`PUT requested id ${req.params.userId}`)
            })
            .patch((req: express.Request, res: express.Response) => {
                res.status(200).send(`PATCH requested id ${req.params.userId}`)
            })
            .delete((req: express.Request, res: express.Response) => {
                res.status(200).send(`DELETE requested id ${req.params.userId}`)
            })

        return this.app
    }
}
