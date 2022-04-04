import RowActionButtons from "./RowActionButtons";

export function getColumnContentTypes(data) {
  return ["text", "text", "text", "text", "text", "numeric"];
}
export function getColumnHeadings(data) {
  return ["id", "title", "type", "metafield", "default", "actions"];
}
export function getRows(data, headings) {
  const result = data?.map(function (item) {
    return [
      ...headings.filter(Boolean).map((value, i) => {
        if (value === "actions") {
          return (
            <RowActionButtons key="actions" value={item} headings={headings} />
          );
        }
        return item[value];
      }),
    ];
  });
  return result || [];
}
