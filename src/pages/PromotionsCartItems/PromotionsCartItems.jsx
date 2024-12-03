import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const PromotionsCartItems = () => {
  return <ListPage listPageId="PromotionsCartItems" apiUrl="admin/campaigns/product-catalog/list" deleteUrl="admin/campaigns/product-catalog/basic-data" title="Promocije za stavke u korpi" columnFields={tblFields} showNewButton={true} />;
};

export default PromotionsCartItems;
