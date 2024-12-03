import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const AdminForm = () => {
  return <ListPage listPageId="AdminForm" apiUrl="admin/form" title="Admin forms" columnFields={tblFields} />;
};

export default AdminForm;
