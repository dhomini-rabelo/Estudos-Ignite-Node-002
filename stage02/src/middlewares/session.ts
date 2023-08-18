import { FastifyReply, FastifyRequest } from 'fastify'

export async function CheckSessionIdCookieExists(
  req: FastifyRequest,
  res: FastifyReply,
) {
  if (!req.cookies.sessionId) {
    return res.status(401).send({
      error: 'Unauthorized',
    })
  }
}
