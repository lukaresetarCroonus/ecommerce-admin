import formFields from "../forms/thumbs.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
// import ModalContent from "../../ModalContent";
import { toast } from "react-toastify";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-contex";

const Thumbs = ({ pageId }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);

    const handleInformationImage = () => {
        api.get(`admin/landing-pages-b2b/thumb/options/upload`)
            .then((response) => {
                console.log(response, "response thumb b1b");
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
                    api.delete(`admin/landing-pages-b2b/thumb/${rowData.id}`)
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

    const formatFormFields = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = formFieldsTemp.map((field) => {
                if (field?.prop_name === "thumb_image") {
                    return {
                        ...field,
                        description: descripiton,
                        validate: {
                            imageUpload: data,
                        },
                        ui_prop: {
                            ...field?.ui_prop,
                            fileUpload: data,
                        },
                        dimensions: { width: image?.width, height: image?.height },
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
        <>
            <ListPage
                listPageId="B2CLandingPageThumbs"
                apiUrl={`admin/landing-pages-b2b/thumb/${pageId}`}
                editUrl={`admin/landing-pages-b2b/thumb`}
                title=" "
                columnFields={formFieldsTemp}
                useColumnFields={true}
                actionNewButton="modal"
                addFieldLabel="Dodajte novu vrednost"
                showAddButton={true}
                initialData={{ id_landing_page: pageId }}
                customActions={customActions}
                apiPathCrop={`admin/landing-pages-b2b/thumb/options/crop`}
            />
        </>
    );
};

export default Thumbs;
