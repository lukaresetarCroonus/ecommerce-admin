import { useNavigate } from "react-router-dom";
import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2CNews = () => {
  const navigate = useNavigate();
  const categoryPage = () => {
    navigate("/b2c-news/category");
  };

  const categoryButtons = [{ id: 1, label: "Kategorije", action: categoryPage }];

  return (
    <ListPage
      listPageId="B2CNews"
      apiUrl="admin/news-b2c/news/list"
      title="Vesti"
      columnFields={tblFields}
      additionalButtons={categoryButtons}
    />
  );
};

export default B2CNews;
