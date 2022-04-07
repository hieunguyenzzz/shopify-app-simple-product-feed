import dynamic from 'next/dynamic'
import PageLoading from '../components/common/PageLoading'

export const indexRoute = {
  path: '/',
  title: 'Shop',
  component: dynamic(() => import('../components/Shop'), {
    ssr: false,
    loading: () => <PageLoading />,
  }),
}
export const countdownRoute = {
  path: '/countdown',
  title: 'CountDown',
  component: dynamic(() => import('../components/CountDown'), {
    ssr: false,
    loading: () => <PageLoading />,
  }),
}
export const feedRoute = {
  path: '/feed',
  title: 'Feed columns',
  component: dynamic(() => import('../components/FeedColumn/FeedCoumns'), {
    ssr: false,
    loading: () => <PageLoading />,
  }),
}
export const shopRoute = {
  path: '/shop',
  title: 'Shop',
  component: dynamic(() => import('../components/Shop'), {
    ssr: false,
    loading: () => <PageLoading />,
  }),
}
export const productRoute = {
  path: '/product',
  title: 'Product',
  component: dynamic(() => import('../components/Product'), {
    ssr: false,
    loading: () => <PageLoading />,
  }),
}
const routes = [indexRoute, feedRoute, productRoute, countdownRoute]
export default routes
