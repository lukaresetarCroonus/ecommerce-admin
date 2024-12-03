import formFields from "./formFields.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
// import { deepClone } from "@mui/x-data-grid/utils/utils";
import { toast } from "react-toastify";
import ModalContent from "../../ModalContent";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-contex";

const GroupValues = ({ groupId }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    // let newFields = deepClone(formFields);

    // let currencyField = newFields.find((item) => item.prop_name === "id_group_attribute")
    // if (currencyField == undefined) {
    //   console.warn("Polje currency nije pronadjeno!");
    //   return;
    // }
    const [tblFiedlsTemp, setTblFiedlsTemp] = useState(formFields);
    let currencyField = tblFiedlsTemp.find((item) => item.prop_name === "id_group_attribute");
    if (currencyField == undefined) {
        console.warn("Polje currency nije pronadjeno!");
        return;
    }

    const queryString = `id_group=${groupId}`;

    currencyField.queryString = queryString;

    const handleInformationImage = () => {
        api.get(`admin/product-item-specifications/group-attribute-values/options/upload`)
            .then((response) => {
                formatFormFields(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const formatFormFields = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = formFields.map((field) => {
                if (field?.prop_name === "image") {
                    return {
                        ...field,
                        description: descripiton,
                        validate: {
                            imageUpload: data,
                        },
                        ui_prop: {
                            fileUpload: {
                                allow_format: allow_format,
                                allow_size: allow_size,
                                image: image,
                                imageButton: {
                                    apiPathCrop: `admin/product-item-specifications/group-attribute-values/options/crop`,
                                },
                            },
                        },
                        dimensions: {
                            width: image?.width,
                            height: image?.height,
                        },
                    };
                } else {
                    return {
                        ...field,
                    };
                }
            });
            setTblFiedlsTemp([...arr]);
        }
    };

    const customActions = {
        delete: {
            clickHandler: {
                type: "dialog_delete",
                fnc: (rowData, handleDeleteModalData) => {
                    return {
                        show: true,
                        id: rowData.id,
                        mutate: null,
                        children: (
                            <ModalContent apiPath={`admin/product-item-specifications/group-attribute-values/message/${rowData.id}`} rowData={rowData} handleDeleteModalData={handleDeleteModalData} />
                        ),
                    };
                },
            },
            deleteClickHandler: {
                type: "dialog_delete",
                fnc: (rowData, deleteModalData) => {
                    api.delete(`admin/product-item-specifications/group-attribute-values/confirm/${rowData.id}?delete_product_attributes=${deleteModalData.delete_product_attributes}`)
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

    useEffect(() => {
        handleInformationImage();
    }, []);

    return (
        <>
            <ListPage
                listPageId="GroupValuesProdSpec"
                apiUrl={`admin/product-item-specifications/group-attribute-values/${groupId}`}
                editUrl={`admin/product-item-specifications/group-attribute-values`}
                editUrlQueryString={[
                    {
                        field: "id_group",
                        value: groupId,
                    },
                ]}
                title=" "
                columnFields={tblFiedlsTemp}
                useColumnFields={true}
                actionNewButton="modal"
                addFieldLabel="Dodajte novu vrednost"
                showAddButton={true}
                initialData={{ id_group: groupId }}
                customActions={customActions}
            />
        </>
    );
};

export default GroupValues;
