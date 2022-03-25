import useSWR from "swr";

export const fetcher = (query, variables) =>
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
export const useFetchGraphql = ({ query, variables = null }) => {
  const { data, error, isValidating, mutate } = useSWR([query, variables]);
  return { data, error, isValidating, mutate };
};
