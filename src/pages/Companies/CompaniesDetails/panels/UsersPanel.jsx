import { useContext, useState } from "react";
import ChangePasswordDialog from "../../../../components/shared/ChangePasswordDialog/ChangePasswordDialog";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import formFields from "../forms/users.json";
import { toast } from "react-toastify";
import AuthContext from "../../../../store/auth-contex";

const UsersPanel = ({ companyId }) => {
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
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
    delete: {
      clickHandler: {
        type: 'dialog_delete',
        fnc: (rowData) => {
          return {
            show: true,
            id: rowData.id,
            mutate: null,
          };
        },
      },
      deleteClickHandler: {
        type: 'dialog_delete',
        fnc: (rowData) => {

          api.delete(`admin/customers-b2b/users/${rowData.id}`)
            .then(() => toast.success("Zapis je uspešno obrisan"))
            .catch((err) => toast.warning(err?.response?.data?.message ?? err?.response?.data?.payload?.message ?? "Došlo je do greške prilikom brisanja"));

          return {
            show: false,
            id: rowData.id,
            mutate: 1,
          };
        }
      },
    },
  };



  return (
    <>
      <ListPage listPageId="UsersPanel" apiUrl={`admin/customers-b2b/users/${companyId}`} editUrl={`admin/customers-b2b/users`} columnFields={formFields} actionNewButton="modal" initialData={{ id_company: companyId }} addFieldLabel="Dodajte korisnika" showAddButton={true} customActions={customActions} />
      <ChangePasswordDialog openDialog={openDialog} setOpenDialog={setOpenDialog} apiUrl="admin/customers-b2b/users/reset-password" />
    </>
  );
};

export default UsersPanel;
