import { useNavigate } from "react-router-dom";
import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../store/auth-contex";

const B2CEmployees = () => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const navigate = useNavigate();
    const [formFieldsTemp, setFormFieldsTemp] = useState(tblFields);

    const handleInformationImage = () => {
        api.get(`admin/employees-b2c/basic-data/options/upload`)
            .then((response) => {
                formatFormFields(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const customActions = {
        delete: {
            clickHandler: {
                type: "dialog_delete",
                fnc: (rowData) => {
                    return {
                        show: true,
                        id: rowData.id,
                        mutate: null,
                    };
                },
            },
            deleteClickHandler: {
                type: "dialog_delete",
                fnc: (rowData) => {
                    api.delete(`admin/employees-b2c/list/${rowData.id}`)
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

    let buttons = [
        {
            id: 1,
            label: "Radne jedinice",
            action: () => {
                navigate("/b2c-working-unit");
            },
        },
    ];

    const formatFormFields = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = tblFields.map((field) => {
                if (field?.prop_name === "image") {
                    return {
                        ...field,
                        description: descripiton,
                        validate: {
                            imageUpload: data,
                        },
                        ui_prop: {
                            ...field?.ui_prop,
                            fileUpload: {
                                ...field?.ui_prop?.fileUpload,
                                data,
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

    useEffect(() => {
        handleInformationImage();
    }, []);

    return (
        <ListPage
            listPageId="B2CEmployees"
            apiUrl="admin/employees-b2c/list"
            editUrl="admin/employees-b2c/basic-data"
            title="Zaposleni"
            actionNewButton="modal"
            columnFields={formFieldsTemp}
            useColumnFields={true}
            additionalButtons={buttons}
            customActions={customActions}
            apiPathCrop={`admin/employees-b2c/basic-data/options/crop`}
        />
    );
};

export default B2CEmployees;
