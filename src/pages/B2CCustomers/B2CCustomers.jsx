import { useState } from "react";
import ChangePasswordDialog from "../../components/shared/ChangePasswordDialog/ChangePasswordDialog";
import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

const B2CCustomers = () => {

  const [openDialog, setOpenDialog] = useState({ show: false, userId: null });

  const customActions = {
    key: {
      type: "custom",
      display: true,
      position: 3,
      clickHandler: {
        type: '',
        fnc: (rowData) => {
          return setOpenDialog({ show: true, userId: rowData.id });
        },
      },
      icon: "key",
      title: "Promeni lozinku",
    },
  };

  return (
    <>
      <ListPage listPageId="B2CCustomers" apiUrl="admin/customers-b2c/list" title="Kupci" columnFields={tblFields} customActions={customActions} />
      <ChangePasswordDialog openDialog={openDialog} setOpenDialog={setOpenDialog} apiUrl="admin/customers-b2c/list/reset-password" />
    </>
  );
};

export default B2CCustomers;
