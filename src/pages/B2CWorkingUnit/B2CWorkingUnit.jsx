import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import ListPage from "../../components/shared/ListPage/ListPage";

import tblFields from "./tblFields.json";
import AuthContext from "../../store/auth-contex";
import ModalContent from "./ModalContent";
import { toast } from "react-toastify";

const B2CWorkingUnit = () => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const navigate = useNavigate();

  const customActions = {
    delete: {
      clickHandler: {
        type: 'dialog_delete',
        fnc: (rowData, handleDeleteModalData) => {
          return {
            show: true,
            id: rowData.id,
            mutate: null,
            children: (
              <ModalContent apiPath={`admin/working-units-b2c/list/message/${rowData.id}`} rowData={rowData} handleDeleteModalData={handleDeleteModalData} />
            )
          };
        },
      },
      deleteClickHandler: {
        type: 'dialog_delete',
        fnc: (rowData, deleteModalData) => {

          if(deleteModalData.all_fill) {
            api.delete(`admin/working-units-b2c/list/confirm/${rowData.id}`, deleteModalData)
              .then(() => toast.success("Zapis je uspešno obrisan"))
              .catch((err) => toast.warning(err?.response?.data?.message ?? err?.response?.data?.payload?.message ?? "Došlo je do greške prilikom brisanja"));

            return {
              show: false,
              id: rowData.id,
              mutate: 1,
            };
          } else {
            toast.warning("Potrebno je da povežete sve opcije koje se brišu");
            return false;
          }
          
        }
      },
    },
  };

  let buttons = [
    {
      id: 1,
      label: "Zaposleni",
      action: () => {
        navigate("/b2c-employees");
      },
    },
  ];

  return (
    <ListPage
      listPageId="B2CWorkingUnit"
      apiUrl="admin/working-units-b2c/list"
      editUrl="admin/working-units-b2c/basic-data"
      title="Radne jedinice"
      actionNewButton="modal"
      columnFields={tblFields}
      additionalButtons={buttons}
      customActions={customActions}
    />
  );
};

export default B2CWorkingUnit;
