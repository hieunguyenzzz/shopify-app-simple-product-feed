import { ContentLoading } from '@components/common/PageLoading'
import dynamic from 'next/dynamic'

const XmlCodemirror = dynamic(() => import('./XmlCodemirror'), {
  ssr: false,
  loading: () => <ContentLoading />,
})
export default XmlCodemirror
