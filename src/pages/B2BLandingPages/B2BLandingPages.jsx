import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2BLandingPages = () => {

  return <ListPage listPageId="B2BLandingPages" apiUrl="admin/landing-pages-b2b/list" title="Promo stranice" columnFields={tblFields} />;
};

export default B2BLandingPages;
