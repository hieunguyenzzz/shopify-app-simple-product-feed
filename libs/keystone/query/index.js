export const PRODUCTS_QUERY = `{\n  feedColumns(orderBy:{id:desc}) {\n    id\n    title\n    metafield\n    type\n    default\n  }\n}\n`;
export const PRODUCT_ADD_MUTATION = `mutation ($title:String $type:String, $default:String  ) {
  createFeedColumn(data: {title:$title, type:$type, default: $default}) {
    id
    title
    metafield
    type
    default
  }
}`;
export const PRODUCT_EDIT_MUTATION = `mutation  updateFeedColumn($id:ID!,$title:String $type:String, $default:String ){
  updateFeedColumn(where:{id:$id},data: {title:$title, type:$type, default: $default}){
    id
    title
    metafield
    type
    default
  }
}`;
export const PRODUCT_DELETE_MUTATION = `mutation  deleteFeedColumn($id:ID! ){
  deleteFeedColumn(where:{id:$id}){
    id
    
  }
}`;
