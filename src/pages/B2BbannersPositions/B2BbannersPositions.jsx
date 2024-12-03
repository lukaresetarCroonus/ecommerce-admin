import { useNavigate } from "react-router-dom";

import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2BbannersPositions = () => {
  const navigate = useNavigate();
  const buttons = [
    {
      label: "Baneri",
      action: () => {
        navigate(-1);
      },
    },
  ];

  return (
    <ListPage
      listPageId="B2BbannersPositions"
      title="Pozicije B2B banera"
      apiUrl="admin/banners-b2b/positions"
      columnFields={tblFields}
      additionalButtons={buttons}
      actionNewButton="modal"
    />
  );
};

export default B2BbannersPositions;
