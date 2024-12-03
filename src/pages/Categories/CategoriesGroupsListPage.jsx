import { useContext } from "react";
import { useLocation } from "react-router";
import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";
import AuthContext from "../../store/auth-contex";
import ModalContent from "./ModalContent";
import { toast } from "react-toastify";

const CategoriesGroupsListPage = () => {

  const { pathname } = useLocation();
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const customActions = {
    list: {
      type: "custom",
      display: true,
      position: 2,
      clickHandler: {
        type: 'navigate',
        fnc: (rowData) => {
          return `${pathname}/category/${rowData.id}`;
        },
      },
      icon: "list",
      title: "Lista kategorija",
    },
    accountTree: {
      type: "custom",
      display: true,
      position: 3,
      clickHandler: {
        type: 'navigate',
        fnc: (rowData) => {
          return `${pathname}/tree/${rowData.id}`;
        },
      },
      icon: "account_tree",
      title: "Drvo kategorija",
    },
    delete: {
      clickHandler: {
        type: 'dialog_delete',
        fnc: (rowData, handleDeleteModalData) => {
          return {
            show: true,
            id: rowData.id,
            mutate: null,
            children: (
              <ModalContent apiPath={`admin/category-product/groups/message/${rowData.id}`} rowData={rowData} handleDeleteModalData={handleDeleteModalData} />
            )
          };
        },
      },
      deleteClickHandler: {
        type: 'dialog_delete',
        fnc: (rowData, deleteModalData) => {

          if(deleteModalData.all_fill) {
            api.delete(`admin/category-product/groups/confirm/${rowData.id}`, deleteModalData)
              .then(() => toast.success("Zapis je uspešno obrisan"))
              .catch((err) => toast.warning(err?.response?.data?.message ?? err?.response?.data?.payload?.message ?? "Došlo je do greške prilikom brisanja"));

            return {
              show: false,
              id: rowData.id,
              mutate: 1,
            };
          } else {
            toast.warning("Potrebno je da odaberete koju akciju želite da preduzmete.");
            return false;
          }
          
        }
      },
    }
  };



  return (
    <ListPage
      listPageId="CategoriesGroupsListPage"
      apiUrl="admin/category-product/groups"
      actionNewButton="modal"
      title="Grupe kategorija"
      columnFields={tblFields}
      customActions={customActions}
    />
  );
};

export default CategoriesGroupsListPage;
