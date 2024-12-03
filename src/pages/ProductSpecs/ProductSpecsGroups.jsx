import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ListPage from "../../components/shared/ListPage/ListPage";
import columnFields from "./tblFields.json";
import ModalContent from "./ModalContent";
import IconList from "../../helpers/icons";
import AuthContext from "../../store/auth-contex";
import { useContext } from "react";


const ProductSpecsGroups = () => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const { pathname } = useLocation();
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
              <ModalContent apiPath={`admin/product-item-specifications/group/message/${rowData.id}`} rowData={rowData} handleDeleteModalData={handleDeleteModalData} />
            )
          };
        },
      },
      deleteClickHandler: {
        type: 'dialog_delete',
        fnc: (rowData, deleteModalData) => {

          api.delete(`admin/product-item-specifications/group/confirm/${rowData.id}?delete_product_attributes=${deleteModalData.delete_product_attributes}`)
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
    queuePlayNext: {
      type: "custom",
      display: true,
      position: 2,
      clickHandler: {
        type: 'navigate',
        fnc: (rowData,) => {
          return `${pathname}/${rowData.id}`;
        },
      },
      icon: "queue_play_next",
      title: "Atributi i njene vrednosti",
    }
  };

  const additionalButtons = [
    {
      label: "Nazad",
      icon: IconList.arrowBack,
      action: () => navigate(-1),
    },
  ];

  return (
    <ListPage
      listPageId="ProductSpecsGroups"
      apiUrl="admin/product-item-specifications/group"
      title="Specifikacije"
      columnFields={columnFields}
      showNewButton={true}
      actionNewButton="modal"
      customActions={customActions}
      additionalButtons={additionalButtons}
    />
  );
};

export default ProductSpecsGroups;
