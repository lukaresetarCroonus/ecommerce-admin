import { useLocation } from "react-router-dom";
import ListPage from "../../../components/shared/ListPage/ListPage";
import tblFields from "./PromotionsUpSellsDetails/forms/basic_data.json";

const PromotionsUpSells = () => {

  const { pathname } = useLocation();

  const customActions = {
    edit: {
      clickHandler: {
        type: 'navigate',
        fnc: (rowData) => {
          return `${pathname}/promotions-up-sells/${rowData.id}`;
        },
      },
    }
  };

  return (
    <ListPage
      listPageId="PromotionsUpsells"
      apiUrl="admin/sell-strategies/up-sell/list"
      deleteUrl="admin/sell-strategies/up-sell/list"
      title=" "
      columnFields={tblFields}
      showNewButton={true}
      customActions={customActions}
      customNewButtonPath={`${pathname}/promotions-up-sells/new`}
    />
  )
};

export default PromotionsUpSells;
