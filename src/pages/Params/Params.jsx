import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const Params = () => {
  return (
    <ListPage
      listPageId="Params"
      apiUrl="admin/params/main"
      title="Parametri"
      columnFields={tblFields}
    />
  );
};

export default Params;
