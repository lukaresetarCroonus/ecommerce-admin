import React, { useCallback, useContext, useEffect, useState } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import PhotoCamera from "@mui/icons-material/PhotoCamera";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import ImageEditorComponent from "../ImageEditorComponent/ImageEditorComponent";
import Input from "@mui/material/Input";
import CircularProgress from "@mui/material/CircularProgress";

import styles from "./ImageDialog.module.scss";
import AuthContext from "../../../store/auth-contex";
import { getCroppedImg } from "../ImageEditorComponent/util";
import { useFileSize, useImageSize } from "../../../hooks/useFileSize";
import { toast } from "react-toastify";
import { useImageFileType } from "../../../hooks/useFileType";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { CopyToClipboard } from "react-copy-to-clipboard";
import Tooltip from "@mui/material/Tooltip";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import Grid from "@mui/material/Grid";

const ImageDialog = ({
    openImageDialog,
    title = "",
    onImageUpload = () => {},
    handleCloseImageDialog = () => {},
    handleSaveEditImage = () => {},
    handleDeleteImage = () => {},
    imageWidth,
    imageHeight,
    imageURL,
    imageName,
    apiPathCrop,
    base64Image,
    allowedFileTypes,
}) => {
    const authCtx = useContext(AuthContext);
    const [bttnText, setBttnText] = useState("Kopirajte link");
    const [editMode, setEditMode] = useState(false);
    const [loadingImage, setLoadingImage] = useState(false);
    const handleCloseEditMode = () => {
        setEditMode(false);
    };

    const handleOpenEditMode = () => {
        setEditMode(true);
    };

    const onDeleteImageClick = () => {
        handleDeleteImage(openImageDialog.name);
        handleCloseImageDialog();
    };

    const handleImageUpload = (e) => {
        setLoadingImage(true);
        onImageUpload(e, openImageDialog?.item?.validate?.imageUpload ?? openImageDialog?.item?.ui_prop?.fileUpload);
        const timeOutId = setTimeout(() => {
            setLoadingImage(false);
            handleCloseImageDialog();
        }, 1000);
        return () => clearTimeout(timeOutId);
    };
    const { fileType } = useImageFileType(openImageDialog?.image);
    return (
        <Dialog open={openImageDialog.show} fullScreen maxWidth={"xl"} aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                {editMode ? (
                    <Box
                        sx={{
                            width: 900,
                            height: 600,
                        }}
                    >
                        <ImageEditorComponent
                            handleCloseEditMode={handleCloseEditMode}
                            handleCloseImageDialog={handleCloseImageDialog}
                            imageURL={openImageDialog.image}
                            imageName={openImageDialog.name}
                            imageWidth={openImageDialog.width}
                            imageHeight={openImageDialog.height}
                            handleSaveEditImage={handleSaveEditImage}
                            showDimensions={openImageDialog.showDimensions}
                            apiPath={openImageDialog?.apiPathCrop ?? apiPathCrop}
                        />
                    </Box>
                ) : (
                    <Box>
                        {loadingImage ? (
                            <div>
                                <CircularProgress size={50} sx={{ ml: "45%" }} disableShrink />
                            </div>
                        ) : (
                            <div className={styles.imageHolder}>
                                <div className={styles.imageStyle}>
                                    {openImageDialog.image && (
                                        <>
                                            {fileType === "image" ? (
                                                <img
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "calc(100vh - 64px)",
                                                    }}
                                                    src={openImageDialog?.image}
                                                    alt={openImageDialog?.label}
                                                />
                                            ) : (
                                                <video
                                                    autoPlay={true}
                                                    muted={true}
                                                    loop={true}
                                                    style={{
                                                        maxWidth: "100%",
                                                        maxHeight: "calc(100vh - 64px)",
                                                    }}
                                                >
                                                    <source src={openImageDialog?.image} type="video/mp4" />
                                                </video>
                                            )}
                                        </>
                                    )}
                                </div>
                                <Grid item xs={4}>
                                    <form className={styles.formFieldsStyle}>
                                        <TextField fullWidth type="text" disabled label="Naziv slike" value={openImageDialog?.image_name} variant="outlined" />
                                        <TextField fullWidth type="text" disabled label="Alt slike" value={openImageDialog?.alt ?? openImageDialog?.image_name} variant="outlined" />
                                        <TextField fullWidth type="text" disabled label="Veličina slike" value={`${openImageDialog?.size?.toFixed(2)}MB`} variant="outlined" />
                                        <TextField fullWidth type="text" disabled label="Dimenzija slike (širina x visina)" value={`${openImageDialog?.width} x ${openImageDialog?.height} px`} variant="outlined" />
                                        <TextField fullWidth type="text" disabled label="Tip slike" value={openImageDialog?.image?.split(":")[1]?.split(";")[0] ?? "image"} variant="outlined" />
                                        <TextField
                                            fullWidth
                                            type="text"
                                            disabled
                                            label="Link slike"
                                            value={openImageDialog?.image_url}
                                            variant="outlined"
                                            InputProps={{
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton>
                                                            <CopyToClipboard
                                                                text={openImageDialog?.image_url}
                                                                onCopy={() => {
                                                                    setBttnText("Link je kopiran");
                                                                    setTimeout(() => {
                                                                        setBttnText("Kopirajte link");
                                                                    }, 3000);
                                                                }}
                                                            >
                                                                <Tooltip title={bttnText} placement="top" arrow>
                                                                    <ContentCopyIcon sx={{ color: "rgba(0, 0, 0, 0.38)" }} />
                                                                </Tooltip>
                                                            </CopyToClipboard>
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                        />
                                    </form>
                                </Grid>
                            </div>
                        )}
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                {editMode ? (
                    <div />
                ) : (
                    <Stack direction="row" alignItems="center" spacing={2} className={styles.btnGroup}>
                        {/* <input hidden accept="image/*" type="file" onImageUpload /> */}
                        <Button variant="outlined" component="label" startIcon={<PhotoCamera />}>
                            Nova slika
                            <Input
                                multiple
                                name={openImageDialog.name}
                                inputProps={{
                                    accept: allowedFileTypes
                                        ? allowedFileTypes
                                              .map(({ mime_type }) => mime_type)
                                              .flat()
                                              .join(", ")
                                        : "*",
                                }}
                                id={openImageDialog.label}
                                onChange={(e) => handleImageUpload(e)}
                                type="file"
                                sx={{ display: "none" }}
                            />
                        </Button>
                        {fileType !== "video" && (
                            <Button variant="outlined" onClick={handleOpenEditMode} color="success" startIcon={<EditOutlinedIcon />}>
                                Obradi sliku
                            </Button>
                        )}
                        <Button variant="outlined" color="error" onClick={onDeleteImageClick} startIcon={<DeleteOutlineOutlinedIcon />}>
                            Obrisi
                        </Button>
                        <Button variant="outlined" color="secondary" onClick={handleCloseImageDialog} startIcon={<CancelOutlinedIcon />}>
                            Otkaži
                        </Button>
                    </Stack>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ImageDialog;
