import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2CContactForm = () => {
  const customActions = {
    edit: {
      type: "custom",
      display: false,
    },
  };

  return <ListPage listPageId="B2CContactForm" apiUrl="admin/contact-form-b2c" title="Kontakt forma" columnFields={tblFields} showNewButton={false} customActions={customActions} />;
};

export default B2CContactForm;
