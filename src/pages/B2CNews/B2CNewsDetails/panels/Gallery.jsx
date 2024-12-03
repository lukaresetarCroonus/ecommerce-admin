import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputMultipleImages from "../../../../components/shared/InputMultipleImages/InputMultipleImages";
import AuthContext from "../../../../store/auth-contex";
import GallerySkeleton from "../../../../components/shared/Loading/GallerySkeleton";
import UploadSkeleton from "../../../../components/shared/Loading/UploadSkeleton";

const Gallery = ({ newsId, apiPathForCrop, allowedFileTypes }) => {
    const [data, setData] = useState([]);
    const [imageInfo, setImageInfo] = useState(null);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);
    const [loading, setLoading] = useState(false);
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/news-b2c/news/gallery";
    const apiPathCrop = apiPathForCrop ?? "admin/news-b2c/news/gallery/image-crop";

    const handleData = (showLoader = false) => {
        if (showLoader) {
            setLoading(true);
        }
        api.list(`${apiPath}/${newsId}`)
            .then((response) => {
                console.log(response);
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

    const handleInformationImage = () => {
        api.get(`admin/news-b2c/news/gallery/options/upload`)
            .then((response) => {
                setImageInfo(response.payload);
            })
            .catch((error) => console.warn(error));
    };

    const handleCropInformationImage = () => {
        api.get(`admin/news-b2c/news/gallery/options/crop`)
            .then((response) => {
                console.log("reponse", response.payload);
            })
            .catch((error) => console.warn(error));
    };

    const handleSubmit = (data, options = {}) => {
        setImageUploadLoading(true);
        const allowedFormats = imageInfo ? imageInfo.allow_format.map((format) => format?.mime_type.toLowerCase()) : [];
        const allowSize = imageInfo ? Number(imageInfo.allow_size) : 0;
        const fileExtension = data?.type.toLowerCase();
        const fileSizeInB = Number(data.size);

        if (allowedFormats.length > 0 && !allowedFormats.includes(fileExtension)) {
            toast.error(`Nedozvoljeni format slike. Dozvoljeni formati su: ${allowedFormats.join(", ")}`);
            // setLoading(false);
            setImageUploadLoading(false);
            return;
        }

        if (fileSizeInB > allowSize) {
            toast.error(`Veličina slike je prevelika. Maksimalna dozvoljena veličina je ${allowSize / (1024 * 1024)} MB.`);
            // setLoading(false);
            setImageUploadLoading(false);
            return;
        }

        let req = {
            id: data.new ? null : data.id,
            id_news: newsId,
            file_base64: data.src,
            order: data.position ?? 0,
            title: null,
            subtitle: null,
            short_description: null,
            description: null,
            path: data.file ?? null,
        };

        let postApi = options?.crop ? apiPath : "admin/news-b2c/news/gallery";
        api.post(`${postApi}`, req)
            .then((response) => {
                toast.success("Uspešno");
                handleData();
                setImageUploadLoading(false);
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
                setImageUploadLoading(false);
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

    let list = (data ?? [])
        .filter((item) => item.file_base64 != null)
        .map((item) => {
            let base64 = item.file_base64;
            const type = base64.split(";")[0].split(":")[1];
            let y = base64[base64.length - 2] === "=" ? 2 : 1;
            const size = base64.length * (3 / 4) - y;
            return { id: item.id, name: item.file_filename, position: item.order, alt: item.file_filename, size: size, type: type, src: base64, path: item.file };
        });

    useEffect(() => {
        handleData(true);
        handleInformationImage();
        handleCropInformationImage();
    }, []);

    return (
        <>
            {imageUploadLoading ? (
                <UploadSkeleton textUploading={"Učitavanje slike je u toku.."} />
            ) : loading ? (
                <GallerySkeleton />
            ) : (
                <InputMultipleImages
                    apiPathCrop={apiPathCrop}
                    description={`Veličina fajla ne sme biti veća od ${imageInfo ? (imageInfo.allow_size / (1024 * 1024)).toFixed(2) : ""}MB. Dozvoljeni formati fajla: ${
                        imageInfo ? imageInfo.allow_format.map((format) => format.name).join(", ") : ""
                    }`}
                    list={list}
                    isArray={true}
                    accept={allowedFileTypes}
                    name="Galerija"
                    onChangeHandler={() => {}}
                    uploadHandler={handleSubmit}
                    deleteHandler={handleDelete}
                    handleReorder={handleReorder}
                />
            )}
        </>
    );
};

export default Gallery;
