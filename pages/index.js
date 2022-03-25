import {
  Button,
  ButtonGroup,
  Card,
  DataTable,
  Form,
  FormLayout,
  Frame,
  Icon,
  Layout,
  Modal,
  Page,
  Select,
  SkeletonBodyText,
  SkeletonDisplayText,
  TextContainer,
  TextField,
  Toast,
} from "@shopify/polaris";
import { DeleteMinor, EditMinor } from "@shopify/polaris-icons";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import useSWR, { SWRConfig, useSWRConfig } from "swr";
import AppLayout from "../components/AppLayout";

const fetcher = (query, variables) =>
  fetch("/api/graphql", {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify({
      operationName: null,
      variables,
      query,
    }),
  })
    .then((r) => r.json())
    .then((res) => res.data);
const useFetchGraphql = ({ query, variables = null }) => {
  const { data, error, isValidating, mutate } = useSWR([query, variables]);
  return { data, error, isValidating, mutate };
};
function getColumnContentTypes(data) {
  if (!data.length) return [];
  return [
    ...Object.keys(data[0]).map(function () {
      return "text";
    }),
    "numeric",
  ];
}
const PRODUCTS_QUERY = `{\n  feedColumns(orderBy:{id:desc}) {\n    id\n    title\n    metafield\n    type\n    default\n  }\n}\n`;
const PRODUCT_ADD_MUTATION = `mutation ($title:String $type:String, $default:String  ) {
  createFeedColumn(data: {title:$title, type:$type, default: $default}) {
    id
    title
    metafield
    type
    default
  }
}`;
const PRODUCT_EDIT_MUTATION = `mutation  updateFeedColumn($id:ID!,$title:String $type:String, $default:String ){
  updateFeedColumn(where:{id:$id},data: {title:$title, type:$type, default: $default}){
    id
    title
    metafield
    type
    default
  }
}`;
const PRODUCT_DELETE_MUTATION = `mutation  deleteFeedColumn($id:ID! ){
  deleteFeedColumn(where:{id:$id}){
    id
    
  }
}`;
const ToastContext = createContext({});
const ToastProvider = ({ children }) => {
  const [message, setMessage] = useState(null);
  const toastMarkup = message ? (
    <Toast
      content={message}
      onDismiss={() => setMessage(null)}
      duration={2000}
    />
  ) : null;
  return (
    <ToastContext.Provider value={{ message, setMessage }}>
      {children}
      {toastMarkup}
    </ToastContext.Provider>
  );
};
const useToast = () => {
  const { message, setMessage } = useContext(ToastContext);
  return { message, setMessage };
};
function ModalForm({
  headings,
  fetcher,
  defaultValues = {},
  title = "New row",
  query,
  active,
  setActive,
}) {
  const handleModalChange = useCallback(() => setActive(!active), [
    active,
    setActive,
  ]);
  const handleClose = () => {
    handleModalChange();
  };
  const { setMessage } = useToast();
  const { mutate } = useSWRConfig();
  return (
    <Modal co open={active} onClose={handleClose} title={title}>
      <Modal.Section>
        <AddNewForm
          fetcher={fetcher}
          defaultValues={defaultValues}
          query={query}
          headings={headings}
          onSuccess={async () => {
            setMessage("Success !");
            await mutate([PRODUCTS_QUERY, null]);
            handleClose();
          }}
        />
      </Modal.Section>
    </Modal>
  );
}
function getColumnHeadings(data) {
  return ["id", "title", "type", "metafield", "default", ""];
}
const RowActionButtons = ({ value, headings }) => {
  const [pending, setPending] = useState(false);
  const { setMessage } = useToast();
  const [active, setActive] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const { fetcher, mutate } = useSWRConfig();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        ...(pending
          ? {
              opacity: 0.5,
              pointerEvents: "none",
            }
          : {}),
      }}
    >
      <ButtonGroup key="action">
        <Button key="edit" outline size="slim" onClick={() => setActive(true)}>
          <Icon source={EditMinor} color="primary" />
        </Button>
        <Button
          key="remove"
          onClick={() => setOpenDelete(true)}
          outline
          size="slim"
          destructive
        >
          <Icon source={DeleteMinor} color="base" />
        </Button>
      </ButtonGroup>
      <ModalForm
        defaultValues={value}
        headings={headings}
        title="Edit row"
        fetcher={(query, values) => {
          fetcher(query, {
            ...values,
            id: value.id,
          });
        }}
        active={active}
        setActive={setActive}
        query={PRODUCT_EDIT_MUTATION}
      />
      <Modal
        title="Do your want delete this row ?"
        titleHidden
        open={openDelete}
        onClose={() => setOpenDelete(false)}
      >
        <Modal.Section>
          <TextContainer>
            <p>Do you want delete this row ?</p>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
              }}
            >
              <ButtonGroup key="action">
                <Button
                  key="edit"
                  size="slim"
                  onClick={() => setOpenDelete(false)}
                >
                  Cancel
                </Button>
                <Button
                  loading={pending}
                  key="remove"
                  onClick={async (_event) => {
                    setOpenDelete(false);
                    setPending(true);
                    await fetcher(PRODUCT_DELETE_MUTATION, {
                      id: value.id,
                    });
                    setPending(false);
                    setMessage("Deleted !");
                    await mutate([PRODUCTS_QUERY, null]);
                  }}
                  primary
                  size="slim"
                  destructive
                >
                  Delete
                </Button>
              </ButtonGroup>
            </div>
          </TextContainer>
        </Modal.Section>
      </Modal>
    </div>
  );
};
function getRows(data) {
  const headings = getColumnHeadings(data);
  const result = data?.map(function (item) {
    return [
      ...Object.values(item).map((value, i) => {
        return value;
      }),
      <RowActionButtons key="actions" value={item} headings={headings} />,
    ];
  });
  return result || [];
}
const ProductFeed = () => {
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
    <AppLayout>
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
        <ModalForm
          title="Add row"
          headings={headings}
          active={active}
          setActive={setActive}
          query={PRODUCT_ADD_MUTATION}
        />
      </Page>
    </AppLayout>
  );
};
const AddNewForm = ({
  defaultValues = {},
  fetcher,
  query = PRODUCT_ADD_MUTATION,
  headings,
  onSuccess,
}) => {
  const { fetcher: defaultFetcher } = useSWRConfig();
  const [values, setValues] = useState(defaultValues);
  const [pending, setPending] = useState(false);
  const handleSubmit = useCallback(
    async (_event) => {
      setPending(true);
      if (fetcher) {
        await fetcher(query, values);
      } else {
        await defaultFetcher(query, values);
      }
      setValues(defaultValues);
      onSuccess && onSuccess();
    },
    [defaultFetcher, defaultValues, fetcher, onSuccess, query, values]
  );
  const createHandleChange = (name) => (value) => {
    setValues({ ...values, [name]: value });
  };
  return (
    <Form onSubmit={handleSubmit}>
      <FormLayout>
        {headings
          .filter(Boolean)
          .filter((heading) => heading !== "id")
          .map((heading, i) => {
            if (heading == "type") {
              return (
                <Select
                  name={heading}
                  label={heading.toUpperCase()}
                  options={[
                    { label: "metafield mapping", value: "metafield" },
                    { label: "data mapping", value: "data" },
                  ]}
                  onChange={createHandleChange(heading)}
                  value={values[heading]}
                />
              );
            }
            if (heading == "metafield" && values["type"] === "data") {
              return (
                <Select
                  name={heading}
                  label={heading.toUpperCase()}
                  options={[
                    { label: "metafield mapping", value: "metafield" },
                    { label: "data mapping", value: "data" },
                  ]}
                  onChange={createHandleChange(heading)}
                  value={values[heading]}
                />
              );
            }
            return (
              <TextField
                name={heading}
                key={heading}
                label={heading.toUpperCase()}
                value={values[heading]}
                onChange={createHandleChange(heading)}
                autoComplete="off"
              />
            );
          })}

        <Button primary submit loading={pending}>
          Submit
        </Button>
      </FormLayout>
    </Form>
  );
};
export const getStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  };
};

export default function Index() {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        fetcher,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }}
    >
      <Frame>
        <ToastProvider>
          <ProductFeed />
        </ToastProvider>
      </Frame>
    </SWRConfig>
  );
}
