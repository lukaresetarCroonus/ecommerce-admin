import { useContext, useEffect, useState } from "react";

import prices from "../../forms_variation/prices.json";
import seo from "../../forms_variation/seo.json";
import gallery from "../../forms_variation/gallery.json";
import lagerData from "../../forms_variation/inventories.json";
import basicData from "../../forms_variation/product_variant_basic.json";

import ListPage from "../../../../../components/shared/ListPage/ListPage";
import { toast } from "react-toastify";
import AuthContext from "../../../../../store/auth-contex";

const ProductVariation = ({ parentId, tblFields }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [formFieldsTemp, setFormFieldsTemp] = useState(tblFields);
    const [fields, setFields] = useState(null);
    const [selectedColumn, setSelectedColumn] = useState(null);
    const [showSubmitModalButton, setShowSubmitModalButton] = useState(true);
    const [imageInfo, setImageInfo] = useState(null);
    const apiPathGallery = "admin/product-items/variants/gallery";
    // const galleryFormFields = gallery;
    const [galleryFormFields, setGalleryFormFields] = useState(gallery);

    const filterFields = (event, fieldBhavior, column) => {
        const { type } = fieldBhavior;
        switch (type) {
            case "click":
                const { show_fields } = fieldBhavior;
                switch (show_fields) {
                    case "seo_field":
                        setFields(seo);
                        break;
                    case "basic_data":
                        setFields(basicData);
                        break;
                    case "lager_field":
                        setFields(lagerData);
                        break;
                    case "price_field":
                        let arr = prices;
                        if (column.prop_name === "price_1") {
                            let index = arr.findIndex((item) => item.prop_name === "exclude_from_rebates");
                            let indexOne = arr.findIndex((item) => item.prop_name === "exclude_from_discount");
                            arr[index] = { ...arr[index], in_details: false };
                            arr[indexOne] = { ...arr[indexOne], in_details: true };
                        } else if (column.prop_name === "price_2") {
                            let index = arr.findIndex((item) => item.prop_name === "exclude_from_rebates");
                            let indexOne = arr.findIndex((item) => item.prop_name === "exclude_from_discount");
                            arr[index] = { ...arr[index], in_details: true };
                            arr[indexOne] = { ...arr[indexOne], in_details: true };
                        }
                        setFields([...arr]);
                        break;
                    case "gallery_field":
                        // setFields(null);
                        break;
                    default:
                        setFields(null);
                        break;
                }
                break;
            case "double_click":
                console.log("Double click");
                break;
            default:
                console.log("Default");
                break;
        }
    };

    const prepareInitialData = (values) => {
        if (values?.gallery) {
            values.gallery = (values?.gallery ?? [])
                .filter((item) => item.file_base64 != null)
                .map((item) => {
                    let base64 = item.file_base64;
                    const type = base64.split(";")[0].split(":")[1];
                    let y = base64[base64.length - 2] === "=" ? 2 : 1;
                    const size = base64.length * (3 / 4) - y;
                    const dimensions = imageInfo?.image ?? {};
                    return { id: item.id, name: item.file_filename, position: item.order, alt: item.file_filename, size: size, type: type, src: base64, path: item.file, dimensions: dimensions };
                });
        }
        return values;
    };

    const formatFormFields = (data) => {
        const {
            allow_size,
            allow_format,
            image: { width, height },
        } = data;
        const description = `Veličina  fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
        if (data) {
            const arr = formFieldsTemp?.map((field) => {
                if (field?.prop_name === "gallery") {
                    return {
                        ...field,
                        description: description,
                        validate: {
                            imageUpload: data,
                        },
                        ui_prop: {
                            fileUpload: {
                                ...field?.ui_prop?.fileUpload,
                                allow_format: allow_format,
                                allow_size: allow_size,
                                image: {
                                    width: width,
                                    height: height,
                                },
                                imageButton: {
                                    apiPathCrop: "admin/product-items/variants/gallery/options/crop",
                                },
                            },
                        },
                        dimensions: {
                            width: width,
                            height: height,
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

    const formatFormFieldsSeo = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            let arr = formFieldsTemp.map((field) => {
                if (field?.prop_name === "social_share_image") {
                    const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format
                        .map((format) => format.name)
                        .join(", ")}. ${field?.description}`;

                    return {
                        ...field,
                        description: descripiton,
                        validate: {
                            imageUpload: data,
                        },
                        ui_prop: {
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

    const handleInformationImage = async () => {
        await api
            .get(`admin/product-items/variants/gallery/options/upload`)
            .then((response) => {
                setImageInfo(response.payload);
                formatFormFields(response?.payload);
            })
            .catch((error) => console.warn(error));
        await api
            .get(`admin/product-items/variants/seo/options/upload`)
            .then((response) => {
                formatFormFieldsSeo(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const handleSubmitWrapper = (parentId, selectedColumn) => {
        const { urls, row } = selectedColumn;
        const handleSubmit = (data, options = {}) => {
            const allowedFormats = imageInfo ? imageInfo.allow_format.map((format) => format?.mime_type.toLowerCase()) : [];
            const allowSize = imageInfo ? Number(imageInfo.allow_size) : 0;
            const fileExtension = data?.type.toLowerCase();
            const fileSizeInB = Number(data.size);

            if (allowedFormats.length > 0 && allowedFormats.includes(fileExtension)) {
                if (fileSizeInB > allowSize) {
                    toast.error(`Veličina slike je prevelika. Maksimalna dozvoljena veličina je ${allowSize / (1024 * 1024)} MB.`);
                } else {
                    let req = {
                        id: data.new ? null : data.id,
                        id_product: row?.id ?? null,
                        id_product_parent: parentId ?? null,
                        file_base64: data.src,
                        order: data.position ?? 0,
                        title: null,
                        subtitle: null,
                        short_description: null,
                        description: null,
                    };

                    let postApi = options?.crop ? urls["save_crop"]?.url : urls["save"]?.url;
                    api.post(`${postApi}`, req)
                        .then((response) => {
                            toast.success("Uspešno");
                        })
                        .catch((error) => {
                            toast.warn("Greška");
                            console.warn(error);
                        });
                }
            } else {
                toast.error(`Nedozvoljeni format slike. Dozvoljeni formati su: ${allowedFormats.join(", ")}`);
            }
        };
        return handleSubmit;
    };

    const handleDelete = (id) => {
        api.delete(`${apiPathGallery}/${id}`)
            .then((response) => {
                toast.success("Uspešno");
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
            });
    };

    const handleReorder = (id, destination) => {
        api.put(`${apiPathGallery}/order`, { id: id, order: destination })
            .then((response) => {
                toast.success("Uspešno");
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
            });
    };

    useEffect(() => {
        if (selectedColumn) {
            const { galleryData, column } = selectedColumn;
            if (column?.prop_name === "gallery") {
                let allowFormats = imageInfo ? imageInfo.allow_format.map((format) => format?.name.toLowerCase()) : [];
                let description = `Dimenzije: ${imageInfo?.image?.width ?? ""} x ${imageInfo?.image?.height ?? ""} px. Veličina fajla ne sme biti veća od ${
                    imageInfo ? (imageInfo.allow_size / (1024 * 1024)).toFixed(2) : ""
                }MB. Dozvoljeni formati fajla: ${imageInfo ? imageInfo.allow_format.map((format) => format.name).join(", ") : ""}`;
                galleryFormFields?.map((item) => {
                    if (item?.prop_name === "gallery") {
                        item.uploadHandler = handleSubmitWrapper(parentId, galleryData);
                        item.deleteHandler = handleDelete;
                        item.handleReorder = handleReorder;
                        item.description = description;
                        item.validate.imageUpload = imageInfo;
                        item.ui_prop.fileUpload = {
                            allow_format: allowFormats,
                            allow_size: imageInfo?.allow_size,
                            image: {
                                width: imageInfo?.image?.width,
                                height: imageInfo?.image?.height,
                            },
                            imageButton: {
                                apiPathCrop: "admin/product-items/variants/gallery/options/crop",
                            },
                        };
                    }
                });
                setFields(galleryFormFields);
            }
        }
    }, [selectedColumn]);

    useEffect(() => {
        handleInformationImage();
    }, []);

    const validateData = (data, field) => {
        let ret = data;

        switch (field) {
            case "price_single_with_out_vat":
            case "price_vat_procent":
            case "price_quantity":
                ret.price_with_out_vat = Math.round(ret.price_quantity * ret.price_single_with_out_vat * 100) / 100;
                ret.price_with_vat = Math.round((ret.price_vat_procent / 100 + 1) * ret.price_with_out_vat * 100) / 100;
                return ret;
            case "price_with_out_vat":
                ret.price_with_vat = Math.round((ret.price_vat_procent / 100 + 1) * ret.price_with_out_vat * 100) / 100;
                ret.price_single_with_out_vat = Math.round((ret.price_with_out_vat / ret.price_quantity) * 100) / 100;
                return ret;
            case "price_with_vat":
                ret.price_with_out_vat = Math.round((ret.price_with_vat / (ret.price_vat_procent / 100 + 1)) * 100) / 100;
                ret.price_single_with_out_vat = Math.round((ret.price_with_out_vat / ret.price_quantity) * 100) / 100;
                return ret;
            case "quantity":
                ret.total = +ret.quantity - (+ret.b2b_reserve ?? 0) - (+ret.b2c_reserve ?? 0);
                return ret;
            default:
                return ret;
        }
    };
    return (
        <ListPage
            validateData={validateData}
            accept={imageInfo?.allow_format}
            columnFields={formFieldsTemp}
            useColumnFields={true}
            showNewButton={false}
            listPageId="ListVariants"
            apiUrl={`admin/product-items/variants/list/${parentId}`}
            title=" "
            apiPathCrop={`admin/product-items/variants/gallery/options/crop`}
            actionNewButton="modal"
            initialData={{ id_product_parent: parentId }}
            onClickFieldBehavior={(event, fieldBhavior, column, row, galleryData) => {
                if (column?.prop_name === "gallery") {
                    setShowSubmitModalButton(false);
                    let arr = galleryFormFields?.map((item, i) => {
                        return {
                            ...item,
                            additionalData: { column, galleryData },
                        };
                    });
                    setGalleryFormFields([...arr]);
                } else {
                    setShowSubmitModalButton(true);
                }
                filterFields(event, fieldBhavior, column);
                setSelectedColumn({ column, galleryData });
            }}
            customFields={fields}
            onModalCancel={() => {
                setFields(null);
            }}
            withoutSetterFunction
            prepareInitialData={prepareInitialData}
            useModalGalleryInjection={true}
            submitButtonForm={showSubmitModalButton}
            closeButtonModalForm={!showSubmitModalButton}
            labelSaveButton="Sačuvaj"
        />
    );
};

export default ProductVariation;
