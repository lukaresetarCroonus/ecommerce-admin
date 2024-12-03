import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const SaleOfficers = () => {
  return (
    <ListPage
      listPageId="SaleOfficers"
      apiUrl="admin/referents-b2b"
      title="Komercijalisti"
      columnFields={tblFields}
      actionNewButton="modal"
    />
  );
};

export default SaleOfficers;
