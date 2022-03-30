import {
  Card,
  Layout,
  SkeletonBodyText,
  SkeletonDisplayText,
  SkeletonPage,
  TextContainer,
} from "@shopify/polaris";
import dynamic from "next/dynamic";

const PageLoading = () => (
  <SkeletonPage primaryAction>
    <Layout>
      <Layout.Section>
        <Card sectioned>
          <SkeletonBodyText />
        </Card>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
        <Card sectioned>
          <TextContainer>
            <SkeletonDisplayText size="small" />
            <SkeletonBodyText />
          </TextContainer>
        </Card>
      </Layout.Section>
    </Layout>
  </SkeletonPage>
);
export const indexRoute = {
  path: "/",
  title: "Shop",
  component: dynamic(() => import("../components/Shop"), {
    loading: () => <PageLoading />,
  }),
};
export const countdownRoute = {
  path: "/countdown",
  title: "CountDown",
  component: dynamic(() => import("../components/CountDown"), {
    loading: () => <PageLoading />,
  }),
};
export const feedRoute = {
  path: "/feed",
  title: "Feed columns",
  component: dynamic(() => import("../components/FeedColumn/FeedCoumns"), {
    loading: () => <PageLoading />,
  }),
};
export const shopRoute = {
  path: "/shop",
  title: "Shop",
  component: dynamic(() => import("../components/Shop"), {
    loading: () => <PageLoading />,
  }),
};
export const productRoute = {
  path: "/product",
  title: "Product",
  component: dynamic(() => import("../components/Product"), {
    loading: () => <PageLoading />,
  }),
};
const routes = [indexRoute, feedRoute, shopRoute, productRoute, countdownRoute];
export default routes;
