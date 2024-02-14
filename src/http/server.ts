import fastify from 'fastify'
import cookie from '@fastify/cookie'
import websocket from '@fastify/websocket'

import { createPoll } from './routes/create-poll'
import { getPoll } from './routes/get-poll'
import { voteOnPoll } from './routes/vote-on-poll'
import { pollResults } from './ws/poll-results'

const app = fastify()
// Plugins
app.register(websocket)
app.register(cookie, {
  secret: 'super-hard-secret-trust-me',
  hook: 'onRequest',
})
// HTTP routes
app.register(createPoll)
app.register(getPoll)
app.register(voteOnPoll)
// WS routes
app.register(pollResults)

app.listen({ port: 3333 }).then(() => {
  console.log('HTTP server is running! 🚀')
})
