import { FastifyInstance } from 'fastify'
import { z } from 'zod'

import { prisma } from '../../lib/prisma'
import { redis } from '../../lib/redis'

export async function getPoll(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string(),
    })

    const { pollId } = getPollParams.parse(request.params)

    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        options: {
          select: {
            id: true,
            title: true,
          },
        },
      },
    })

    if (!poll) {
      return reply.status(400).send({ message: 'Poll not found' })
    }

    const pollVotesFromRedis = await redis.zrange(pollId, 0, -1, 'WITHSCORES')
    const votes = pollVotesFromRedis.reduce((obj, curr, index) => {
      if (index % 2 === 0) {
        const score = pollVotesFromRedis[index + 1]
        obj[curr] = Number(score)
      }
      return obj
    }, {} as Record<string, number>)

    return reply.send({
      pollId: poll.id,
      title: poll.title,
      options: poll.options.map((option) => ({
        id: option.id,
        title: option.title,
        votes: votes[option.id] || 0,
      })),
    })
  })
}
