import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2BContactForm = () => {
  const customActions = {
    edit: {
      type: "custom",
      display: false,
    },
  };

  return <ListPage listPageId="B2BContactForm" apiUrl="admin/contact-form-b2b" title="Kontakt forma" columnFields={tblFields} showNewButton={false} customActions={customActions} />;
};

export default B2BContactForm;
