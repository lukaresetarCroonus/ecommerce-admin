import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const Towns = () => {
  return (
    <ListPage listPageId="Towns" apiUrl="admin/towns" title="Mesta" columnFields={tblFields} actionNewButton="modal" />
  );
};

export default Towns;
