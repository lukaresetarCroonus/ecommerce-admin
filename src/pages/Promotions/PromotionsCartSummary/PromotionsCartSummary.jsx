import { useLocation, useNavigate } from "react-router-dom";
import ListPage from "../../../components/shared/ListPage/ListPage";
import tblFields from "./PromotionsCartSummaryDetails/forms/basic_data.json";

const PromotionsCartSummary = () => {

  const { pathname } = useLocation();
  const navigate = useNavigate();

  const customActions = {
    edit: {
      clickHandler: {
        type: 'navigate',
        fnc: (rowData) => {
          return `${pathname}/promotions-cart-summary-campaigns/${rowData.id}`;
        },
      },
    }
  };

  return (
    <ListPage
      listPageId="PromotionsCartSummary"
      apiUrl="admin/campaigns/cart-summary/list"
      deleteUrl="admin/campaigns/cart-summary/list"
      title=" "
      columnFields={tblFields}
      showNewButton={true}
      customActions={customActions}
      customNewButtonPath={`${pathname}/promotions-cart-summary-campaigns/new`}
    />
  )
};

export default PromotionsCartSummary;
