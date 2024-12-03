import { useCallback, useContext, useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

import ImageDialogFullPage from "../MultipleImages/ImageDialogFullPage/ImageDialogFullPage";
import ImageListRow from "../MultipleImages/ImageListRow/ImageListRow";
import MultipleImages from "../MultipleImages/MultipleImages";
import DeleteDialog from "../Dialogs/DeleteDialog";
import AuthContext from "../../../store/auth-contex";
import { toast } from "react-toastify";

const getLoadedFile = (file, i, len) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            let ret = {
                id: i + 1 + len,
                name: file.name,
                position: i + 1 + len,
                alt: file.name,
                size: file.size,
                type: file.type,
                src: reader.result,
                new: true,
            };
            resolve(ret);
        };

        reader.readAsDataURL(file);
    });
};

export const InputMultipleImagesOne = ({
    list = [],
    onChangeHandler = () => {},
    accept = "image/*",
    name = "",
    uploadHandler = () => {},
    deleteHandler = () => {},
    handleReorder,
    description,
    validate = null,
    additionalData = null,
    ui_prop,
    allowedFileTypes,
}) => {
    const {
        fileUpload: {
            allow_format,
            imageButton: { apiPathCrop },
        },
    } = ui_prop;
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    const [imageList, setImageList] = useState(list);
    const [dragActive, setDragActive] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState({
        show: false,
        id: null,
        mutate: null,
    });

    const init = {
        show: false,
        image: "",
        alt: "",
        name: "",
        size: "",
        type: "",
        path: "",
        position: 0,
        dimensions: {},
    };

    const [openFullPageDialog, setOpenFullPageDialog] = useState(init);

    //DRAG EVENT HANDLER
    const handleDrag = function (e) {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    //FILES UPLOAD HANDLER
    const handleUpload = async function (e) {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        let selectedFiles = [];
        if (e?.dataTransfer?.files && e.dataTransfer.files[0]) {
            selectedFiles = e.dataTransfer.files;
        } else if (e?.target?.files && e.target.files[0]) {
            selectedFiles = e.target.files;
        }

        if (selectedFiles.length > 0) {
            let newImagesArray = [];

            let len = imageList === undefined ? 0 : imageList.length;
            var file = selectedFiles[0];
            const obj = await getLoadedFile(file, 0, len);
            const { column, galleryData } = additionalData;
            const { urls, row } = galleryData;
            let req = {
                id: obj.new ? null : obj.id,
                id_product: row?.id ?? null,
                id_product_parent: row?.id_parent ?? null,
                file_base64: obj.src,
                order: obj.position ?? 0,
                title: null,
                subtitle: null,
                short_description: null,
                description: null,
            };
            if (validate !== undefined && validate !== null) {
                let image = selectedFiles[0];
                const { size, type } = image;
                const { imageUpload } = validate;
                const { allow_size, allow_format } = imageUpload;
                let allowedFormatMime = allow_format?.map((item, i) => {
                    return item?.mime_type;
                });
                if (allowedFormatMime.includes(type)) {
                    if (size > allow_size) {
                        toast.error(`Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB.`);
                    } else {
                        let postApi = urls["save"]?.url;
                        let newObj = {};
                        api.post(postApi, req)
                            .then((res) => {
                                let objectFromApi = res.payload;

                                let base64 = objectFromApi.file_base64;
                                const typeBase64 = base64.split(";")[0].split(":")[1];
                                let y = base64[base64.length - 2] === "=" ? 2 : 1;
                                const sizeBase64 = base64.length * (3 / 4) - y;
                                newObj = {
                                    id: objectFromApi?.id,
                                    name: objectFromApi?.file_filename,
                                    position: objectFromApi?.order,
                                    alt: objectFromApi?.file_filename,
                                    size: sizeBase64,
                                    type: typeBase64,
                                    src: objectFromApi?.file_base64,
                                    path: objectFromApi?.file,
                                };
                                newImagesArray.push(newObj);
                                setImageList([...imageList, ...newImagesArray]);
                            })
                            .catch((err) => {
                                toast.warning(err.response.data.message ?? err?.response?.data?.payload?.message ?? "Greška");
                            });
                    }
                } else {
                    toast.error("Pogrešan tip fajla.");
                }
            }
        }
    };

    //MODAL OPEN HANDLER
    const handleModalOpen = (e, src, alt, name, size, type, id, position, path, dimensions) => {
        setOpenFullPageDialog({
            show: true,
            id: id,
            image: src,
            alt: alt,
            name: name,
            size: size,
            type: type,
            path: path,
            position: position,
            dimensions: dimensions,
        });
    };

    //CLOSE MODAL
    const handleCloseImageDialog = () => {
        setOpenFullPageDialog(init);
    };

    //IMAGE UPLOAD FROM MODAL
    const formImageUpload = useCallback(
        (event) => {
            event.preventDefault();
            const selectedFile = event.target.files[0];
            const reader = new FileReader();
            reader.onloadend = () => {
                const timeOutId = setTimeout(() => {
                    imageSetter(event, reader.result, selectedFile);
                }, 800);
                return () => clearTimeout(timeOutId);
            };
            reader.readAsDataURL(selectedFile);
        },
        [openFullPageDialog]
    );

    const imageSetter = (event, result, selectedFile) => {
        const find = imageList.filter((item) => {
            return item.name === event.target.id;
        });
        const found = find[0];
        let imageItem = {
            id: found.id,
            position: found.position,
            alt: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            name: selectedFile.name,
            path: selectedFile.path,
            src: result,
        };

        uploadHandler(imageItem);

        const newState = imageList.map((img) => {
            if (img.id === found.id) {
                return { ...imageItem };
            }
            return img;
        });
        setImageList(newState);

        setOpenFullPageDialog({
            ...openFullPageDialog,
            show: true,
            image: result,
            name: selectedFile.name,
            alt: selectedFile.name,
            size: selectedFile.size,
            type: selectedFile.type,
            path: selectedFile.path,
        });
    };
    //TODO prosledjen item
    const handleDeleteImage = (e, deleteImgId, isNew, item) => {
        setOpenDeleteDialog({ show: true, id: deleteImgId, isNew: isNew, mutate: null });
    };

    const handleCancel = () => {
        setOpenDeleteDialog({ show: false, id: null, isNew: false });
    };

    const handleConfirm = () => {
        // If it is an edit mode it value of property src/image should be string "DELETE"
        // but if it is a first upload it should be removed from images array
        if (!openDeleteDialog.isNew) {
            deleteHandler(openDeleteDialog.id);
        }

        const newState = [];
        for (const img of imageList) {
            if (img.id !== openDeleteDialog.id) {
                newState.push(img);
            }
        }
        setImageList(newState);
        setOpenFullPageDialog(init);
        setOpenDeleteDialog({ show: false, id: null, isNew: false, mutate: 1 });
    };

    useEffect(() => {
        setImageList(list);
    }, [list]);

    useEffect(() => {
        onChangeHandler({ target: { value: imageList, name: name } });
    }, [imageList]);

    const acceptedFormats = (allowedFileTypes ?? allow_format ?? [])?.map((item, i) => item?.mime_type);

    return (
        <Grid container spacing={1} direction="row" sx={{ width: "100%", margin: "2rem 0 0 0" }}>
            <MultipleImages
                description={description}
                handleMultipleImageUpload={handleUpload}
                handleDrag={handleDrag}
                handleDrop={handleUpload}
                dragActive={dragActive}
                accept={acceptedFormats ?? accept}
            />

            <ImageListRow setImageList={setImageList} imageList={imageList} handleModalOpen={handleModalOpen} handleDeleteImage={handleDeleteImage} handleReorder={handleReorder} />

            <ImageDialogFullPage
                openFullPageDialog={openFullPageDialog}
                setOpenFullPageDialog={setOpenFullPageDialog}
                setImageList={(images) => {
                    setImageList(images);
                    handleCloseImageDialog();
                }}
                apiPathCrop={apiPathCrop}
                imageList={imageList}
                handleCloseImageDialog={handleCloseImageDialog}
                onImageUpload={formImageUpload}
                handleDeleteImage={handleDeleteImage}
                uploadHandler={uploadHandler}
            />

            <DeleteDialog
                title="Brisanje"
                description="Da li ste sigurni da želite da obrišete?"
                openDeleteDialog={openDeleteDialog}
                setOpenDeleteDialog={setOpenDeleteDialog}
                handleConfirm={handleConfirm}
                handleCancel={handleCancel}
            />
        </Grid>
    );
};

export default InputMultipleImagesOne;
