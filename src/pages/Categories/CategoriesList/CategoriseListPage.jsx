import { useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ListPage from "../../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";
import AuthContext from "../../../store/auth-contex";
import ModalContent from "./ModalContent";
import { toast } from "react-toastify";

const CategoriesListPage = () => {
    const { gid } = useParams();
    const navigate = useNavigate();
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    let buttons = [
        {
            id: 1,
            label: "Grupe",
            action: () => {
                navigate("/product-categories");
            },
        },
    ];

    const customActions = {
        delete: {
            clickHandler: {
                type: "dialog_delete",
                fnc: (rowData, handleDeleteModalData) => {
                    return {
                        show: true,
                        id: rowData.id,
                        mutate: null,
                        children: <ModalContent apiPath={`admin/category-product/categories/message/${rowData.id}`} rowData={rowData} handleDeleteModalData={handleDeleteModalData} />,
                    };
                },
            },
            deleteClickHandler: {
                type: "dialog_delete",
                fnc: (rowData, deleteModalData) => {
                    if (deleteModalData.all_fill) {
                        api.delete(`admin/category-product/categories/confirm/${rowData.id}`, deleteModalData)
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
                },
            },
        },
    };

    return (
        <ListPage
            listPageId="CategoriesListPage"
            apiUrl={`admin/category-product/categories`}
            customActions={customActions}
            title="Kategorije"
            columnFields={tblFields}
            additionalButtons={buttons}
            filters={{ id_category_product_group: gid }}
        />
    );
};

export default CategoriesListPage;
