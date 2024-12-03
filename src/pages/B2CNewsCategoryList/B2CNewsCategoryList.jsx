import { useNavigate } from "react-router-dom";
import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";
import ModalContent from "./ModalContent";
import { toast } from "react-toastify";
import { useContext } from "react";
import AuthContext from "../../store/auth-contex";

const B2CNewsCategorylist = () => {
    const navigate = useNavigate();
    const newsPage = () => {
        navigate("/b2c-news");
    };

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    const newsButtons = [{ id: 1, label: "Vesti", action: newsPage }];

    const customActions = {
        delete: {
            clickHandler: {
                type: "dialog_delete",
                fnc: (rowData, handleDeleteModalData) => {
                    return {
                        show: true,
                        id: rowData.id,
                        mutate: null,
                        children: <ModalContent apiPath={`admin/news-b2c/category/list/message/${rowData.id}`} rowData={rowData} handleDeleteModalData={handleDeleteModalData} />,
                    };
                },
            },
            deleteClickHandler: {
                type: "dialog_delete",
                fnc: (rowData, deleteModalData) => {
                    api.delete(`admin/news-b2c/category/list/confirm/${rowData.id}`)
                        .then(() => toast.success("Zapis je uspešno obrisan"))
                        .catch((err) => toast.warning(err?.response?.data?.message ?? err?.response?.data?.payload?.message ?? "Došlo je do greške prilikom brisanja"));

                    return {
                        show: false,
                        id: rowData.id,
                        mutate: 1,
                    };
                },
            },
        },
    };

    return (
        <ListPage
            listPageId="B2CNewsCategorylist"
            apiUrl="admin/news-b2c/category/list"
            title="Vesti kategorije"
            columnFields={tblFields}
            additionalButtons={newsButtons}
            customActions={customActions}
        />
    );
};

export default B2CNewsCategorylist;
