import React, { useState } from "react";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Input from "@mui/material/Input";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import CircularProgress from "@mui/material/CircularProgress";
import { blue } from "@mui/material/colors";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import Tooltip from "@mui/material/Tooltip";
import CheckIcon from "@mui/icons-material/Check";
import DriveFolderUploadRoundedIcon from "@mui/icons-material/DriveFolderUploadRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import AddPhotoAlternateOutlinedIcon from "@mui/icons-material/AddPhotoAlternateOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import styles from "./ImageUpload.module.scss";

const ImageUpload = ({ name = "", label = "", required = false, description = "", value = "", error = "", onImageUpload = () => {}, onImagePreview = () => {} }) => {
    const [loadingImage, setLoadingImage] = useState(false);

    // Just on of the ways to implement css it doesnt have to be here it could be moved to module scss file
    const buttonSx = {
        color: "white",
        ...(value && {
            bgcolor: blue[100],
        }),
    };

    const handleImageUpload = (e) => {
        setLoadingImage(true);
        onImageUpload(e);
        const timeOutId = setTimeout(() => {
            setLoadingImage(false);
        }, 1000);
        return () => clearTimeout(timeOutId);
    };

    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <Grid container spacing={2} alignItems="center">
                    <Grid item xs={8} md={8}>
                        <FormControl className={styles.formStyle}>
                            <FormLabel required={required}>{label}</FormLabel>
                            <Typography variant="caption" display="block" gutterBottom>
                                <br />
                                {description}
                            </Typography>
                            <label htmlFor={label}>
                                <Input multiple name={name} accept="image/*" id={label} onChange={(e) => handleImageUpload(e)} type="file" sx={{ display: "none" }} />
                                <Button variant="contained" component="span" className={styles.buttonStyle}>
                                    <Box className={styles.boxStyle}>
                                        <Typography variant="caption" display="block" gutterBottom />
                                        {!value ? <AddPhotoAlternateOutlinedIcon className={styles.addPhotoAlternateOutlinedIcon} /> : <ImageOutlinedIcon className={styles.imageOutlinedIcon} />}
                                    </Box>
                                    <Box className={styles.avatarBoxStyle}>
                                        <Box className={styles.avatarStyle}>
                                            <Avatar sx={buttonSx}>{value ? <CheckIcon /> : <DriveFolderUploadRoundedIcon />}</Avatar>
                                            {loadingImage && <CircularProgress className={styles.loadingImage} size={50} />}
                                        </Box>
                                        <Box sx={{ m: 1, position: "relative" }}>
                                            <Chip label={label} sx={buttonSx} />
                                        </Box>
                                    </Box>
                                </Button>
                            </label>
                            <FormHelperText>Maximum file size: 2MB, Allowed types: JBG, GIF, PNG, ICO, APNG, Not all browsers support these formats</FormHelperText>
                        </FormControl>
                    </Grid>
                    <Grid item xs={4} md={4}>
                        <Box>
                            {value && (
                                <Tooltip title="Klikni da pogledas sliku" className={styles.successAvatar}>
                                    <Fab variant="extended" onClick={() => onImagePreview(value, label)}>
                                        <VisibilityOutlinedIcon className={styles.visibilityOutlinedIcon} />
                                    </Fab>
                                </Tooltip>
                            )}
                            {error && (
                                <Stack sx={{ width: "100%" }}>
                                    <Alert severity="error">{error}</Alert>
                                </Stack>
                            )}
                        </Box>
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};

export default ImageUpload;
