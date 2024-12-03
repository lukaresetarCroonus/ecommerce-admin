import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./adminFormListFields.json";

const AdminForms = () => {
  return <ListPage apiUrl="admin/form" title="Admin formsss" columnFields={tblFields} />;
};

export default AdminForms;
