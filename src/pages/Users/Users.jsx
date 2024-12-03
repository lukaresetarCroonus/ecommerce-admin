import { useState } from "react";

import ChangePasswordDialog from "../../components/shared/ChangePasswordDialog/ChangePasswordDialog";
import ListPage from "../../components/shared/ListPage/ListPage";

import tblFields from "./tblFields.json";

const Users = () => {
  const [openDialog, setOpenDialog] = useState({ show: false, userId: null });

  const customActions = {
    key: {
      type: "custom",
      display: true,
      position: 2,
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
      <ListPage listPageId="Users" apiUrl="admin/users" title="Korisnici" columnFields={tblFields} customActions={customActions} actionNewButton="modal" />
      <ChangePasswordDialog openDialog={openDialog} setOpenDialog={setOpenDialog} apiUrl="admin/users/reset-password" />
    </>
  );
};

export default Users;
