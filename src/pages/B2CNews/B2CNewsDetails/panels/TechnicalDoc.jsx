import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputMultipleFiles from "../../../../components/shared/InputMultipleFiles/InputMultipleFiles";
import formFields from "../forms/technical_doc.json";
import AuthContext from "../../../../store/auth-contex";
import UploadSkeleton from "../../../../components/shared/Loading/UploadSkeleton";
import GallerySkeleton from "../../../../components/shared/Loading/GallerySkeleton";

const TechnicalDoc = ({ newsId }) => {
    const init = {
        id: null,
        id_news: newsId,
        id_news_variant: null,
        technical_doc: null,
    };
    const [data, setData] = useState([]);
    const [imageInfo, setImageInfo] = useState(null);
    const [documentUploadLoading, setDocumentUploadLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/news-b2c/news/technical-doc";
    const apiPathCrop = "admin/news-b2c/news/technical-doc/options/crop";
    const [fileTypes, setFileTypes] = useState([]);

    const handleInformationImage = () => {
        api.get(`admin/news-b2c/news/technical-doc/options/upload`)
            .then((response) => {
                setImageInfo(response.payload);
                setFileTypes(response?.payload?.allow_format);
            })
            .catch((error) => console.warn(error));
    };

    const handleData = (showLoader = false) => {
        if (showLoader) {
            setLoading(true);
        }
        api.list(`${apiPath}/${newsId}`)
            .then((response) => {
                console.log("response", response);
                setData(response?.payload?.items);
                if (showLoader) {
                    setLoading(false);
                }
            })
            .catch((error) => {
                console.warn(error);
                if (showLoader) {
                    setLoading(false);
                }
            });
    };

    const handleSubmit = (data, options = {}) => {
        setDocumentUploadLoading(true);
        const allowedFormats = imageInfo ? imageInfo.allow_format.map((format) => format?.mime_type.toLowerCase()) : [];
        const allowSize = imageInfo ? Number(imageInfo.allow_size) : 0;
        const fileExtension = data?.type.toLowerCase();
        const fileSizeInB = Number(data.size);

        if (allowedFormats.length > 0 && !allowedFormats.includes(fileExtension)) {
            toast.error(`Nedozvoljeni format slike. Dozvoljeni formati su: ${allowedFormats.join(", ")}`);
            // setLoading(false);
            setDocumentUploadLoading(false);
            return;
        }

        if (fileSizeInB > allowSize) {
            toast.error(`Veličina slike je prevelika. Maksimalna dozvoljena veličina je ${allowSize / (1024 * 1024)} MB.`);
            // setLoading(false);
            setDocumentUploadLoading(false);
            return;
        }
        let req = {
            id: data.new ? null : data.id,
            id_news: newsId,
            file_base64: data.src,
            order: data.position,
            title: data.title ?? null,
            subtitle: data.subtitle ?? null,
            short_description: data.short_description ?? null,
            description: data.description ?? null,
            thumb_image: data.thumb_image ?? null,
            thumb_image_base64: data.thumb_image_base64 ?? null,
            thumb_filename: data.thumb_filename ?? null,
        };

        let postApi = options?.crop ? apiPathCrop : apiPath;
        api.post(`${postApi}`, req)
            .then((response) => {
                toast.success("Uspešno");
                handleData();
                setDocumentUploadLoading(false);
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
                setDocumentUploadLoading(false);
            });
    };

    const handleSaveForm = (data) => {
        api.post(`${apiPath}`, data)
            .then((response) => {
                toast.success("Uspešno");
                handleData();
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
            });
    };

    const handleDelete = (id) => {
        api.delete(`${apiPath}/${id}`)
            .then((response) => {
                toast.success("Uspešno");
                handleData(false);
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
            });
    };

    const handleReorder = (id, destination) => {
        api.put(`${apiPath}/order`, { id: id, order: destination })
            .then((response) => {
                toast.success("Uspešno");
                handleData(false);
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
            });
    };

    let list = data.map((item) => {
        let base64 = item.file_base64 ? item.file_base64 : "";
        const type = base64.split(";")[0].split(":")[1];
        let y = base64[base64.length - 2] === "=" ? 2 : 1;
        const size = base64.length * (3 / 4) - y;
        return { ...item, id: item.id, name: item.file_filename, position: item.order, alt: item.filename, size: size, type: type, src: base64 };
    });

    useEffect(() => {
        handleData(true);
        handleInformationImage();
    }, []);

    return (
        <>
            {documentUploadLoading ? (
                <UploadSkeleton textUploading={"Učitavanje dokumenta je u toku.."} />
            ) : loading ? (
                <GallerySkeleton />
            ) : (
                <InputMultipleFiles
                    description={`Veličina fajla ne sme biti veća od ${imageInfo ? (imageInfo.allow_size / (1024 * 1024)).toFixed(2) : ""}MB. Dozvoljeni formati fajla: ${
                        imageInfo ? imageInfo.allow_format.map((format) => format.name).join(", ") : ""
                    }`}
                    list={list}
                    accept={fileTypes?.map((type) => type?.mime_type)}
                    name="technical_doc"
                    onChangeHandler={() => {}}
                    uploadHandler={handleSubmit}
                    deleteHandler={handleDelete}
                    handleReorder={handleReorder}
                    changeFileData={() => {}}
                    // accept=".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf"
                    dialogFormFields={formFields}
                    dialogGetPath={apiPath}
                    saveDataHandler={handleSaveForm}
                />
            )}
        </>
    );
};

export default TechnicalDoc;
