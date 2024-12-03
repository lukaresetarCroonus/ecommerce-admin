import { useCallback, useEffect, useState } from "react";
import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";
import listCheckbox from "./listCheckbox.json";
import ModalForm from "../../components/shared/Modal/ModalForm";
import { useTableCellActions } from "../../hooks/useTableCellActions";
import { useCellSubmit } from "../../hooks/useCellSubmit";
import useAPI from "../../api/api";
import { useMutation } from "react-query";

const Products = () => {
    const [openModal, setOpenModal] = useState({ show: false, id: null, name: null });
    const [fields, setFields] = useState(tblFields);
    const [fieldsTmp, setFieldsTmp] = useState();
    const [doesRefetch, setDoesRefetch] = useState(false);

    const customActions = {
        contentCopy: {
            type: "custom",
            display: true,
            position: 2,
            clickHandler: {
                type: "",
                fnc: (rowData) => {
                    return setOpenModal({ show: true, id: rowData.id, name: rowData.name });
                },
            },
            icon: "content_copy",
            title: "Dupliraj",
        },
    };

    const api = useAPI();

    const getTableCellFormData = async ({ cell_data, selected }) => {
        return await api.get(`${cell_data?.api_path}/${cell_data?.queryString}`).then((res) => {
            return res?.payload;
        });
    };

    const { customTableCellActions } = useTableCellActions({ clickAction: "edit", click: true, doubleClick: true, doubleClickAction: "none" });

    const submitCell = useCellSubmit();

    const cellValueChange = (value, row, column) => {
        console.log(value, row, column);
    };

    const onCellSubmit = (value, row, setSelected, api_url, api_method) => {
        submitCell(api_url, api_method, value, setDoesRefetch);
        setSelected({
            row: null,
            column: null,
        });
        setFieldsTmp(null);
    };

    useEffect(() => {
        if (doesRefetch) {
            setDoesRefetch(false);
        }
    }, [doesRefetch]);

    return (
        <>
            <ListPage
                listPageId="Products"
                apiUrl="admin/product-items/list"
                deleteUrl="admin/product-items/basic-data"
                title="Proizvodi"
                columnFields={fields}
                customActions={customActions}
                tableCellActions={{
                    actions: customTableCellActions,
                    onChange: cellValueChange,
                    onSubmit: onCellSubmit,
                    getTableCellFormData: getTableCellFormData,
                    cell_fields: fieldsTmp,
                }}
                doesRefetch={doesRefetch}
                setDoesRefetch={setDoesRefetch}
            />
            <ModalForm
                anchor="right"
                openModal={openModal}
                setOpenModal={setOpenModal}
                formFields={listCheckbox}
                sx={{ padding: "2rem" }}
                apiPathFormModal="admin/product-items/list/clone"
                initialData={{
                    id_product: openModal.id,
                    categories: 0,
                    inventories: 0,
                    prices: 0,
                    seo: 0,
                    crossselles: 0,
                    upsells: 0,
                    related: 0,
                    attributes: 0,
                    variantsAttributes: 0,
                    gallery: 0,
                    docs: 0,
                }}
                withoutSetterFunction
                cancelButton
                setDoesRefetch={setDoesRefetch}
                doesRefetch={doesRefetch}
                label="Dupliraj"
                styleCheckbox={{ padding: "0 0.563rem 0 0.563rem" }}
                customTitle={`Da li ste sigurni da želite da duplirate proizvod ${openModal.name}?`}
                shortText="Dupliranjem se automatski dupliraju sledeći podaci proizvoda: Osnovno, Opis, Deklarijacija. Pored navedenih podataka možete odabrati koje još podatke želite da duplirate za novi proizvod."
            />
        </>
    );
};

export default Products;
