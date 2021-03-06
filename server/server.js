import '@babel/polyfill'
import createShopifyAuth, { verifyRequest } from '@shopify/koa-shopify-auth'
import Shopify, { ApiVersion } from '@shopify/shopify-api'
import parse from 'co-body'
import 'isomorphic-fetch'
import Koa from 'koa'
import Router from 'koa-router'
import next from 'next'
const port = parseInt(process.env.PORT, 10) || 8081
const dev = process.env.NODE_ENV !== 'production'
const app = next({
  dev,
})
const handle = app.getRequestHandler()
const config = {
  API_KEY: process.env.SHOPIFY_API_KEY,
  API_SECRET_KEY: process.env.SHOPIFY_API_SECRET,
  SCOPES: process.env.SCOPES.split(','),
  HOST_NAME: process.env.HOST.replace(/https:\/\/|\/$/g, ''),
  API_VERSION: ApiVersion.Unstable,
  IS_EMBEDDED_APP: true,
  // This should be replaced with your preferred storage strategy
  SESSION_STORAGE: new Shopify.Session.MemorySessionStorage(),
}
console.log(JSON.stringify(config, null, 2))
Shopify.Context.initialize(config)

// Storing the currently active shops in memory will force them to re-login when your server restarts. You should
// persist this object in your app.
const ACTIVE_SHOPIFY_SHOPS = {}

Shopify.Webhooks.Registry.addHandler('APP_UNINSTALLED', {
  path: '/webhooks',
  webhookHandler: async (topic, shop, body) =>
    delete ACTIVE_SHOPIFY_SHOPS[shop],
})

app.prepare().then(async () => {
  const server = new Koa()
  const router = new Router()
  server.keys = [Shopify.Context.API_SECRET_KEY]
  server.use(
    createShopifyAuth({
      async afterAuth(ctx) {
        // Access token and shop available in ctx.state.shopify
        const { shop, accessToken, scope } = ctx.state.shopify
        const host = ctx.query.host
        ACTIVE_SHOPIFY_SHOPS[shop] = scope

        const responses = await Shopify.Webhooks.Registry.register({
          shop,
          accessToken,
          path: '/webhooks',
          topic: 'APP_UNINSTALLED',
        })

        if (!responses['APP_UNINSTALLED'].success) {
          console.log(
            `Failed to register APP_UNINSTALLED webhook: ${responses.result}`
          )
        }

        // Redirect to app with shop parameter upon auth
        ctx.redirect(`/?shop=${shop}&host=${host}`)
      },
    })
  )

  const handleRequest = async (ctx) => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
    ctx.res.statusCode = 200
  }

  router.post('/webhooks', async (ctx) => {
    try {
      await Shopify.Webhooks.Registry.process(ctx.req, ctx.res)
      console.log(`Webhook processed, returned status code 200`)
    } catch (error) {
      console.log(`Failed to process webhook: ${error}`)
    }
  })

  router.post(
    '/graphql',
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      await Shopify.Utils.graphqlProxy(ctx.req, ctx.res)
    }
  )
  router.all(
    '/api',
    verifyRequest({ returnHeader: true }),
    async (ctx, next) => {
      // Load the current session to get the `accessToken`.
      var body = await parse.json(ctx.req)
      console.log({ body })
      const { path, query, data, method = 'GET' } = body
      const session = await Shopify.Utils.loadCurrentSession(ctx.req, ctx.res)
      const client = new Shopify.Clients.Rest(session.shop, session.accessToken)
      let result
      switch (method) {
        case 'POST':
          result = await client.post({
            path,
            type: 'application/json',
            data,
          })

          break
        case 'PUT':
          result = await client.put({
            path,
            type: 'application/json',
            data,
          })

          break
        default:
          result = await client.get({
            path,
          })
          break
      }
      ctx.res.statusCode = 200
      ctx.res.end(JSON.stringify(result.body))
    }
  )
  router.get('(/_next/static/.*)', handleRequest) // Static content is clear
  router.get('/_next/webpack-hmr', handleRequest) // Webpack content is clear
  router.get('(.*)', async (ctx) => {
    const shop = ctx.query.shop
    // This shop hasn't been seen yet, go through OAuth to create a session
    if (ACTIVE_SHOPIFY_SHOPS[shop] === undefined) {
      ctx.redirect(`/auth?shop=${shop}`)
    } else {
      await handleRequest(ctx)
    }
  })

  server.use(router.allowedMethods())
  server.use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})
