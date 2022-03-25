import RowActionButtons from "./RowActionButtons";

export function getColumnContentTypes(data) {
  if (!data.length) return [];
  return [
    ...Object.keys(data[0]).map(function () {
      return "text";
    }),
    "numeric",
  ];
}
export function getColumnHeadings(data) {
  return ["id", "title", "type", "metafield", "default", ""];
}
export function getRows(data) {
  const headings = getColumnHeadings(data);
  const result = data?.map(function (item) {
    return [
      ...Object.values(item).map((value, i) => {
        return value;
      }),
      <RowActionButtons key="actions" value={item} headings={headings} />,
    ];
  });
  return result || [];
}
