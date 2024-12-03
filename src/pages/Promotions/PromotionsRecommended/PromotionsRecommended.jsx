import { useLocation } from "react-router-dom";
import ListPage from "../../../components/shared/ListPage/ListPage";
import tblFields from "./PromotionsRecommendedDetails/forms/basic_data.json";

const PromotionsRecommended = () => {

  const { pathname } = useLocation();

  const customActions = {
    edit: {
      clickHandler: {
        type: 'navigate',
        fnc: (rowData) => {
          return `${pathname}/promotions-recommended/${rowData.id}`;
        },
      },
    }
  };

  return (
    <ListPage
      listPageId="PromotionsRecommended"
      apiUrl="admin/sell-strategies/recommended/list"
      deleteUrl="admin/sell-strategies/recommended/list"
      title=" "
      columnFields={tblFields}
      showNewButton={true}
      customActions={customActions}
      customNewButtonPath={`${pathname}/promotions-recommended/new`}
    />
  )
};

export default PromotionsRecommended;
