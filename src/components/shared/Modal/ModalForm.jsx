import React, { useContext, useEffect, useState } from "react";

import Form from "../Form/Form";
import { toast } from "react-toastify";
import FormWrapper from "../Layout/FormWrapper/FormWrapper";
import ListPageModalWrapper from "./ListPageModalWrapper";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Button from "../Button/Button";
import AuthContext from "../../../store/auth-contex";

/**
 * Modal.
 *
 * @param anchor Side from which the drawer will appear ('bottom'|'left'|'right'|'top').
 * @param {bool} openModal Depending on what we set true or false, the modal opens or closes.
 * @param {function} setOpenModal
 * @param sx The system prop that allows defining system overrides as well as additional CSS styles.
 * @param {'permanent'|'persistent'|'temporary'} variant The variant to use.
 * @param {string} apiPathFormModal Api path.
 * @param {FieldSpec[]} formFields
 * @param initialData The initialData prop is an object that represents the initial data to populate the form fields in the modal.
 * @param label
 * @param customTitle The customTitle prop is a string that allows you to provide a custom title for the modal form.
 * @param shortText The shortText prop is a string that represents a short description or additional text to be displayed within the modal form.
 * @param cancelButton The cancelButton prop is a boolean flag that determines whether to display a cancel button in the modal form.
 * @param withoutSetterFunction The withoutSetterFunction prop is a boolean flag that determines whether to include the initialData when saving the form data to the API.
 * @param styleCheckbox The styleCheckbox prop represents additional styling or customization options for checkboxes within the form.
 * @param children The children prop allows you to include additional content or components inside the ModalForm component.
 * @param queryString  the queryString prop is an array that represents the query string parameters to be appended to the API request URL when fetching data.
 *
 * @return {JSX.Element}
 * @constructor
 */

