import formFields from "./formFields.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import ModalContent from "../../ModalContent";
import { toast } from "react-toastify";
import { useContext } from "react";
import AuthContext from "../../../../store/auth-contex";

const GroupAttributes = ({ groupId }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

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
              <ModalContent apiPath={`admin/product-item-specifications/group-attribute/message/${rowData.id}`} rowData={rowData} handleDeleteModalData={handleDeleteModalData} />
            )
          };
        },
      },
      deleteClickHandler: {
        type: 'dialog_delete',
        fnc: (rowData, deleteModalData) => {

          api.delete(`admin/product-item-specifications/group-attribute/confirm/${rowData.id}?delete_product_attributes=${deleteModalData.delete_product_attributes}`)
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
      <ListPage
        listPageId="GroupAttributesProdSpec"
        key="group-attribute"
        apiUrl={`admin/product-item-specifications/group-attribute/${groupId}`}
        editUrl={`admin/product-item-specifications/group-attribute`}
        title=" "
        columnFields={formFields}
        actionNewButton="modal"
        addFieldLabel="Dodajte novi atribut"
        showAddButton={true}
        initialData={{ id_group: groupId }}
        customActions={customActions}
      />
    </>
  );
};

export default GroupAttributes;
