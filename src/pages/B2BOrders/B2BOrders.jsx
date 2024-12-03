import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2BOrders = () => {
  const customActions = {
    edit: {
      type: "custom",
      display: false,
    },
    delete: {
      type: "delete",
      display: false,
    },
  };

  return (
    <ListPage
      listPageId="B2BOrders"
      apiUrl="admin/orders-b2b/list"
      title="Narudžbenice"
      columnFields={tblFields}
      showNewButton={false}
      customActions={customActions}
    />
  );
};

export default B2BOrders;
