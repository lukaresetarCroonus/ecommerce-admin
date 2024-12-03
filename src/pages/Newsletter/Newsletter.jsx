import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const Newsletter = () => {

  return (
    <ListPage listPageId="Newsletter" apiUrl="admin/newsletter-b2c" title="Newsletter" columnFields={tblFields} showNewButton={false} />
  );
};

export default Newsletter;
