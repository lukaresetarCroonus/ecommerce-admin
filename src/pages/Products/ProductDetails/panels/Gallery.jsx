import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputMultipleImages from "../../../../components/shared/InputMultipleImages/InputMultipleImages";
import GallerySkeleton from "../../../../components/shared/Loading/GallerySkeleton";
import AuthContext from "../../../../store/auth-contex";
import UploadLoading from "../../../../components/shared/Loading/UploadSkeleton";

const Gallery = ({ productId }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [data, setData] = useState([]);
    const apiPath = "admin/product-items/gallery";
    const apiPathCrop = "admin/product-items/gallery/image-crop";
    const [loading, setLoading] = useState(false);
    const [imageInfo, setImageInfo] = useState(null);
    const [imageUploadLoading, setImageUploadLoading] = useState(false);

    const handleData = (showLoader = false) => {
        if (showLoader) {
            setLoading(true);
        }
        api.list(`${apiPath}/${productId}`)
            .then((response) => {
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
        api.get(`admin/product-items/gallery/options/upload`)
            .then((response) => {
                setImageInfo(response.payload);
            })
            .catch((error) => console.warn(error));
    };

    const handleSubmit = async (data, options = {}) => {
        // setLoading(true);
        setImageUploadLoading(true);
        const allowedFormats = imageInfo ? imageInfo.allow_format.map((format) => format?.mime_type.toLowerCase()) : [];
        const allowSize = imageInfo ? Number(imageInfo.allow_size) : 0;
        const fileExtension = data?.type.toLowerCase();
        const fileSizeInB = Number(data.size);

        if (allowedFormats.length > 0 && !allowedFormats.includes(fileExtension)) {
            toast.error(`Nedozvoljeni format slike. Dozvoljeni formati su: ${allowedFormats.join(", ")}`);
            setImageUploadLoading(false);
            return false;
        } else if (fileSizeInB > allowSize) {
            toast.error(`Veličina slike je prevelika. Maksimalna dozvoljena veličina je ${allowSize / (1024 * 1024)} MB.`);
            setImageUploadLoading(false);
            return false;
        } else {
            let req = {
                id: data.new ? null : data.id,
                id_product: productId,
                file_base64: data.src,
                order: data.position ?? 0,
                title: null,
                subtitle: null,
                alt: data?.alt ?? null,
                short_description: null,
                description: null,
                path: data.file,
            };
            let postApi = options?.crop ? apiPathCrop : apiPath;
            await api
                .post(`${postApi}`, req)
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
            return true;
        }
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

    const handleChange = () => {
        handleData(false);
    };

    let list = (data ?? [])
        .filter((item) => item.file_base64 != null)
        .map((item) => {
            let base64 = item.file_base64;
            const type = base64.split(";")[0].split(":")[1];
            let y = base64[base64.length - 2] === "=" ? 2 : 1;
            const size = base64.length * (3 / 4) - y;
            const dimensions = imageInfo?.image ?? {};
            return {
                id: item.id,
                name: item.file_filename,
                position: item.order,
                alt: item.alt,
                size: size,
                type: type,
                src: base64,
                path: item.file,
                dimensions: dimensions,
                id_product: item.id_product,
            };
        });

    useEffect(() => {
        handleData(true);
        handleInformationImage();
    }, []);

    return (
        <>
            {imageUploadLoading ? (
                <UploadLoading textUploading={"Učitavanje slike je u toku.."} />
            ) : loading ? (
                <GallerySkeleton />
            ) : (
                <InputMultipleImages
                    list={list}
                    apiPathCrop={`admin/product-items/gallery/options/crop`}
                    name="Galerija"
                    accept={imageInfo ? imageInfo.allow_format : []}
                    isArray={true}
                    onChangeHandler={() => {}}
                    uploadHandler={handleSubmit}
                    deleteHandler={handleDelete}
                    handleReorder={handleReorder}
                    handleChange={handleChange}
                    description={`Dimenzije: ${imageInfo?.image?.width ?? ""} x ${imageInfo?.image?.height ?? ""} px. Veličina fajla ne sme biti veća od ${
                        imageInfo ? (imageInfo.allow_size / (1024 * 1024)).toFixed(2) : ""
                    }MB. Dozvoljeni formati fajla: ${imageInfo ? imageInfo.allow_format.map((format) => format.name).join(", ") : ""}`}
                />
            )}
        </>
    );
};

export default Gallery;
