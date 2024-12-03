import { useContext, useEffect, useState } from "react";
import { AutocompleteInputFreeSolo, FilePicker, InputCheckbox, InputDateTime, InputInput, InputText } from "../../../components/shared/Form/FormInputs/FormInputs";
import AuthContext from "../../../store/auth-contex";
import Buttons from "../../../components/shared/Form/Buttons/Buttons";
import Button from "../../../components/shared/Button/Button";
import { toast } from "react-toastify";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

const AdditionalSection = ({ basicData, openModal, onClickSubmitHandler = () => {}, onCloseUpdateData = () => {} }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    const [isLoading, setIsLoading] = useState(false);
    const [selectedValue, setSelectedValue] = useState("");
    const [selectedValueProduct, setSelectedValueProduct] = useState("");
    const [isIdNull, setIsIdNull] = useState(true);
    const [currentStep, setCurrentStep] = useState(1);
    const [purchaseDate, setPurchaseDate] = useState(null);
    const [productSku, setProductSku] = useState("");
    const [productName, setProductName] = useState("");
    const [descriptionReclamatins, setDescriptionReclamatins] = useState("");
    const [optionsProducts, setOptionsProducts] = useState([]);
    const [isChecked, setIsChecked] = useState([]);
    const [basicDataOrderNumber, setBasicDataOrderNumber] = useState([]);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [additionalSectionBasic, setAdditionalSectionBasic] = useState(basicData);

    const [fileInfo, setFileInfo] = useState(null);

    const apiPathNew = `admin/reclamations-b2b/items/order_items/${selectedValue}?id_company=${additionalSectionBasic?.id_company}`;

    const formattedCheckedValues = isChecked.map((value) => ({
        id: value,
        name: value,
    }));

    const fileBase64 = selectedFiles.map((item) => {
        return item.base_64;
    });

    const data = {
        id_reclamations: basicData?.id,

        id_order: !isIdNull ? basicDataOrderNumber?.id : null,
        order_slug: !isIdNull ? basicDataOrderNumber?.slug : null,
        order_date: !isIdNull ? basicDataOrderNumber?.created_at : null,

        id_order_item: !isIdNull ? selectedValueProduct?.id : null,
        id_product: !isIdNull ? selectedValueProduct?.id_product : null,
        product_sinhro_id: !isIdNull ? selectedValueProduct?.sinhro_id : null,

        fiscal_clip: isIdNull ? selectedValue : null,
        fiscal_clip_date: isIdNull ? purchaseDate : null,

        product_sku: isIdNull ? productSku : selectedValueProduct?.sku,
        product_name: isIdNull ? productName : selectedValueProduct?.name,

        description: descriptionReclamatins ?? "",
        responsive_type: formattedCheckedValues ?? [],
        file: fileBase64 ?? [],
    };

    const handleInformationImage = () => {
        api.get(`admin/reclamations-b2b/items/options/upload`)
            .then((response) => {
                setFileInfo(response.payload);
            })
            .catch((error) => console.warn(error));
    };

    const submitHandlerReclamationsNewId = () => {
        api.get(apiPathNew)
            .then((response) => {
                if (response.payload.id === null) {
                    setIsIdNull(true);
                    setCurrentStep(2);
                    setPurchaseDate(null);
                    setDescriptionReclamatins("");
                    setSelectedValueProduct("");
                } else {
                    setBasicDataOrderNumber(response.payload);
                    setIsIdNull(false);
                    setCurrentStep(2);
                    setPurchaseDate(new Date(response.payload.created_at));
                    setProductSku("");
                    setProductName("");
                    setDescriptionReclamatins("");
                    setSelectedValueProduct("");
                }
                const { items } = response.payload;
                let arr = [];
                items?.forEach((item, i) => {
                    let count = 0;
                    if (count < Number(item?.quantity)) {
                        arr.push({ ...item });
                    }
                });
                if (response?.payload?.id !== null) {
                    if (arr.length > 0) {
                        setOptionsProducts(arr);
                    } else {
                        console.log("Nema proizvoda.");
                    }
                } else {
                    setOptionsProducts(arr);
                }
            })
            .catch((error) => {
                toast.warn("Morate uneti broj računa!");
            });
    };

    const handleValueChange = (newValue) => {
        setSelectedValue(newValue);
    };

    const handleValueChangeProduct = (newValue) => {
        setSelectedValueProduct(newValue);
    };

    const handleCheckboxChange = (event) => {
        const { name, checked } = event.target;
        let isCheckedTemp = [...isChecked];
        if (checked) {
            isCheckedTemp.push(name);
        } else {
            isCheckedTemp = isCheckedTemp.filter((item) => item !== name);
        }
        setIsChecked(isCheckedTemp);
    };

    const handleRemoveClick = () => {
        setSelectedValue("");
        setIsIdNull(true);
        setCurrentStep(1);
        setPurchaseDate(null);
        setOptionsProducts([]);
        setBasicDataOrderNumber([]);
        setProductSku("");
        setProductName("");
        setDescriptionReclamatins("");
        setIsChecked([]);
        setSelectedFiles([]);
    };

    const responsiveType = [
        {
            id: 1,
            name: "Otklanjanje nedostatka proizvoda",
        },
        {
            id: 2,
            name: "Zamena proizvoda",
        },
        {
            id: 3,
            name: "Povraćaj novca",
        },
    ];

    // TODO: Resiti slanje order-a i statusa
    const submitHandlerValues = () => {
        setIsLoading(true);
        api.post(`/admin/reclamations-b2b/items`, { ...data, order: null, status: "new" })
            .then((response) => {
                setIsLoading(false);
                onClickSubmitHandler();
                toast.success("Uspešno sačuvani podaci!");
                onCloseUpdateData(response?.payload);
            })
            .catch((error) => {
                setIsLoading(false);
                toast.warn("Greška");
            });
    };

    useEffect(() => {
        handleInformationImage();
    }, []);

    return (
        <>
            <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
                Unos nove reklamacije
            </Typography>
            <>
                <AutocompleteInputFreeSolo
                    label="Broj računa"
                    fillFromApi={"admin/reclamations-b2b/items/ddl/order_numbers"}
                    usePropName={false}
                    queryString={`id_company=${additionalSectionBasic?.id_company}`}
                    description={`Unesite broj računa i pritisnite dugme "Pretraga"`}
                    required={true}
                    value={selectedValue}
                    disabled={currentStep === 2 ? true : false}
                    uiProp={{
                        columns: {
                            xs: 12,
                            sm: 6,
                            md: 8,
                            lg: 8,
                            xl: 8,
                        },
                    }}
                    onChange={(e, selectedValue) => {
                        //Case 1: {id: 'B2B-2023-000002', name: 'B2B-2023-000002'}
                        //Case 2: 123
                        //Case 3: {inputValue: '123', name: 'Dodaj: "123"'}
                        if (selectedValue === "" || selectedValue === null) {
                            handleRemoveClick();
                        } else {
                            if (typeof selectedValue === "object") {
                                if (selectedValue?.id === undefined) {
                                    handleValueChange(selectedValue?.inputValue);
                                } else {
                                    handleValueChange(selectedValue?.name);
                                }
                            } else {
                                handleValueChange(selectedValue);
                            }
                        }
                    }}
                />
                <Buttons className={"col-xs-12 col-sm-4 col-md-4 col-lg-4 col-xl-4"} styleWrapperButtons={{ alignItems: "center", marginTop: "0.2rem" }}>
                    <Button label="Pretraga" onClick={submitHandlerReclamationsNewId} sx={{ display: currentStep === 2 ? "none" : "flex", padding: "9px", width: "100%" }} variant="contained" />
                    {currentStep === 2 && <Button label="Ukloni" onClick={handleRemoveClick} variant="contained" sx={{ backgroundColor: "var(--red)", padding: "9px", width: "100%" }} />}
                </Buttons>
            </>
            {currentStep === 2 && (
                <>
                    <InputDateTime
                        label={"Datum kupovine"}
                        required={true}
                        uiProp={{
                            columns: {
                                xs: 12,
                                sm: 6,
                                md: 6,
                                lg: 6,
                                xl: 6,
                            },
                        }}
                        value={purchaseDate}
                        disabled={!isIdNull}
                        onChange={(e) => {
                            setPurchaseDate(e.target.value);
                        }}
                    />

                    {isIdNull ? (
                        <>
                            <InputInput
                                label={"Šifra proizvoda"}
                                value={productSku}
                                onChange={(e) => {
                                    setProductSku(e.target.value);
                                }}
                                required={true}
                                uiProp={{
                                    columns: {
                                        xs: 12,
                                        sm: 6,
                                        md: 6,
                                        lg: 6,
                                        xl: 6,
                                    },
                                }}
                            />
                            <InputInput
                                label={"Naziv proizvoda"}
                                value={productName}
                                onChange={(e) => {
                                    setProductName(e.target.value);
                                }}
                                required={true}
                                uiProp={{
                                    columns: {
                                        xs: 12,
                                        sm: 12,
                                        md: 12,
                                        lg: 12,
                                        xl: 12,
                                    },
                                }}
                            />
                        </>
                    ) : (
                        <>
                            <AutocompleteInputFreeSolo
                                label={"Proizvod"}
                                usePropName={false}
                                uiProp={{
                                    columns: {
                                        xs: 12,
                                        sm: 6,
                                        md: 6,
                                        lg: 6,
                                        xl: 6,
                                    },
                                }}
                                required={true}
                                onChange={(e, selectedValue) => {
                                    handleValueChangeProduct(selectedValue);
                                }}
                                options={optionsProducts}
                            />
                        </>
                    )}
                    <InputText
                        label={"Opis reklamacije"}
                        required={true}
                        value={descriptionReclamatins}
                        onChange={(e) => {
                            setDescriptionReclamatins(e.target.value);
                        }}
                        uiProp={{
                            columns: {
                                xs: 12,
                                sm: 12,
                                md: 12,
                                lg: 12,
                                xl: 12,
                            },
                        }}
                    />

                    <Box sx={{ margin: "0.5rem 0 0.25rem 0" }}>
                        <Typography variant="body1" sx={{ color: "rgba(0, 0, 0, 0.6)" }}>
                            U slučaju da Prodavac uvaži reklamaciju, Kupac ima pravo da bira između sledećih načina rešavanja reklamacije:
                        </Typography>
                        {responsiveType.map((item) => {
                            return <InputCheckbox key={item.id} label={item.name} name={item.name} value={isChecked.includes(item.name)} onChange={handleCheckboxChange} />;
                        })}
                    </Box>

                    <FilePicker
                        description={`Veličina fajla ne sme biti veća od ${fileInfo ? (fileInfo.allow_size / (1024 * 1024)).toFixed(2) : ""}MB. Dozvoljeni formati fajla: ${
                            fileInfo ? fileInfo.allow_format.map((format) => format.name).join(", ") : ""
                        }`}
                        label="Odabir fajla"
                        selectedFile={selectedFiles}
                        onFilePicked={(fileObject) => {
                            const { allow_format, allow_size } = fileInfo;
                            const { file } = fileObject;
                            const { type, size } = file;
                            const allowedFormats = allow_format.map((format) => format?.mime_type.toLowerCase());
                            const isFormatAllowed = allowedFormats.includes(type.toLowerCase());
                            const fileSizeInB = Number(size);
                            if (isFormatAllowed) {
                                if (fileSizeInB < Number(allow_size)) {
                                    setSelectedFiles([...selectedFiles, file]);
                                } else {
                                    toast.error(`Veličina fila je prevelika. Maksimalna dozvoljena veličina je ${allow_size / (1024 * 1024)} MB.`);
                                }
                            } else {
                                toast.error(`Nedozvoljeni format fajla.`);
                            }
                        }}
                        multipleFileSelection={true}
                        handleRemoveFile={(file) => {
                            const updatedFiles = selectedFiles.filter((item) => item.name !== file.name);
                            setSelectedFiles(updatedFiles);
                        }}
                        uiProp={{
                            columns: {
                                xs: 12,
                                sm: 12,
                                md: 12,
                                lg: 12,
                                xl: 12,
                            },
                            fileUpload: {
                                allow_format: fileInfo?.allow_format,
                                allow_size: fileInfo?.allow_size,
                            },
                        }}
                    />
                </>
            )}

            <Button
                label={isLoading ? <CircularProgress size="1.5rem" /> : "Sačuvaj"}
                onClick={submitHandlerValues}
                sx={{ margin: "1rem 0 0 auto", display: currentStep !== 2 ? "none" : "flex" }}
                variant="contained"
                disabled={isLoading}
            />
        </>
    );
};

export default AdditionalSection;
