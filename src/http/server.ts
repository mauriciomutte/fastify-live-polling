import fastify from 'fastify'
import cookie from '@fastify/cookie'

import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'

const app = fastify()
app.register(cookie, {
  secret: 'super-hard-secret-trust-me',
  hook: 'onRequest',
})

app.register(createPoll)
app.register(getPoll)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running! 🚀')
})
