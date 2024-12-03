import { useCallback, useEffect, useState } from "react";

import Grid from "@mui/material/Grid";

import ImageListRow from "../MultipleImages/ImageListRow/ImageListRow";
import MultipleImages from "../MultipleImages/MultipleImages";
import FileDialog from "../Dialogs/FileDialog/FileDialog";
import DeleteDialog from "../Dialogs/DeleteDialog";
import IconList from "../../../helpers/icons";

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

export const InputMultipleFiles = ({
    list = [],
    onChangeHandler = () => {},
    accept = "",
    name = "",
    uploadHandler = () => {},
    saveDataHandler = () => {},
    deleteHandler = () => {},
    handleReorder,
    dialogFormFields = [],
    dialogGetPath,
    description,
    validate = null,
}) => {
    const [imageList, setImageList] = useState(list);
    const [dragActive, setDragActive] = useState(false);

    const [openDeleteDialog, setOpenDeleteDialog] = useState({
        show: false,
        id: null,
        mutate: null,
    });

    const init = {
        show: false,
        item: null,
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
                await uploadHandler(obj);
                newImagesArray.push(obj);
            }
            if (Array.isArray(imageList)) {
                newImagesArray = [...imageList, ...newImagesArray];
            }

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
                    } else {
                        setImageList(newImagesArray);
                    }
                } else {
                }
            } else {
                setImageList(newImagesArray);
            }
        }
    };

    //MODAL OPEN HANDLER
    const handleModalOpen = (e, item) => {
        setOpenFullPageDialog({
            show: true,
            item: item,
            image: item?.src,
            alt: item?.alt,
            name: item?.name,
            src: item?.thumb_image,
            size: item?.size,
            type: item?.type,
            path: item?.path,
            position: item?.position,
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
            show: true,
            item: { ...imageItem, file_base64: result },
        });
    };

    const handleDeleteImage = (e, deleteImgId, isNew) => {
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
        <Grid container spacing={1} direction="row" sx={{ width: "auto", margin: "2rem 0 0 0" }}>
            <MultipleImages
                handleMultipleImageUpload={handleUpload}
                handleDrag={handleDrag}
                handleDrop={handleUpload}
                dragActive={dragActive}
                accept={accept}
                icon={IconList.uploadFile}
                description={description}
            />

            <ImageListRow setImageList={setImageList} imageList={imageList} handleModalOpen={handleModalOpen} handleDeleteImage={handleDeleteImage} handleReorder={handleReorder} />

            <FileDialog
                openFullPageDialog={openFullPageDialog}
                setOpenFullPageDialog={setOpenFullPageDialog}
                handleCloseImageDialog={handleCloseImageDialog}
                onImageUpload={formImageUpload}
                handleDeleteImage={handleDeleteImage}
                saveHandler={saveDataHandler}
                formFields={dialogFormFields}
                getPath={dialogGetPath}
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

export default InputMultipleFiles;
