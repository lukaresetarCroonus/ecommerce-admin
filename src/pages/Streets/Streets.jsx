import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const Streets = () => {
  return (
    <ListPage listPageId="Streets" apiUrl="admin/streets" title="Ulice" columnFields={tblFields} actionNewButton="modal" />
  );
};

export default Streets;
