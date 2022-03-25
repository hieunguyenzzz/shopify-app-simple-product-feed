import FeedCoumns from "../components/FeedColumn/FeedCoumns";

export const getStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  };
};

export default FeedCoumns;
