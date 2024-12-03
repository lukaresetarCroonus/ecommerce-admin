import { useLocation, useNavigate } from "react-router-dom";
import ListPage from "../../../components/shared/ListPage/ListPage";
import tblFields from "./PromotionsCatalogCampaignsPageDetails/forms/basic_data.json";

const PromotionsCatalogCampaigns = () => {

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const customActions = {
    edit: {
      clickHandler: {
        type: 'navigate',
        fnc: (rowData) => {
          return `${pathname}/promotions-catalog-campaigns/${rowData.id}`;
        },
      },
    }
  };

  return (
    <ListPage
      listPageId="PromotionsCatalogCampaigns"
      apiUrl="admin/campaigns/product-catalog/list"
      deleteUrl="admin/campaigns/product-catalog/list"
      title=" "
      columnFields={tblFields}
      showNewButton={true}
      customActions={customActions}
      customNewButtonPath={`${pathname}/promotions-catalog-campaigns/new`}
    />
  );
};

export default PromotionsCatalogCampaigns;
