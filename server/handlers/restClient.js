import Shopify from '@shopify/shopify-api'
export const createRestClient = async (req, res) => {
  const session = await Shopify.Utils.loadCurrentSession(req, res)
  // Create a new client for the specified shop.
  const client = new Shopify.Clients.Rest(session.shop, session.accessToken)
  const result = await client.get({
    path: `themes`,
  })
  r
  console.log({ result })
  ctx.res.statusCode = 200
  ctx.res.end(JSON.stringify(result.body))
}
