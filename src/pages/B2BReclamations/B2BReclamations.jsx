import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2BReclamations = () => {

  return (
    <>
      <ListPage
        listPageId="B2BReclamations"
        apiUrl="admin/reclamations-b2b/list"
        title="B2B Reklamacije"
        columnFields={tblFields}
      />
    </>
  );
};

export default B2BReclamations;