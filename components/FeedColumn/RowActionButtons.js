import {
  Button,
  ButtonGroup,
  Icon,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import { DeleteMinor, EditMinor } from "@shopify/polaris-icons";
import { useState } from "react";
import { useSWRConfig } from "swr";
import {
  PRODUCTS_QUERY,
  PRODUCT_DELETE_MUTATION,
  PRODUCT_EDIT_MUTATION,
} from "../../libs/keystone/query";
import { useToast } from "../Provider";
import FeedColumnModalForm from "./FeedColumnModalForm";

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
      <FeedColumnModalForm
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
export default RowActionButtons;
