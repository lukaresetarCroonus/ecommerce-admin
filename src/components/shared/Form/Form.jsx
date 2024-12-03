import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "../Button/Button";
import CreateForm from "./CreateForm";
import Buttons from "./Buttons/Buttons";
import { formatDate, formatDateTime } from "../../../helpers/dateFormat";
import ImageDialog from "../Dialogs/ImageDialog";
import { isUrlValid } from "./util";
import { isEmpty } from "lodash";
import { toast } from "react-toastify";

const Form = ({
    formFields = [],
    initialData = {},
    onSubmit = () => null,
    onCancel = () => navigate(-1),
    onCloseModalButton = () => {},
    cancelButton = false,
    submitButton = true,
    closeButton = false,
    queryString = "",
    onChange = () => {},
    validateData = (data) => data,
    label,
    styleCheckbox,
    isLoading,
    onFilePicked = () => {},
    handleRemoveFile = () => {},
    selectedFile,
    styleButtonSubmit,
    styleWrapperButtons,
    dataFromServer,
    widthOfElement,
    heightOfElement,
    apiPathCrop,
    allowedFileTypes,
    isArray,
    id,
    inPlaceInput = {
        enabled: false,
    },
    isUploading = false,
}) => {
    const navigate = useNavigate();
    const [data, setData] = useState(initialData ?? {});
    const [inputsError, setInputsError] = useState([]);
    const [openImageDialog, setOpenImageDialog] = useState({
        show: false,
        image: null,
        label: "",
        item: null,
        path: "",
        apiPathCrop: "",
        alt: data.name,
        width: widthOfElement,
        height: heightOfElement,
        name: "",
    });
    let propAutoFocus = false;
    let checkIsFocused = false;

    function setInputErrors(name) {
        setInputsError((inputsError) => {
            delete inputsError[name];
            return inputsError;
        });
    }
    const submitHandler = (event) => {
        event.preventDefault && event.preventDefault();

        const errors = {};
        for (const field of formFields) {
            if (field.required && field.input_type !== "switch" && (data[field.prop_name] === "" || data[field.prop_name] == null)) {
                errors[field.prop_name] = {
                    content: "Polje je obavezno, molim Vas unesite vrednost.",
                };
            }
        }
        if (!isEmpty(errors)) {
            console.error("Nisu popunjena sva obavezna polja. ", errors);
        }

        isEmpty(errors) ? onSubmit(data) : setInputsError(errors);
    };

    const formItemAutoCompleteChangeHandler = (name, value) => {
        let newData = { ...data, [name]: value };
        setData(validateData(newData, name));
        setInputErrors(name);
    };

    const formItemChangeHandler = ({ target }, type) => {
        let newData;
        switch (type) {
            case "date":
                newData = { ...data, [target.name]: formatDate(target.value) };
                break;
            case "date_time":
                newData = { ...data, [target.name]: formatDateTime(target.value) };
                break;
            case "checkbox":
            case "switch":
                newData = { ...data, [target.name]: target.checked ? 1 : 0 };
                break;
            default:
                newData = { ...data, [target.name]: target.value };
                break;
        }

        newData = validateData(newData, target.name);
        setData(newData);
        onChange(newData, target.name);
        setInputErrors(target.name);
    };

    const formImageUpload = useCallback(
        (event, validation) => {
            if (validation) {
                event.preventDefault();
                const selectedFile = event.target.files[0];
                const { size } = selectedFile;
                const { allow_size, allow_format } = validation;
                let arrOfMimeTypes = allow_format.map((format) => format.mime_type);

                const allowSize = allow_size ? Number(allow_size) : 0;
                const fileSizeInB = Number(size);
                let isSizeAllowed = fileSizeInB < allowSize;
                let isFormatAllowed = arrOfMimeTypes.includes(selectedFile.type);
                if (!isFormatAllowed) {
                    toast.error(`Nedozvoljeni format slike. Dozvoljeni formati su: ${arrOfMimeTypes.join(", ")}`);
                    return;
                }
                if (!isSizeAllowed) {
                    toast.error(`Veličina slike je prevelika. Maksimalna dozvoljena veličina je ${allowSize / (1024 * 1024)} MB.`);
                    return;
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    const timeOutId = setTimeout(() => {
                        setter(event, reader.result);
                    }, 500);
                    return () => clearTimeout(timeOutId);
                };
                reader.readAsDataURL(selectedFile);
            } else {
                event.preventDefault();
                const selectedFile = event.target.files[0];

                const reader = new FileReader();
                reader.onloadend = () => {
                    const timeOutId = setTimeout(() => {
                        setter(event, reader.result);
                    }, 500);
                    return () => clearTimeout(timeOutId);
                };
                reader.readAsDataURL(selectedFile);
            }
        },
        [data]
    );

    const onOpenImageDialog = (img, label, imageName, width, height, item, size, dimensions, alt) => {
        const found = data[imageName];
        const checkImage = isUrlValid(img);
        let image_name = item?.prop_name + "_filename";
        let image_url = item?.prop_name + "_url";

        const image_Name = data[image_name];
        const image_Url = data[image_url];

        if (checkImage) {
            setOpenImageDialog({
                show: true,
                image: found,
                label: label,
                item: item,
                image_name: image_Name,
                image_url: image_Url,
                dimensions: dimensions,
                apiPathCrop: item?.ui_prop?.fileUpload?.imageButton?.apiPathCrop ?? apiPathCrop,
                width: width,
                alt: alt,
                size: size,
                height: height,
                name: imageName,
                showDimensions: false,
            });
        } else {
            setOpenImageDialog({
                show: true,
                image: img,
                label: label,
                item: item,
                alt: alt,
                image_name: image_Name,
                image_url: image_Url,
                size: size,
                apiPathCrop: item?.ui_prop?.fileUpload?.imageButton?.apiPathCrop ?? apiPathCrop,
                width: width,
                height: height,
                dimensions: dimensions,
                name: imageName,
                showDimensions: true,
            });
        }
    };

    const handleCloseImageDialog = () => {
        setOpenImageDialog({ show: false, image: null, label: "", name: "" });
    };

    const handleSaveEditImage = (imageName, image) => {
        setData({ ...data, [imageName]: image });
    };

    const handleDeleteImage = (imageName) => {
        setData({ ...data, [imageName]: "DELETE" });
    };

    const setter = (event, result) => {
        setData({ ...data, [event.target.name]: result });
    };

    useEffect(() => {
        if (!inPlaceInput.enabled) {
            setData(initialData);
        }
    }, [initialData]);

    useEffect(() => {
        if (inPlaceInput?.enabled) {
            const getData = async () => {
                const data_tmp = await inPlaceInput.function(inPlaceInput.functionData);
                setData(data_tmp);
            };
            getData();
        }
    }, []);

    const filteredFields = formFields.filter((field) => {
        // Default value for display field in form
        field.croonus_use_in_details = field.in_details;

        // Check if field need to display on new or edit form
        if (field?.in_details) {
            if ("id" in data) {
                if (data.id === null) {
                    if ("in_details_new_display" in field) {
                        field.croonus_use_in_details = field.in_details_new_display;
                    }
                } else {
                    if ("in_details_edit_display" in field) {
                        field.croonus_use_in_details = field.in_details_edit_display;
                    }
                }
            }
        }
        return field;
    });

    return (
        <>
            <Box id={id ?? ""} component="form" autoComplete="off" onSubmit={submitHandler} sx={{ display: "flex", flexWrap: "wrap" }}>
                {(filteredFields ?? [])
                    .filter((field) => field.croonus_use_in_details)
                    .map((item, index) => {
                        // Priprema vrednosti pre nego sto se prosledi u komponentu
                        let temp_value = Array.isArray(item) && data ? data[item.prop_name] : data[item.prop_name];
                        // Provera da li input ima vrednost, ukoliko nema prvi input koji nema vrednost se fokusira da bi korisnik mogao da nesmetano unosi podatke
                        if (temp_value === null && !checkIsFocused) {
                            checkIsFocused = true;
                            propAutoFocus = true;
                        } else {
                            propAutoFocus = false;
                        }

                        return (
                            <CreateForm
                                data-test-id="admin-form"
                                onChangeHandler={formItemChangeHandler}
                                onChangeAutoHandler={formItemAutoCompleteChangeHandler}
                                onImageUpload={(ev) => {
                                    let validation = item?.validate?.imageUpload !== null && item?.validate?.imageUpload !== undefined ? item?.validate?.imageUpload : null;
                                    formImageUpload(ev, validation);
                                }}
                                onOpenImageDialog={onOpenImageDialog}
                                item={item}
                                key={index}
                                error={inputsError[item.prop_name] ? inputsError[item.prop_name].content : null}
                                value={temp_value}
                                queryString={queryString}
                                disabled={item.disabled || (item.prop_name === "slug" && data.system_required === 1)}
                                styleCheckbox={styleCheckbox}
                                autoFocus={propAutoFocus}
                                onFilePicked={(fileObject) => {
                                    //passing object to upper level
                                    onFilePicked(fileObject);
                                    //deleting import error object:
                                    setInputErrors("import");
                                    //deleting file error object:
                                    setInputErrors("file");
                                    //setting data to be defiend in value:
                                    setData({ ...data, import: fileObject.name, file: fileObject.name, [item.prop_name]: fileObject.base_64 });
                                }}
                                selectedFile={selectedFile}
                                handleRemoveFile={handleRemoveFile}
                                dataFromServer={dataFromServer}
                                apiPathCrop={apiPathCrop}
                                allowedFileTypes={allowedFileTypes}
                                isArray={isArray}
                            />
                        );
                    })}

                <Buttons styleWrapperButtons={styleWrapperButtons}>
                    {cancelButton && <Button label="Odustani" onClick={onCancel} />}
                    {submitButton && (
                        <Button
                            type="submit"
                            label={isLoading || isUploading ? <CircularProgress size="1.5rem" /> : label ? label : "Sačuvaj"}
                            variant="contained"
                            disabled={isLoading || isUploading}
                            sx={styleButtonSubmit}
                        />
                    )}
                    {closeButton && <Button type="submit" label={label ? label : "Sačuvaj"} variant="contained" onClick={onCloseModalButton} />}
                </Buttons>
            </Box>

            <ImageDialog
                title="Obrada slike"
                apiPathCrop={apiPathCrop}
                allowedFileTypes={openImageDialog?.item?.validate?.imageUpload?.allow_format ?? openImageDialog?.item?.ui_prop?.fileUpload?.allow_format ?? allowedFileTypes}
                openImageDialog={openImageDialog}
                handleCloseImageDialog={handleCloseImageDialog}
                onImageUpload={formImageUpload}
                handleSaveEditImage={handleSaveEditImage}
                handleDeleteImage={handleDeleteImage}
            />
        </>
    );
};

export default Form;
