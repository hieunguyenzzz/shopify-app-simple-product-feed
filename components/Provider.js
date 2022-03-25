import { Frame, Toast } from "@shopify/polaris";
import { createContext, useContext, useState } from "react";
import { SWRConfig } from "swr";
import { fetcher } from "../libs/keystone";
const ToastContext = createContext({});
export const ToastProvider = ({ children }) => {
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
export const useToast = () => {
  const { message, setMessage } = useContext(ToastContext);
  return { message, setMessage };
};
export default function Provider({ children }) {
  return (
    <SWRConfig
      value={{
        provider: () => new Map(),
        fetcher: fetcher,
        revalidateIfStale: false,
        revalidateOnFocus: false,
        revalidateOnReconnect: true,
      }}
    >
      <Frame>
        <ToastProvider>{children}</ToastProvider>
      </Frame>
    </SWRConfig>
  );
}
