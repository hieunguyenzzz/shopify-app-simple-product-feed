import { useAppBridge } from '@shopify/app-bridge-react'
import { Card, ContextualSaveBar, DataTable, Page } from '@shopify/polaris'
import { gql } from 'apollo-boost'
import { default as React, useEffect, useRef, useState } from 'react'
import { useQuery } from 'react-apollo'
const shopMetafieldsQuery = gql`
  {
    shop {
      name
      metafields(first: 99) {
        edges {
          node {
            namespace
            id
            key
            value
            type
            createdAt
            updatedAt
            description
          }
        }
      }
    }
  }
`

export default function Shop() {
  const defaultState = useRef({
    result: null,
  })
  const [refreshKey, setrefreshKey] = useState(false)
  const [isDirty, setIsDirty] = useState(false)
  const result = useQuery(shopMetafieldsQuery)
  const app = useAppBridge()
  useEffect(() => {
    window.app = app
    if (result?.data) {
      defaultState.current.result = result?.data?.shop
    }
  }, [result?.data])

  const contextualSaveBarMarkup = isDirty ? (
    <ContextualSaveBar
      message="Unsaved changes"
      saveAction={{
        onAction: handleSave,
      }}
      discardAction={{
        onAction: handleDiscard,
      }}
    />
  ) : null
  const rows =
    result?.data?.shop?.metafields?.edges.map(
      ({ node: { namespace, key, type, value } }) => [
        namespace,
        key,
        type,
        value,
      ]
    ) || []
  return (
    <>
      {contextualSaveBarMarkup}

      <Page key={refreshKey} title="Shop metafields">
        <Card sectioned>
          <DataTable
            columnContentTypes={['text', 'text', 'text', 'text']}
            headings={['namespace', 'key', 'type', 'value']}
            rows={rows}
            sortable={[false, true, false, false, true]}
            footerContent={`Showing ${rows.length} of ${rows.length} results`}
          />
        </Card>
      </Page>
    </>
  )
}
