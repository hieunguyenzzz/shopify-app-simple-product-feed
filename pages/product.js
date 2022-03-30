import { ResourcePicker } from "@shopify/app-bridge-react";
import React from "react";
import RootLayout from "../components/RootLayout";

function Index() {
  return (
    <RootLayout>
      <ResourcePicker resourceType="Product" open allowMultiple={false} />
    </RootLayout>
  );
}
export default Index;