const ModalForm = ({
    anchor,
    setPropName,
    openModal,
    setOpenModal,
    savePrapareDataHandler = null,
    sx,
    variant,
    apiPathFormModal,
    saveMethod = "post",
    formFields,
    initialData = {},
    label,
    customTitle,
    shortText,
    cancelButton,
    submitButton,
    closeButtonModalForm,
    clearButton = false,
    withoutSetterFunction = false,
    styleCheckbox,
    children,
    queryString = [],
    validateData = (data) => data,
    prepareInitialData = () => {},
    modalObject = null,
    customTitleDataNameForEdit = "Izmeni",
    selectableCountryTown = false,
    useModalGalleryInjection = false,
    onCloseModalButton,
    allowedFileTypes,
    onFilePicked,
    selectedFile,
    onDismissModal = () => {},
    handleRemoveFile,
    dataFromServer,
    apiPathCrop,
    isArray,
    setDoesRefetch,
    doesRefetch,
    isUploading = false,
}) => {
    const { id, modalUrl = null } = openModal;
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [data, setData] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const handleData = async () => {
        setIsLoading(true);
        // The queryStringLink array is initialized to store the formatted key-value pairs from the queryString prop.
        let queryStringLink = [];
        if (queryString.length) {
            queryString.map((item) => {
                queryStringLink.push(item.field + "=" + item.value);
            });
        }

        /* A query string is a part of a URL that contains data in the form of key-value pairs. It is commonly used to send data to the server or retrieve data from the server by appending parameters to the URL. The query string starts with a question mark "?" and consists of one or more key-value pairs separated by ampersands "&".
   The url variable is constructed by combining the apiPathFormModal, id, and the formatted query string. If there are query string parameters, they are appended to the URL using the "?" separator followed by the formatted key-value pairs joined with ampersands "&". For example, if apiPathFormModal is /api/modal, id is 1, and queryStringLink is [ 'param1=value1', 'param2=value2' ], then the resulting URL will be /api/modal/1?param1=value1&param2=value2.*/
        let url = `${apiPathFormModal}/${id}`;
        if (queryStringLink) {
            url += "?" + queryStringLink.join("&");
        }
        await api
            .get(modalUrl !== null ? modalUrl["data"]?.url : url)
            .then((response) => {
                let modifiedData = response?.payload;

                if (useModalGalleryInjection) {
                    modifiedData = prepareInitialData(modifiedData);
                }
                validateData(modifiedData);
                setData(modifiedData);
                setIsLoading(false);
            })
            .catch((error) => {
                console.warn(error);
                setIsLoading(false);
            });
    };

    const saveData = async (data) => {
        setIsLoading(true);

        let sendData = { ...data, ...initialData };

        if (typeof savePrapareDataHandler === "function") {
            let saveOptions = {
                data: data,
                initialData: initialData,
                connectedData: sendData,
                formFields: formFields,
            };
            let savePrapareData = savePrapareDataHandler(saveOptions);

            if (savePrapareData.setData == true) {
                setData(savePrapareData.data);
            }
        }

        if (!withoutSetterFunction) {
            api[saveMethod](`${modalUrl !== null ? modalUrl["save"]?.url : apiPathFormModal}`, sendData)
                .then((response) => {
                    setData(response?.payload);
                    toast.success(`Uspešno`);
                    setOpenModal({ ...openModal, show: false });
                    setIsLoading(false);
                    setDoesRefetch(!doesRefetch);
                })
                .catch((error) => {
                    console.warn(error);
                    toast.warning(error?.response?.data?.message ?? error?.response?.data?.payload?.message ?? "Greška");
                    setIsLoading(false);
                });
        } else {
            let objectForServer = sendData;
            if (modalObject) {
                objectForServer.id = modalObject?.id;
            }
            {
                !closeButtonModalForm &&
                    api[saveMethod](`${modalUrl !== null ? modalUrl["save"]?.url : apiPathFormModal}`, objectForServer)
                        .then((response) => {
                            toast.success(`Uspešno`);
                            setOpenModal({ ...openModal, show: false });
                            setIsLoading(false);
                            setDoesRefetch(!doesRefetch);
                        })
                        .catch((error) => {
                            console.warn(error);
                            toast.warning(error?.response?.data?.message ?? error?.response?.data?.payload?.message ?? "Greška");

                            setIsLoading(false);
                        });
            }
        }
    };

    /** function for clearing state after clear button press */
    const onClearDataPress = () => {
        setData({
            ...data,
            first_name: "",
            last_name: "",
            phone: "",
            email: "",
        });
    };

    useEffect(() => {
        if (openModal.show) {
            handleData();
        }
    }, [openModal.show]);

    return (
        <ListPageModalWrapper
            anchor={anchor}
            open={openModal.show ?? false}
            onClose={() => {
                onDismissModal();
                setOpenModal({ ...openModal, show: false });
            }}
            sx={sx}
            variant={variant}
            onCloseButtonClick={() => {
                onDismissModal();
                setOpenModal({ ...openModal, show: false });
            }}
        >
            {!isLoading ? (
                children || (
                    <>
                        <FormWrapper title={customTitle ? customTitle : data?.id === null ? "Novi unos" : data?.name ?? customTitleDataNameForEdit}>
                            {shortText ? (
                                <Typography variant="body2" sx={{ marginBottom: "0.8rem" }}>
                                    {shortText}
                                </Typography>
                            ) : null}
                            {clearButton && (
                                <Button
                                    label="Resetujte vrednosti"
                                    onClick={() => {
                                        onClearDataPress();
                                    }}
                                    variant="contained"
                                />
                            )}
                            <Form
                                formFields={formFields}
                                initialData={data}
                                onSubmit={saveData}
                                label={label}
                                cancelButton={cancelButton}
                                submitButton={submitButton}
                                closeButton={closeButtonModalForm}
                                onCancel={() => setOpenModal({ ...openModal, show: false })}
                                styleCheckbox={styleCheckbox}
                                validateData={validateData}
                                onCloseModalButton={() => {
                                    setOpenModal({ show: false });
                                }}
                                apiPathCrop={apiPathCrop}
                                allowedFileTypes={allowedFileTypes}
                                onFilePicked={onFilePicked}
                                selectedFile={selectedFile}
                                handleRemoveFile={handleRemoveFile}
                                dataFromServer={dataFromServer}
                                setPropName={setPropName}
                                isArray={isArray}
                                isUploading={isUploading}
                            />
                        </FormWrapper>
                    </>
                )
            ) : (
                <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
                    <CircularProgress size="2rem" sx={{ marginTop: "50vh" }} />
                </Box>
            )}
        </ListPageModalWrapper>
    );
};

export default ModalForm;
