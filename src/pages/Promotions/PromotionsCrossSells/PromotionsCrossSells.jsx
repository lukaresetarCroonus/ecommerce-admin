import { useLocation } from "react-router-dom";
import ListPage from "../../../components/shared/ListPage/ListPage";
import tblFields from "./PromotionsCrossSellsDetails/forms/basic_data.json";

const PromotionsCrossSells = () => {

  const { pathname } = useLocation();

  const customActions = {
    edit: {
      clickHandler: {
        type: 'navigate',
        fnc: (rowData) => {
          return `${pathname}/promotions-cross-sells/${rowData.id}`;
        },
      },
    }
  };

  return (
    <ListPage
      listPageId="PromotionsCrosssells"
      apiUrl="admin/sell-strategies/cross-sell/list"
      deleteUrl="admin/sell-strategies/cross-sell/list"
      title=" "
      columnFields={tblFields}
      showNewButton={true}
      customActions={customActions}
      customNewButtonPath={`${pathname}/promotions-cross-sells/new`}
    />
  )
};

export default PromotionsCrossSells;
