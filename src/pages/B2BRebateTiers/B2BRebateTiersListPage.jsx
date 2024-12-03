import ListPage from "../../components/shared/ListPage/ListPage"
import tblFields from "./tblFields.json"

const B2BRebateTiersListPage = () => {
  return (
    <ListPage
      listPageId="B2BRebateTiersListPage"
      apiUrl="admin/rebates/tiers"
      editUrl="admin/rebates/tiers"
      title="Rabatne skale"
      columnFields={tblFields}
      actionNewButton="modal"
    />
  );
}

export default B2BRebateTiersListPage
