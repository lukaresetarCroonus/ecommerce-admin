import { useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import ListPage from "../../components/shared/ListPage/ListPage";
import IconList from "../../helpers/icons";

import tblFields from "./tblFields.json";
import AuthContext from "../../store/auth-contex";
import ModalContent from "./ModalContent";
import { toast } from "react-toastify";

const PricesGroupsListPage = () => {
  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const additionalButtons = [
    {
      label: "Tržište",
      icon: false,
      action: () => {
        navigate("/products/price-markets");
      },
    },
    {
      label: "Nazad",
      icon: IconList.arrowBack,
      action: () => navigate(-1),
    },
  ];

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
              <ModalContent apiPath={`admin/product-items/prices-structure/message/${rowData.id}`} rowData={rowData} handleDeleteModalData={handleDeleteModalData} />
            )
          };
        },
      },
      deleteClickHandler: {
        type: 'dialog_delete',
        fnc: (rowData, deleteModalData) => {
          api.delete(`admin/product-items/prices-structure/confirm/${rowData.id}`)
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
  }

  return (
    <ListPage
      listPageId="PricesGroupsListPage"
      title="Cenovnik"
      apiUrl="admin/product-items/prices-structure"
      columnFields={tblFields}
      additionalButtons={additionalButtons}
      actionNewButton="modal"
      customActions={customActions}
    />
  );
};

export default PricesGroupsListPage;
