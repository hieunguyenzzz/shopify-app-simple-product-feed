import useSWR from "swr";
import { KEYSTONE_API_URL } from "./const";

export const fetcher = async (query, variables) =>
  await fetch(KEYSTONE_API_URL, {
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
