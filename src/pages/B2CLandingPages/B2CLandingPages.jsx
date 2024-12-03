import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2CLandingPages = () => {

  return (
    <ListPage
      listPageId="B2CLandingPages"
      apiUrl="admin/landing-pages-b2c/list"
      title="Promo stranice"
      columnFields={tblFields}
    />
  );
};

export default B2CLandingPages;
