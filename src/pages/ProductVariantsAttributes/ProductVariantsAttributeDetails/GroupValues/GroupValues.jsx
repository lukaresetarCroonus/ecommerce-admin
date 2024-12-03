import { useContext, useEffect, useState } from "react";
import formFields from "./formFields.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import ModalContent from "../../ModalContent";
import { toast } from "react-toastify";
import AuthContext from "../../../../store/auth-contex";

const GroupValues = () => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);

    const handleInformationImage = () => {
        api.get(`admin/product-items-variants-attributes/group-attribute-values/options/upload`)
            .then((response) => {
                formatFormFields(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const formatFormFields = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = formFieldsTemp.map((field) => {
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
                                    apiPathCrop: `admin/product-items-variants-attributes/group-attribute-values/options/crop`,
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
            setFormFieldsTemp([...arr]);
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
                            <ModalContent
                                apiPath={`admin/product-items-variants-attributes/group-attribute-values/message/${rowData.id}`}
                                rowData={rowData}
                                handleDeleteModalData={handleDeleteModalData}
                            />
                        ),
                    };
                },
            },
            deleteClickHandler: {
                type: "dialog_delete",
                fnc: (rowData, deleteModalData) => {
                    api.delete(`admin/product-items-variants-attributes/group-attribute-values/confirm/${rowData.id}?delete_product_attributes=${deleteModalData.delete_product_attributes}`)
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
                listPageId="GroupValuesProdVarAttr"
                key="group-attribute-values"
                apiUrl={`admin/product-items-variants-attributes/group-attribute-values`}
                editUrl={`admin/product-items-variants-attributes/group-attribute-values`}
                title=" "
                columnFields={formFieldsTemp}
                useColumnFields={true}
                actionNewButton="modal"
                addFieldLabel="Dodajte novu vrednost"
                showAddButton={true}
                customActions={customActions}
            />
        </>
    );
};

export default GroupValues;
