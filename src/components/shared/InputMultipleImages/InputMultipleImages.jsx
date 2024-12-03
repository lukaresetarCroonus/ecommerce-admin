import { useCallback, useEffect, useState, useContext } from "react";

import Grid from "@mui/material/Grid";

import ImageDialogFullPage from "../MultipleImages/ImageDialogFullPage/ImageDialogFullPage";
import ImageListRow from "../MultipleImages/ImageListRow/ImageListRow";
import MultipleImages from "../MultipleImages/MultipleImages";
import DeleteDialog from "../Dialogs/DeleteDialog";
import { toast } from "react-toastify";
import AuthContext from "../../../store/auth-contex";

const getLoadedFile = (file, i, len) => {
    return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
            let ret = {
                id: i + 1 + len,
                name: file.name,
                position: i + 1 + len,
                alt: file.alt,
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

export const InputMultipleImages = ({
    list = [],
    onChangeHandler = () => {},
    accept = "image/*",
    name = "",
    uploadHandler = null,
    deleteHandler = () => {},
    handleChange = () => {},
    handleReorder,
    description,
    validate = null,
    apiPathCrop,
    isArray = false,
}) => {
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
            for (let i = 0; i < selectedFiles.length; i++) {
                var file = selectedFiles[i];

                const obj = await getLoadedFile(file, i, len);

                if (validate !== undefined && validate !== null) {
                    const { size, type } = obj;
                    const { imageUpload } = validate;
                    const { allow_size, allow_format } = imageUpload;

                    let allowedFormatMime = allow_format?.map((item, i) => {
                        return item?.mime_type;
                    });

                    const convertToMB = (bytes) => {
                        return bytes / (1024 * 1024);
                    };

                    if (allowedFormatMime.includes(type)) {
                        if (size > allow_size) {
                            toast.error(`Slika je prevelika (${obj.name}). Maksimalna dozvoljena veličina je ${convertToMB(allow_size)}MB.`);
                        } else {
                            if (typeof uploadHandler === "function") {
                                await uploadHandler(obj);
                            }
                            newImagesArray.push(obj);
                        }
                    } else {
                        toast.error(`Nedozvoljen format slike.`);
                    }
                } else {
                    if (typeof uploadHandler === "function") {
                        let resp = await uploadHandler(obj);
                        if (resp) {
                            newImagesArray.push(obj);
                        }
                    } else {
                        newImagesArray.push(obj);
                    }
                }
            }
            if (Array.isArray(imageList)) {
                newImagesArray = [...imageList, ...newImagesArray];
            }
            setImageList(newImagesArray);
        }
    };

    //MODAL OPEN HANDLER
    const handleModalOpen = (e, src, alt, name, size, type, id, position, path, dimensions, id_product) => {
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
            id_product: id_product,
        });
    };

    //CLOSE MODAL
    const handleCloseImageDialog = (data) => {
        setOpenFullPageDialog(init);
    };

    const handleSaveImageDialog = (data) => {
            const dataForServer = {
                id: data?.id,
                id_product: data?.id_product,
                title: data?.name,
                subtitle: null,
                short_description: data?.short_description,
                description: data?.description,
                alt: data?.alt,
                file_base64: data?.image,
                order: data?.position,
            };
            api.post(`/admin/product-items/gallery`, dataForServer)
                .then((response) => {
                    toast.success("Uspešno");
                    setOpenFullPageDialog(init);
                    handleChange();
                })
                .catch((error) => {
                    toast.warn("Greška");
                    console.warn(error);
                });

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
            alt: selectedFile.alt,
            size: selectedFile.size,
            type: selectedFile.type,
            name: selectedFile.name,
            path: selectedFile.path,
            src: result,
        };

        if (typeof uploadHandler === "function") {
            uploadHandler(imageItem);
        }

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
            alt: selectedFile.alt,
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

    return (
        <Grid container spacing={1} direction="row" sx={{ width: "100%", margin: "2rem 0 0 0" }}>
            <MultipleImages
                description={description}
                handleMultipleImageUpload={handleUpload}
                handleDrag={handleDrag}
                handleDrop={handleUpload}
                dragActive={dragActive}
                accept={isArray ? accept?.map((item) => item?.mime_type) : accept?.allow_format}
            />

            <ImageListRow setImageList={setImageList} imageList={imageList} handleModalOpen={handleModalOpen} handleDeleteImage={handleDeleteImage} handleReorder={handleReorder} />

            <ImageDialogFullPage
                openFullPageDialog={openFullPageDialog}
                setOpenFullPageDialog={setOpenFullPageDialog}
                setImageList={setImageList}
                imageList={imageList}
                handleSaveImageDialog={(data) => {
                    handleSaveImageDialog(data);
                }}
                handleCloseImageDialog={handleCloseImageDialog}
                onImageUpload={formImageUpload}
                handleDeleteImage={handleDeleteImage}
                uploadHandler={uploadHandler ? uploadHandler : () => null}
                apiPathCrop={apiPathCrop}
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

export default InputMultipleImages;
