import { useContext } from "react";
import { toast } from "react-toastify";

import formFields from "../forms/inventories.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../store/auth-contex";

const Inventories = ({ productId }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    const navigate = useNavigate();

    const customActions = {
        delete: {
            clickHandler: {
                type: "dialog_delete",
                fnc: ({ enable_delete, id }) => {
                    if (enable_delete) {
                        return {
                            show: true,
                            id: id,
                            mutate: null,
                        };
                    } else {
                        toast.warning("Nije moguće obrisati zapis");
                        return {
                            show: false,
                            id: null,
                            mutate: null,
                        };
                    }
                },
            },
            deleteClickHandler: {
                type: "dialog_delete",
                fnc: (rowData) => {
                    api.delete(`admin/product-items/inventories/${rowData.id}`)
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

    const additionalButtons = [
        {
            label: "Skladišta",
            action: () => {
                navigate("/stores");
            },
        },
    ];

    return (
        <>
            <ListPage
                listPageId="Inventories"
                apiUrl={`admin/product-items/inventories/${productId}`}
                editUrl={`admin/product-items/inventories`}
                title=" "
                columnFields={formFields}
                initialData={{ id_product: productId }}
                actionNewButton="modal"
                addFieldLabel="Dodajte novi lager"
                showAddButton={true}
                customActions={customActions}
                additionalButtons={additionalButtons}
            />
        </>
    );
};

export default Inventories;
