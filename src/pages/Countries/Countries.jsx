import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const Countries = () => {
  return (
    <ListPage listPageId="Countries" apiUrl="admin/countries" title="Države" columnFields={tblFields} actionNewButton="modal" />
  );
};

export default Countries;
