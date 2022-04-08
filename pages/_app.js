import { Provider, useAppBridge } from '@shopify/app-bridge-react'
import { authenticatedFetch } from '@shopify/app-bridge-utils'
import { Redirect } from '@shopify/app-bridge/actions'
import { AppProvider } from '@shopify/polaris'
import '@shopify/polaris/dist/styles.css'
import translations from '@shopify/polaris/locales/en.json'
import ApolloClient from 'apollo-boost'
import App from 'next/app'
import { useEffect, useMemo, useRef } from 'react'
import { ApolloProvider } from 'react-apollo'
import { RootProvider } from '../components/RootContext'
import RootTabsLayout from '../components/RootTabsLayout'

function userLoggedInFetch(app) {
  const fetchFunction = authenticatedFetch(app)

  return async (uri, options) => {
    const response = await fetchFunction(uri, options)

    if (
      response.headers.get('X-Shopify-API-Request-Failure-Reauthorize') === '1'
    ) {
      const authUrlHeader = response.headers.get(
        'X-Shopify-API-Request-Failure-Reauthorize-Url'
      )

      const redirect = Redirect.create(app)
      redirect.dispatch(Redirect.Action.APP, authUrlHeader || `/auth`)
      return null
    }

    return response
  }
}
function MyProvider(props) {
  const rootRef = useRef(null)
  const app = useAppBridge()
  const client = useMemo(() => {
    return new ApolloClient({
      fetch: userLoggedInFetch(app),
      fetchOptions: {
        credentials: 'include',
      },
    })
  }, [app])
  const Component = props.Component
  const { Layout = RootTabsLayout } = Component
  useEffect(() => {
    const fetch = userLoggedInFetch(app)
    rootRef.current = {
      app,
      client,
      fetch,
      apis: {
        getThemes: async () => {
          return await fetch('/api', {
            method: 'POST',
            body: JSON.stringify({
              path: 'themes',
              method: 'GET',
            }),
          })
        },
        createAsset: async (themeId, filename, value) => {
          return await fetch('/api', {
            method: 'POST',
            body: JSON.stringify({
              path: `themes/${themeId}/assets`,
              method: 'PUT',
              data: {
                asset: { key: 'assets/' + filename, value },
              },
            }),
          })
        },
        getAllAssets: async (themeId, filename, value) => {
          return await fetch('/api', {
            method: 'POST',
            body: JSON.stringify({
              path: `themes/${themeId}/assets`,
              method: 'GET',
            }),
          })
        },
      },
    }
    rootRef.current.apis
      .getThemes()
      .then((res) => {
        return res.json()
      })
      .then((res) => {
        rootRef.current.theme = res.themes.find((item) => item.role === 'main')
      })
  }, [app, client])

  return (
    <RootProvider value={rootRef}>
      <ApolloProvider client={client}>
        <Layout>
          <Component {...props} />
        </Layout>
      </ApolloProvider>
    </RootProvider>
  )
}

class MyApp extends App {
  render() {
    const theme = {}
    const { Component, pageProps, host } = this.props

    return (
      <AppProvider theme={theme} i18n={translations}>
        <Provider
          config={{
            apiKey: API_KEY,
            host,
            forceRedirect: true,
          }}
        >
          <MyProvider Component={Component} {...pageProps} />
        </Provider>
      </AppProvider>
    )
  }
}

MyApp.getInitialProps = async ({ ctx }) => {
  return {
    host: ctx.query.host,
  }
}

export default MyApp
