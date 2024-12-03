import React, { useEffect, useState } from "react";

import Box from "@mui/material/Box";
import ButtonBase from "@mui/material/ButtonBase";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Input from "@mui/material/Input";
import CircularProgress from "@mui/material/CircularProgress";
import Avatar from "@mui/material/Avatar";
import Chip from "@mui/material/Chip";
import DriveFolderUploadRoundedIcon from "@mui/icons-material/DriveFolderUploadRounded";
import ImageOutlinedIcon from "@mui/icons-material/ImageOutlined";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import { blue } from "@mui/material/colors";

import styles from "./FileButton.module.scss";

import { getImageRatio } from "../../../helpers/imageSize";

const FileButton = ({ name = "", label = "", required = false, description = "", value = "", error = "", onImageUpload = () => {}, onOpenImageDialog = () => {} }) => {
    const [imageDimensions, setImageDimensions] = useState({
        width: 0,
        height: 0,
    });
    const [loadingImage, setLoadingImage] = useState(false);
    const [loaded, setLoaded] = useState(false);

    const buttonSx = {
        color: "white",
        ...(value && {
            bgcolor: blue[100],
        }),
    };

    useEffect(() => {
        if (loaded) {
            const loadImage = async (url) => {
                const imageRatio = await getImageRatio(url);
                if (imageRatio) {
                    setImageDimensions({
                        width: imageRatio.width,
                        height: imageRatio.height,
                    });
                }
            };
            loadImage(value);
        }
    }, [value]);

    useEffect(() => {
        setLoaded(true);
    }, []);
    return (
        <>
            {value ? (
                <Box sx={{ flexGrow: 1 }}>
                    <Grid container spacing={2} alignItems="center" margin={0} padding={0}>
                        <FormControl className={styles.formStyle}>
                            <FormLabel required={required}>{label}</FormLabel>
                            <ButtonBase focusRipple className={styles.imageButtonStyled} onClick={() => onOpenImageDialog(value, label, name)}>
                                <span
                                    style={{
                                        backgroundImage: `url(${value})`,
                                        position: "absolute",
                                        left: 0,
                                        right: 0,
                                        top: 0,
                                        bottom: 0,
                                        backgroundSize: imageDimensions.width > 200 ? "cover" : "contain",
                                        backgroundRepeat: "no-repeat",
                                        backgroundPosition: "center 40%",
                                    }}
                                />

                                <span className={styles.imageBackdrop} />
                                <span className={styles.imageWrap}>
                                    <span>
                                        <Typography
                                            className={styles.typographyStyle}
                                            component="span"
                                            variant="subtitle1"
                                            color="inherit"
                                            sx={{
                                                position: "relative",
                                                p: 4,
                                                pt: 2,
                                                pb: 1,
                                            }}
                                        >
                                            {label}
                                            <span className={styles.imageMarked} />
                                        </Typography>
                                    </span>
                                </span>
                            </ButtonBase>
                        </FormControl>
                    </Grid>
                </Box>
            ) : (
                <Box>
                    <Grid
                        container
                        spacing={2}
                        alignItems="center"
                        margin={0}
                        sx={{
                            "&>.MuiGrid-item": { padding: 0 },
                        }}
                    >
                        <Grid item xs={8} md={8} margin={0} padding={0} sx={{ padding: 0 }}>
                            <FormControl error={error !== null}>
                                <FormLabel required={required}>{label}</FormLabel>
                                <Typography variant="caption" display="block" gutterBottom>
                                    <br />
                                    {description}
                                </Typography>
                                <label htmlFor={label}>
                                    <Input
                                        multiple
                                        name={name}
                                        inputProps={{ accept: ".xlsx,.xls,.doc, .docx,.ppt, .pptx,.txt,.pdf" }}
                                        id={label}
                                        onChange={(e) => onImageUpload(e)}
                                        type="file"
                                        sx={{ display: "none" }}
                                    />
                                    <Button variant="contained" component="span" className={styles.buttonStyle}>
                                        <Box className={styles.boxStyle}>
                                            <Typography variant="caption" display="block" gutterBottom />
                                            <ImageOutlinedIcon className={styles.imageOutlinedIcon} />
                                        </Box>
                                        <Box className={styles.avatarBoxStyle}>
                                            <Box className={styles.avatarStyle}>
                                                <Avatar sx={buttonSx}>
                                                    <DriveFolderUploadRoundedIcon />
                                                </Avatar>
                                                {loadingImage && <CircularProgress className={styles.loadingImage} size={50} />}
                                            </Box>
                                            <Box sx={{ m: 1, position: "relative" }}>
                                                <Chip label={label} sx={buttonSx} />
                                            </Box>
                                        </Box>
                                    </Button>
                                </label>
                                <FormHelperText>Maximum file size: 2MB, Allowed types: JPG, GIF, PNG, ICO, APNG, Not all browsers support these formats</FormHelperText>
                            </FormControl>
                        </Grid>
                    </Grid>
                    <Grid item xs={4} md={4} margin={0} padding={0}>
                        <Box>
                            {error && (
                                <Stack sx={{ width: "100%" }}>
                                    <Alert severity="error">{error}</Alert>
                                </Stack>
                            )}
                        </Box>
                    </Grid>
                </Box>
            )}
        </>
    );
};

export default FileButton;
