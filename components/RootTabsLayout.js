import { Frame, Loading, Tabs, Toast, TopBar } from "@shopify/polaris";
import { useRouter } from "next/router";
import React, { useCallback, useRef, useState } from "react";
import routes from "../libs/routes";

const tabs = routes.map((item) => {
  return {
    id: item.path,
    content: item.title,
    accessibilityLabel: item.title,
    panelID: item.path,
  };
});
function RootTabsLayout({ children }) {
  const router = useRouter();
  const skipToContentRef = useRef(null);
  const [toastActive, setToastActive] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [userMenuActive, setUserMenuActive] = useState(false);
  const [mobileNavigationActive, setMobileNavigationActive] = useState(false);

  const toggleToastActive = useCallback(
    () => setToastActive((toastActive) => !toastActive),
    []
  );
  const toggleUserMenuActive = useCallback(
    () => setUserMenuActive((userMenuActive) => !userMenuActive),
    []
  );
  const toggleMobileNavigationActive = useCallback(
    () =>
      setMobileNavigationActive(
        (mobileNavigationActive) => !mobileNavigationActive
      ),
    []
  );

  const toastMarkup = toastActive ? (
    <Toast onDismiss={toggleToastActive} content="Changes saved" />
  ) : null;

  const userMenuActions = [
    {
      items: [{ content: "Community forums" }],
    },
  ];

  const userMenuMarkup = (
    <TopBar.UserMenu
      actions={userMenuActions}
      name="Meraki"
      initials="👍"
      open={userMenuActive}
      onToggle={toggleUserMenuActive}
    />
  );

  const topBarMarkup = (
    <TopBar
      showNavigationToggle
      userMenu={userMenuMarkup}
      onNavigationToggle={toggleMobileNavigationActive}
    />
  );

  const loadingMarkup = isLoading ? <Loading /> : null;

  const skipToContentTarget = (
    <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
  );
  return (
    <div style={{ height: "500px" }}>
      <Frame
        topBar={topBarMarkup}
        skipToContentTarget={skipToContentRef.current}
      >
        <Tabs
          tabs={tabs}
          selected={tabs.findIndex(
            (tab) => tab.id === (router.asPath === "" ? "/" : router.asPath)
          )}
          onSelect={(index) => {
            router.push("/" + tabs[index].id);
          }}
        ></Tabs>
        {skipToContentTarget}
        {children}
        {loadingMarkup}
        {toastMarkup}
      </Frame>
    </div>
  );
}
export default RootTabsLayout;
