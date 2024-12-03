import { useLocation } from "react-router-dom";
import ListPage from "../../components/shared/ListPage/ListPage";
import fields from "./tblFields.json";

const AdminSettings = () => {

  const { pathname } = useLocation();

  const customActions = {
    edit: {
      clickHandler: {
        type: 'navigate',
        fnc: (rowData) => {
          return `${pathname}/${rowData.module}`;
        },
      },
    }
  };

  return (
    < ListPage
      listPageId="Adminsettings"
      apiUrl="admin/configuration-admin/main"
      title="Admin podešavanja"
      columnFields={fields}
      previewColumn="module"
      showNewButton={false}
      customActions={customActions}
    />
  )
};

export default AdminSettings;
