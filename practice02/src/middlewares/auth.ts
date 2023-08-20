import { FastifyReply, FastifyRequest } from 'fastify'
import { database } from '../project/database'

export async function IsAuthenticatedMiddleware(
  req: FastifyRequest,
  res: FastifyReply,
) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      message: 'Token not received',
      error: 'Unauthorized',
      statusCode: 401,
    })
  } else {
    const user = await database('users')
      .where({
        token: req.headers.authorization.slice(6),
      })
      .first()
    if (!user) {
      return res.status(401).send({
        message: 'Invalid token',
        error: 'Unauthorized',
        statusCode: 401,
      })
    } else {
      req.user = user
    }
  }
}
