import FeedCoumns from "../components/FeedColum/FeedCoumns";

export const getStaticProps = async (ctx) => {
  return {
    props: {
      data: null,
    },
  };
};

export default FeedCoumns;
