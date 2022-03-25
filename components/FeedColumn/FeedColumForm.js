import { Button, Form, FormLayout, Select, TextField } from "@shopify/polaris";
import { useCallback, useState } from "react";
import { useSWRConfig } from "swr";
import { PRODUCT_ADD_MUTATION } from "../../libs/keystone/query";

export const FeedColumForm = ({
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
                  requiredIndicator
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
                  requiredIndicator
                  name={heading}
                  label={heading.toUpperCase()}
                  options={[
                    { label: "id", value: "id" },
                    { label: "title", value: "title" },
                    { label: "description", value: "description" },
                    { label: "price", value: "price" },
                    { label: "compare at price", value: "compare at price" },
                    { label: "handle", value: "handle" },
                  ]}
                  onChange={createHandleChange(heading)}
                  value={values[heading]}
                />
              );
            }
            return (
              <TextField
                requiredIndicator
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
export default FeedColumForm;
