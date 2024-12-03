import { useLocation, useNavigate } from "react-router-dom";
import ListPage from "../../../components/shared/ListPage/ListPage";
import tblFields from "./PromotionsDeliveryCampaignsDetails/forms/basic_data.json";

const PromotionsDeliveryCampaigns = () => {
  const { pathname } = useLocation();
  const navigate = useNavigate();

  const customActions = {
    edit: {
      clickHandler: {
        type: 'navigate',
        fnc: (rowData) => {
          return `${pathname}/promotions-delivery-campaigns/${rowData.id}`;
        },
      },
    }
  };

  return (
    <ListPage
      listPageId="PromotionsDeliveryCampaigns"
      apiUrl="admin/campaigns/cart-delivery/list"
      deleteUrl="admin/campaigns/cart-delivery/list"
      title=" "
      columnFields={tblFields}
      showNewButton={true}
      customActions={customActions}
      customNewButtonPath={`${pathname}/promotions-delivery-campaigns/new`}
    />
  )
};

export default PromotionsDeliveryCampaigns;
