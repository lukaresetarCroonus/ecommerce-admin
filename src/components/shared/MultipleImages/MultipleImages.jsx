import React from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";

import IconList from "../../../helpers/icons";

import styles from "./MultipleImages.module.scss";
import { Divider } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const MultipleImages = ({
    description,
    handleMultipleImageUpload = async () => {},
    handleDrag = () => {},
    handleDrop = () => {},
    accept = "image/*",
    dragActive = false,
    icon = IconList.addAPhoto,
}) => {
    const inputRef = React.useRef(null);

    const handleInputChange = async (e) => {
        await handleMultipleImageUpload(e);
        if (inputRef.current) {
            inputRef.current.value = "";
        }
    };

    return (
        <>
            <Box className={styles.formUpload} onDragEnter={handleDrag}>
                <input type="file" className={styles.inputUpload} multiple={true} />
                <label className={!dragActive ? styles.labelUpload : styles.labelUploadActive} htmlFor="input-file-upload">
                    <Box sx={{ width: "80%", padding: "1.5rem 0" }}>
                        <CloudUploadIcon sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.8rem" }} />
                        <Typography variant="subtitle1" sx={{ fontSize: "0.875rem" }}>
                            Prevuci dokument
                        </Typography>
                        <Divider className={styles.divider}>ili</Divider>
                        <Button variant="outlined" component="label" className={styles.buttonStyle}>
                            <input hidden ref={inputRef} accept={accept} multiple type="file" onChange={handleInputChange} />
                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                <Icon className={styles.addAPhotoIcon}>{icon}</Icon>
                                <Typography variant="subtitle1" className={styles.label}>
                                    <span style={{ textTransform: "capitalize" }}>O</span>daberi dokument
                                </Typography>
                            </Box>
                        </Button>
                    </Box>
                </label>

                {dragActive && <div className={styles.dragPseudoElement} onDragEnter={handleDrag} onDragLeave={handleDrag} onDragOver={handleDrag} onDrop={handleDrop} />}
            </Box>
            <Typography variant="body2" sx={{ margin: "0.188rem 0.875rem 0 0.875rem", lineHeight: "1.66", textAlign: "left", fontSize: "0.75rem", color: "rgba(0,0,0,0.6)" }}>
                {description}
            </Typography>
        </>
    );
};

export default MultipleImages;
