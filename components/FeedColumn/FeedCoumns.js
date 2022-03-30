import {
  Card,
  DataTable,
  Layout,
  Page,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
} from "@shopify/polaris";
import { useMemo, useState } from "react";
import { useFetchGraphql } from "../../libs/keystone";
import {
  PRODUCTS_QUERY,
  PRODUCT_ADD_MUTATION,
} from "../../libs/keystone/query";
import Provider from "../Provider";
import FeedColumnModalForm from "./FeedColumnModalForm";
import { getColumnContentTypes, getColumnHeadings, getRows } from "./utils";

const ProductFeeds = () => {
  const [active, setActive] = useState(false);
  const {
    data: { feedColumns: data } = {
      feedColumns: [],
    },
    error,
  } = useFetchGraphql({
    query: PRODUCTS_QUERY,
  });

  const { headings, columnContentTypes, rows } = useMemo(() => {
    return {
      columnContentTypes: getColumnContentTypes(data),
      rows: getRows(data),
      headings: getColumnHeadings(data),
    };
  }, [data]);
  return (
    <Page
      title="Feed columns"
      primaryAction={{
        content: "New row",
        onAction: () => {
          setActive(true);
        },
      }}
    >
      {data ? (
        <Card>
          <DataTable
            columnContentTypes={columnContentTypes}
            headings={headings}
            rows={rows}
          />
        </Card>
      ) : (
        <Layout.Section>
          <Card sectioned>
            <SkeletonBodyText />
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
          <Card sectioned>
            <TextContainer>
              <SkeletonDisplayText size="small" />
              <SkeletonBodyText />
            </TextContainer>
          </Card>
        </Layout.Section>
      )}
      <FeedColumnModalForm
        title="Add row"
        headings={headings}
        active={active}
        setActive={setActive}
        query={PRODUCT_ADD_MUTATION}
      />
    </Page>
  );
};
export default () => (
  <Provider>
    <ProductFeeds />
  </Provider>
);
