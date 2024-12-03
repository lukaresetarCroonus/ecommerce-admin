import { useContext, useEffect, useState } from "react";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import tblfields from "../forms/digital_material.json";
import AuthContext from "../../../../store/auth-contex";
import { toast } from "react-toastify";

const DigitalMaterial = ({ productId }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [file, setFile] = useState(null);
    const [fields, setFields] = useState(tblfields);

    const validate = (data, field) => {
        if (field === "download_type") {
            if (data.download_type === "link") {
                setFields((old) => {
                    return old.map((field) => {
                        if (field.prop_name === "download_file_path") {
                            field.in_details = false;
                        }

                        if (field.prop_name === "download_link_path") {
                            field.in_details = true;
                        }
                        return field;
                    });
                });
            }
            if (data.download_type === "upload") {
                setFields((old) => {
                    return old.map((field) => {
                        if (field.prop_name === "download_file_path") {
                            field.in_details = true;
                        }

                        if (field.prop_name === "download_link_path") {
                            field.in_details = false;
                        }
                        return field;
                    });
                });
            }
        }

        if (field === "sample_type") {
            if (data.download_type === "link") {
                setFields((old) => {
                    return old.map((field) => {
                        if (field.prop_name === "sample_file_path") {
                            field.in_details = false;
                        }

                        if (field.prop_name === "sample_link_path") {
                            field.in_details = true;
                        }
                        return field;
                    });
                });
            }
            if (data.download_type === "upload") {
                setFields((old) => {
                    return old.map((field) => {
                        if (field.prop_name === "sample_file_path") {
                            field.in_details = true;
                        }

                        if (field.prop_name === "sample_link_path") {
                            field.in_details = false;
                        }
                        return field;
                    });
                });
            }
        }
        return data;
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
                    api.delete(`admin/product-items/digital-material/list/${rowData.id}`)
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
        edit: {
            clickHandler: {
                type: "modal_form",
                fnc: (rowData) => {
                    api.get(`admin/product-items/digital-material/basic-data/${rowData.id}`)
                        .then((response) => {
                            setFields((old) => {
                                return old.map((field) => {
                                    if (field.prop_name === "download_file_path") {
                                        field.in_details = response.payload.download_type === "upload";
                                    }

                                    if (field.prop_name === "download_link_path") {
                                        field.in_details = response.payload.download_type === "link";
                                    }

                                    if (field.prop_name === "sample_file_path") {
                                        field.in_details = response.payload.sample_type === "upload";
                                    }

                                    if (field.prop_name === "sample_link_path") {
                                        field.in_details = response.payload.sample_type === "link";
                                    }
                                    return field;
                                });
                            });
                            setFile({
                                name: response.payload.download_type === "upload" ? response?.payload?.download_file_path : response?.payload?.download_link_path,
                            });
                        })
                        .catch((error) => console.log(error));
                    return {
                        show: true,
                        id: rowData.id,
                    };
                },
            },
        },
        downloadFile: {
            type: "custom",
            display: true,
            position: 2,
            icon: "download",
            title: "Preuzmite dokument",
            clickHandler: {
                type: "",
                fnc: (rowData) => {
                    const fileId = rowData?.download;
                    window.open(`${fileId}`, "_blank");
                },
            },
        },
        copyFile: {
            type: "custom",
            display: true,
            position: 3,
            icon: "content_copy",
            title: "Kopirajte putanju fajla",
            clickHandler: {
                type: "",
                fnc: (rowData) => {
                    const filePath = rowData?.download;
                    navigator.clipboard
                        .writeText(filePath)
                        .then(() => {
                            toast.success("Putanja fajla je kopirana.");
                        })
                        .catch((error) => {
                            toast.error("Došlo je do greške pri kopiranju putanje fajla.");
                        });
                },
            },
        },
    };

    return (
        <ListPage
            listPageId="DigitalMaterial"
            apiUrl={`admin/product-items/digital-material/list/${productId}`}
            editUrl={`admin/product-items/digital-material/basic-data`}
            title=" "
            columnFields={fields}
            validateData={validate}
            useColumnFields={true}
            actionNewButton="modal"
            initialData={{ id_product: productId, material: file?.base_64 }}
            addFieldLabel="Dodajte novi materijal"
            showAddButton={true}
            onFilePicked={setFile}
            selectedFile={file}
            onNewButtonPress={() => {
                setFile(null);
            }}
            customActions={customActions}
        />
    );
};

export default DigitalMaterial;
