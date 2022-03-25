import { Frame, Tabs } from "@shopify/polaris";
import { useRouter } from "next/router";
import { useCallback } from "react";

function AppLayout({ children }) {
  const routers = useRouter();

  const handleTabChange = useCallback(
    (selectedTabIndex) => setSelected(selectedTabIndex),
    []
  );

  const tabs = [
    {
      id: "/",
      content: "Feed columns",
      panelID: "accepts-marketing-content-1",
    },
    {
      id: "/feed",
      content: "Feeds",
      panelID: "accepts-marketing-content-2",
    },
    {
      id: "/filter",
      content: "Filter",
      panelID: "accepts-marketing-content-3",
    },
    {
      id: "/general",
      content: "Settings",
      accessibilityLabel: "General",
      panelID: "all-customers-content-1",
    },
  ];
  return (
    <>
      <Frame>
        <Tabs
          tabs={tabs}
          selected={tabs.findIndex(
            (tab) => tab.id === (routers.asPath === "" ? "/" : routers.asPath)
          )}
          onSelect={(index) => {
            routers.push("/" + tabs[index].id);
          }}
        >
          {children}
        </Tabs>
      </Frame>
    </>
  );
}
export default AppLayout;
