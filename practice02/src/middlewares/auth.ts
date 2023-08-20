import { FastifyReply, FastifyRequest } from 'fastify'

export async function IsAuthenticatedMiddleware(
  req: FastifyRequest,
  res: FastifyReply,
) {
  if (!req.headers.authorization) {
    return res.status(401).send({
      error: 'Unauthorized',
      statusCode: 401,
    })
  }
}
