import {
  Card,
  ContextualSaveBar,
  DatePicker,
  FormLayout,
  Layout,
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
import { useMutation, useQuery } from "react-apollo";
const countdownQuery = gql`
  {
    shop {
      id
      metafield(namespace: "global", key: "countdown_timer") {
        namespace
        id
        key
        value
      }
    }
  }
`;
const countdownMutation = gql`
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
export default function General({ skipToContentTarget }) {
  const defaultState = useRef({
    countdownFieldValue: null,
  });
  const [refreshKey, setrefreshKey] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [countdownFieldValue, setCountdownFieldValue] = useState(
    defaultState.current.countdownFieldValue
  );
  const countdownQueryResult = useQuery(countdownQuery);
  const [mutateFunction, { data, loading, error }] = useMutation(
    countdownMutation
  );
  useEffect(() => {
    if (countdownQueryResult?.data) {
      defaultState.current.countdownFieldValue =
        countdownQueryResult?.data?.shop?.metafield?.value;
    }
  }, [countdownQueryResult?.data]);
  const handleDiscard = useCallback(() => {
    setCountdownFieldValue(defaultState.current.countdownFieldValue);
    setIsDirty(false);
    setrefreshKey(Date.now());
  }, []);

  const handleSave = useCallback(() => {
    mutateFunction({
      variables: {
        metafields: {
          ownerId: countdownQueryResult?.data?.shop?.id,
          namespace: "global",
          key: "countdown_timer",
          value: countdownFieldValue,
          type: "single_line_text_field",
        },
      },
    });
    defaultState.current.countdownFieldValue = countdownFieldValue;
    setIsDirty(false);
    setToastActive(true);
  }, [
    countdownFieldValue,
    countdownQueryResult?.data?.shop?.id,
    mutateFunction,
  ]);
  const handleFieldChange = useCallback((value) => {
    setCountdownFieldValue(value);
    defaultState.current.countdownFieldValue !== value && setIsDirty(true);
  }, []);
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
  return (
    <>
      {contextualSaveBarMarkup}

      <Page key={refreshKey} title="General">
        <Layout>
          {skipToContentTarget}
          <Layout.AnnotatedSection
            title="Countdown timer"
            description="Select date and time"
          >
            <Card sectioned>
              <FormLayout>
                <CustomDatePicker
                  onChange={handleFieldChange}
                  defaultValue={
                    countdownQueryResult?.data?.shop?.metafield?.value
                  }
                />
              </FormLayout>
            </Card>
          </Layout.AnnotatedSection>
        </Layout>
      </Page>
    </>
  );
}
