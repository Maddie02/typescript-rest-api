import express from 'express'
import jwt from 'jsonwebtoken'
import crypto from 'crypto'
import { Jwt } from '../../common/types/jwt'
import usersService from '../../users/services/users.service'

const jwtSecret: string = process.env.JWT_SECRET ?? 'secret'

class JwtMiddleware {
    /**
     * Checks the presence of a refreshtoken in the body of the request
     * @param req the express request object
     * @param res the express response object
     * @param next the express next function
     * @returns continues with the next middleware function or returns "Bad request" status code with error message
     */
    verifyRefreshBodyField(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.body && req.body.refreshToken) {
            return next()
        } else {
            return res
                .status(400)
                .send({ errors: ['Missing required field: refreshToken'] })
        }
    }

    /**
     * Verifies refresh token and if the refresh token is correct for a specific user ID.
     * @param req the express request object
     * @param res the express response object
     * @param next the express next function
     * @returns continues with the next middleware function in the stack if the refresh token is valid or else returns a "Bad request" status code
     */
    async validRefreshToken(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        const user: any = await usersService.getUserByEmailWithPassword(
            res.locals.jwt.email
        )
        const salt = crypto.createSecretKey(
            Buffer.from(res.locals.jwt.refreshKey.data)
        )
        const hash = crypto
            .createHmac('sha512', salt)
            .update(res.locals.jwt.userId + jwtSecret)
            .digest('base64')

        if (hash === req.body.refreshToken) {
            req.body = {
                userId: user._id,
                email: user.email,
                permissionFlags: user.permissionFlags,
            }
            return next()
        } else {
            return res.status(400).send({ errors: ['Invalid refresh token'] })
        }
    }

    /**
     * Validates whether the API consumer sent a valid JWT in the HTTP headers respecting the convention Authorization: Bearer <token>
     * @param req the express request object
     * @param res the express response object
     * @param next the express next function
     * @returns continues with the next middleware in the stack if the jwt token is valid or returns a 4xx status code, depending on the error catched
     */
    validJWTNeeded(
        req: express.Request,
        res: express.Response,
        next: express.NextFunction
    ) {
        if (req.headers['authorization']) {
            try {
                const authorization = req.headers['authorization'].split(' ')
                if (authorization[0] !== 'Bearer') {
                    return res.status(401).send()
                } else {
                    res.locals.jwt = jwt.verify(
                        authorization[1],
                        jwtSecret
                    ) as Jwt
                    next()
                }
            } catch (err) {
                return res.status(403).send()
            }
        } else {
            return res.status(401).send()
        }
    }
}

export default new JwtMiddleware()
