import express from 'express'
import * as http from 'http'
import dotenv from 'dotenv'
import * as winston from 'winston'
import * as expressWinston from 'express-winston'
import cors from 'cors'
import { CommonRoutesConfig } from './common/common.routes.config'
import { UserRoutes } from './users/users.routes.config'
import debug from 'debug'
import { AuthRoutes } from './auth/auth.routes.config'
import helmet from 'helmet'

dotenv.config()

const app: express.Application = express()
const server: http.Server = http.createServer(app)
const port = 3000
const routes: Array<CommonRoutesConfig> = []
const debugLog: debug.IDebugger = debug('app')

app.use(express.json())
app.use(cors())
app.use(helmet())

const loggerOptions: expressWinston.LoggerOptions = {
    transports: [new winston.transports.Console()],
    format: winston.format.combine(
        winston.format.json(),
        winston.format.prettyPrint(),
        winston.format.colorize({ all: true })
    ),
}

if (!process.env.DEBUG) {
    loggerOptions.meta = false
    if (typeof global.it === 'function') {
        loggerOptions.level = 'http'
    }
}

app.use(expressWinston.logger(loggerOptions))

routes.push(new UserRoutes(app))
routes.push(new AuthRoutes(app))

const runningMessage = `Server running at http://localhost:${port}`
app.get('/', (req: express.Request, res: express.Response) => {
    res.status(200).send(runningMessage)
})

export default server.listen(port, () => {
    routes.forEach((route: CommonRoutesConfig) => {
        debugLog(`Routes configured for ${route.getName()}`)
    })
    console.log(runningMessage)
})
