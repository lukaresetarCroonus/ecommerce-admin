import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const Notifications = () => {

  return (
    <ListPage
      listPageId="Notifications"
      apiUrl="admin/notifications-b2b"
      editUrl="admin/notifications-b2b"
      title="Notifikacije"
      columnFields={tblFields}
      actionNewButton="modal"
    />
  );
};

export default Notifications;
