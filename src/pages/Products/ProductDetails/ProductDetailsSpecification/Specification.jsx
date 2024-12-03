import { useNavigate } from "react-router-dom";
import Button from "../../../../components/shared/Button/Button";
import Buttons from "../../../../components/shared/Form/Buttons/Buttons";
import List from "./ListAdder/List";

const Specification = ({ productId }) => {
  const apiPath = "admin/product-items/specifications";


  return (
    <>
      <List productId={productId} apiPath={apiPath} />
    </>
  );
};

export default Specification;
