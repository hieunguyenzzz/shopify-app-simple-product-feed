import { ResourcePicker } from "@shopify/app-bridge-react";
import React from "react";

function Product() {
  return <ResourcePicker resourceType="Product" open allowMultiple={false} />;
}
export default Product;
