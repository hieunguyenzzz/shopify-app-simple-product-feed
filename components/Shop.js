import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Card,
  ContextualSaveBar,
  DataTable,
  DatePicker,
  Page,
} from "@shopify/polaris";
import { gql } from "apollo-boost";
import {
  default as React,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { useQuery } from "react-apollo";
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
`;
const shopMetafieldsMutation = gql`
  mutation setMetafield($metafields: [MetafieldsSetInput!]!) {
    metafieldsSet(metafields: $metafields) {
      metafields {
        namespace
        id
        key
        value
      }
      userErrors {
        code
        message
      }
    }
  }
`;
function CustomDatePicker({ onChange, defaultValue }) {
  const [selectedDates, setSelectedDates] = useState(() =>
    defaultValue ? new Date(defaultValue) : new Date()
  );
  const [{ month, year }, setDate] = useState({
    month: selectedDates.getMonth(),
    year: selectedDates.getFullYear(),
  });

  const handleMonthChange = useCallback((month, year) => {
    setDate({ month, year });
  }, []);
  useEffect(() => {
    if (defaultValue !== selectedDates) onChange(selectedDates);
  }, [defaultValue, onChange, selectedDates]);
  return (
    <DatePicker
      month={month}
      year={year}
      onChange={({ start }) => setSelectedDates(start)}
      onMonthChange={handleMonthChange}
      selected={selectedDates}
    />
  );
}
export default function Shop() {
  const defaultState = useRef({
    result: null,
  });
  const [refreshKey, setrefreshKey] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const result = useQuery(shopMetafieldsQuery);
  const app = useAppBridge();
  useEffect(() => {
    window.app = app;
    if (result?.data) {
      defaultState.current.result = result?.data?.shop;
    }
  }, [result?.data]);

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
  ) : null;
  const rows =
    result?.data?.shop?.metafields?.edges.map(
      ({ node: { namespace, key, type, value } }) => [
        namespace,
        key,
        type,
        value,
      ]
    ) || [];
  return (
    <>
      {contextualSaveBarMarkup}

      <Page key={refreshKey} title="Shop metafields">
        <Card sectioned>
          <DataTable
            columnContentTypes={["text", "text", "text", "text"]}
            headings={["namespace", "key", "type", "value"]}
            rows={rows}
            sortable={[false, true, false, false, true]}
            footerContent={`Showing ${rows.length} of ${rows.length} results`}
          />
        </Card>
      </Page>
    </>
  );
}
