import List from "./List/List";

const Specification = ({ productId }) => {
  const apiPath = "admin/product-items/specifications";

  return (
    <List productId={productId} apiPath={apiPath} />
  )
};


export default Specification;
