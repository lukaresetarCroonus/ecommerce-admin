import React, { useContext, useEffect, useState } from "react";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import formFields from "../forms/content.json";
import { toast } from "react-toastify";
import AuthContext from "../../../../store/auth-contex";

const Content = ({ pageId }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPathGallery = "admin/static-pages-b2c/gallery";
    const apiPathContent = "admin/static-pages-b2c/content";

    const [selectedRow, setSelectedRow] = useState({});
    const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);
    const [hideSubmitModalButton, setHideSubmitModalBUtton] = useState(true);
    const [modalFormTitle, setModalFormTitle] = useState(null);

    const [modalObject, setModalObject] = useState(null);
    const [loading, setLoading] = useState(false);
    const [validationFields, setValidationFields] = useState([]);
    const formFieldsOne = formFields;

    const customActions = {
        edit: {
            clickHandler: {
                type: "modal_form",
                fnc: (rowData) => {
                    setHideSubmitModalBUtton(true);
                    updateNewFieldsInDetails(formFieldsTemp, rowData?.input_type, true, null, false, validationFields);
                    setSelectedRow(rowData);
                    setModalObject(null);
                    setModalFormTitle(null);

                    return {
                        show: true,
                        id: rowData.id,
                    };
                },
            },
        },
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
                    api.delete(`admin/static-pages-b2c/content/${rowData.id}`)
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

    const prepareInitialData = (values) => {
        if (values?.content_multiple_images) {
            values.content_multiple_images = (values?.content_multiple_images ?? [])
                .filter((item) => item.file_base64 != null)
                .map((item) => {
                    let base64 = item.file_base64;
                    const type = base64.split(";")[0].split(":")[1];
                    let y = base64[base64.length - 2] === "=" ? 2 : 1;
                    const size = base64.length * (3 / 4) - y;
                    return { id: item.id, name: item.file_filename, position: item.order, alt: item.file_filename, size: size, type: type, src: base64, path: item.file };
                });
        }
        return values;
    };

    const handleSubmitWrapper = (pageId, id) => {
        return async (data) => {
            setLoading(true);
            const req = {
                id: data.new ? null : data.id,
                id_static_pages: pageId ?? null,
                id_static_pages_content: id ?? null,
                file_base64: data.src,
                order: data.position ?? 0,
                title: null,
                subtitle: null,
                short_description: null,
                description: null,
            };
            await api
                .post(`${apiPathGallery}`, req)
                .then((response) => {
                    toast.success("Uspešno dodata slika");
                    setLoading(false);
                })
                .catch((error) => {
                    toast.warn("Greška pri dodavanju slike");
                    console.warn(error);
                    setLoading(false);
                });
        };
    };

    const handleDelete = (id) => {
        setLoading(true);
        api.delete(`${apiPathGallery}/${id}`)
            .then((response) => {
                toast.success("Uspešno obrisana slika");
                setLoading(false);
            })
            .catch((error) => {
                toast.warn("Greška pri brisanju slike");
                console.warn(error);
                setLoading(false);
            });
    };

    const handleReorder = (id, destination) => {
        setLoading(true);
        api.put(`${apiPathGallery}/order`, { id: id, order: destination })
            .then((response) => {
                toast.success("Uspešno promenjen raspored slika");
                setLoading(false);
            })
            .catch((error) => {
                toast.warn("Greška pri promeni rasporeda slika");
                console.warn(error);
                setLoading(false);
            });
    };

    useEffect(() => {
        formFieldsTemp.map((field) => {
            if (field.prop_name === "content_multiple_images") {
                field.uploadHandler = handleSubmitWrapper(pageId, selectedRow?.id);
                field.deleteHandler = handleDelete;
                field.handleReorder = handleReorder;
            }
        });
    }, [selectedRow?.id]);

    const handleInformationImage = () => {
        api.get(`admin/static-pages-b2c/gallery/options/upload`)
            .then((response) => {
                formatFormFields(response?.payload);
                setValidationFields(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const formatFormFields = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = formFieldsTemp.map((field) => {
                if (field?.prop_name === "content_multiple_images") {
                    return {
                        ...field,
                        description: descripiton,
                        validate: {
                            imageUpload: data,
                        },
                        ui_prop: {
                            fileUpload: {
                                ...field?.ui_prop?.fileUpload,
                                allow_format,
                                allow_size,
                                image,
                            },
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

    const updateNewFieldsInDetails = (fields, field, edit, data, disableType = false, validation) => {
        if (field === "") {
            handleSubmitWrapper(pageId, selectedRow?.id);
        } else {
            if (data) {
                saveData(data);
            }
        }
        fields.map((item, i) => {
            if (item.prop_name !== "type" && item.prop_name !== "order" && item.prop_name !== "slug") {
                if (item.input_type === field) {
                    item.in_details = true;
                } else {
                    item.in_details = false;
                }
            } else {
                if (edit) {
                    if (item.input_type === "number" || item.prop_name === "slug") {
                        item.disabled = false;
                    } else {
                        item.disabled = true;
                    }
                } else {
                    if (disableType && item.prop_name !== "order") {
                        item.disabled = true;
                    } else {
                        item.disabled = false;
                    }
                }

                if (!edit && item.prop_name === "order") {
                    item.in_details = false;
                } else {
                    item.in_details = true;
                }
            }
            if (validation) {
                const { allow_size, allow_format, image } = validation;
                const description = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;

                if (item?.prop_name === "content_multiple_images") {
                    item.description = description;
                    item.validate = {
                        imageUpload: validation,
                    };
                    item.ui_prop = {
                        fileUpload: {
                            ...item?.ui_prop?.fileUpload,
                            allow_size: validation?.allow_size,
                            allow_format: validation?.allow_format,
                            image: validation?.image,
                        },
                    };
                    item.dimensions = { width: image?.width, height: image?.height };
                }
            }
        });
        setFormFieldsTemp([...fields]);
    };
    const saveData = (data) => {
        setModalFormTitle("Izmeni");
        api.post(`${apiPathContent}/${pageId}`, { ...data, id_static_pages: pageId, id_static_pages_content: selectedRow?.id })
            .then((response) => {
                toast.success(`Uspešno`);
                setSelectedRow(response?.payload);
                setModalObject(response?.payload);
            })
            .catch((error) => {
                console.warn(error);
                toast.warning("Greška");
            });
    };

    const validateData = (data, field) => {
        let ret = data;
        switch (field) {
            case "type":
                updateNewFieldsInDetails(formFieldsOne, ret?.type, false, ret, true, validationFields);
                setHideSubmitModalBUtton(true);
                return ret;
            default:
                return ret;
        }
    };

    return (
        <>
            <ListPage
                validateData={validateData}
                accept={validationFields?.allow_format}
                listPageId="B2CContent"
                apiPathCrop={`admin/static-pages-b2c/gallery/options/crop`}
                apiUrl={`admin/static-pages-b2c/content/${pageId}`}
                editUrl={`admin/static-pages-b2c/content/${pageId}`}
                initialData={{ id_static_pages: pageId, id_static_pages_content: selectedRow?.id }}
                title=" "
                columnFields={formFieldsTemp}
                actionNewButton="modal"
                customActions={customActions}
                onNewButtonPress={() => {
                    setHideSubmitModalBUtton(false);
                    updateNewFieldsInDetails(formFields, "", false, null, false, validationFields);
                    setModalObject(null);
                    setModalFormTitle(null);
                }}
                prepareInitialData={prepareInitialData}
                withoutSetterFunction
                submitButtonForm={hideSubmitModalButton}
                modalObject={modalObject}
                useColumnFields={true}
                useModalGalleryInjection={true}
                customTitleModalForm={modalFormTitle}
                isModalUploading={loading}
            />
        </>
    );
};

export default Content;
