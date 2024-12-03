import ListPage from "../../components/shared/ListPage/ListPage"
import fields from "./tblFields.json"

const B2BRebatesListPage = () => {
  return (
    <ListPage
      listPageId="B2BRebatesListPage"
      apiUrl="admin/rebates"
      title="Rabati"
      columnFields={fields}
    />
  );
}

export default B2BRebatesListPage
