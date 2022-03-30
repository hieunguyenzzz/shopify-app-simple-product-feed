import { Frame, Loading, Navigation, Toast, TopBar } from "@shopify/polaris";
import { HomeMajor } from "@shopify/polaris-icons";
import { useRouter } from "next/router";
import React, { useCallback, useRef, useState } from "react";

function RootLayout({ children }) {
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
  const navigationMarkup = (
    <Navigation location="/">
      <Navigation.Section
        title="Shopify App"
        items={[
          {
            label: "Genaral",
            icon: HomeMajor,
            onClick: () => router.push("/"),
          },
          {
            label: "Shop",
            icon: HomeMajor,
            onClick: () => router.push("/shop"),
          },
          {
            label: "Product",
            icon: HomeMajor,
            onClick: () => router.push("/product"),
          },
        ]}
      />
    </Navigation>
  );

  const loadingMarkup = isLoading ? <Loading /> : null;

  const skipToContentTarget = (
    <a id="SkipToContentTarget" ref={skipToContentRef} tabIndex={-1} />
  );

  return (
    <div style={{ height: "500px" }}>
      <Frame
        topBar={topBarMarkup}
        navigation={navigationMarkup}
        showMobileNavigation={mobileNavigationActive}
        onNavigationDismiss={toggleMobileNavigationActive}
        skipToContentTarget={skipToContentRef.current}
      >
        {skipToContentTarget}
        {loadingMarkup}
        {children}
        {toastMarkup}
      </Frame>
    </div>
  );
}
export default RootLayout;
