import { Modal } from "@shopify/polaris";
import { useCallback } from "react";
import { useSWRConfig } from "swr";
import { PRODUCTS_QUERY } from "../../libs/keystone/query";
import { useToast } from "../Provider";
import FeedColumForm from "./FeedColumForm";

export function FeedColumnModalForm({
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
        <FeedColumForm
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

export default FeedColumnModalForm;
