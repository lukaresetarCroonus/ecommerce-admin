import React, { useState, useEffect, useContext } from "react";

import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import { DocumentScanner } from "@mui/icons-material";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import Input from "@mui/material/Input";
import CircularProgress from "@mui/material/CircularProgress";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import CheckIcon from "@mui/icons-material/Check";

import styles from "./FileDialog.module.scss";
import Form from "../../Form/Form";
import AuthContext from "../../../../store/auth-contex";

const FileDialog = ({ openFullPageDialog, title = "", onImageUpload = () => {}, handleCloseImageDialog = () => {}, handleDeleteImage = () => {}, saveHandler = () => {}, formFields, getPath }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [loadingImage, setLoadingImage] = useState(false);
    const [data, setData] = useState({});
    const [formData, setFormData] = useState({});

    const handleImageUpload = (e) => {
        setLoadingImage(true);
        onImageUpload(e);
        const timeOutId = setTimeout(() => {
            setLoadingImage(false);
        }, 1000);
        return () => clearTimeout(timeOutId);
    };

    const handleChangeData = (formData) => {
        setData(formData);
    };

    const handleData = () => {
        api.get(`${getPath}/${openFullPageDialog.item.id}`)
            .then((response) => setFormData(response?.payload))
            .catch((error) => console.warn(error));
    };

    useEffect(() => {
        if (openFullPageDialog.show) {
            handleData();
        }
    }, [openFullPageDialog]);

    const handleSave = () => {
        saveHandler(data);
        handleCloseImageDialog();
    };

    return (
        <Dialog open={openFullPageDialog.show} fullScreen aria-labelledby="delete-dialog-title" aria-describedby="delete-dialog-description">
            <AppBar sx={{ position: "relative" }}>
                <Toolbar>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
                        {openFullPageDialog.item?.name}
                    </Typography>
                </Toolbar>
            </AppBar>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Box>
                    {loadingImage ? (
                        <div>
                            <CircularProgress size={50} sx={{ ml: "45%", mt: "15%" }} disableShrink />
                        </div>
                    ) : (
                        <Box sx={{ flexGrow: 1 }}>
                            <Grid container spacing={2}>
                                <Grid item xs={8}>
                                    <div className={styles.imageStyle}>
                                        {openFullPageDialog.item?.file_base64 && (
                                            <object width={"100%"} height={"100%"} data={openFullPageDialog.item?.file_base64} alt={openFullPageDialog.item?.name} />
                                        )}
                                    </div>
                                </Grid>
                                <Grid item xs={4}>
                                    <Form formFields={formFields} initialData={formData} onChange={handleChangeData} submitButton={false} />
                                </Grid>
                            </Grid>
                        </Box>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Stack direction="row" alignItems="center" spacing={2} className={styles.btnGroup}>
                    <Button variant="outlined" onClick={handleSave} color="success" startIcon={<CheckIcon />}>
                        Sačuvaj
                    </Button>
                    <Button variant="outlined" component="label" startIcon={<DocumentScanner />}>
                        Novi dokument
                        <Input
                            name="image"
                            inputProps={{ accept: ".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf" }}
                            id={openFullPageDialog.item?.name}
                            onChange={(e) => handleImageUpload(e)}
                            type="file"
                            sx={{ display: "none" }}
                        />
                    </Button>
                    <Button variant="outlined" color="error" onClick={(e) => handleDeleteImage(e, openFullPageDialog.item?.id)} startIcon={<DeleteOutlineOutlinedIcon />}>
                        Obrisi
                    </Button>
                    <Button variant="outlined" color="secondary" onClick={handleCloseImageDialog} startIcon={<CancelOutlinedIcon />}>
                        Otkaži
                    </Button>
                </Stack>
            </DialogActions>
        </Dialog>
    );
};

export default FileDialog;
