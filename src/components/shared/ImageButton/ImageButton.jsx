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
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Icon from "@mui/material/Icon";

import { getImageRatio } from "../../../helpers/imageSize";

import styles from "./ImageButton.module.scss";
import IconList from "../../../helpers/icons";
import { useImageFileType } from "../../../hooks/useFileType";

const ImageButton = ({
    name = "",
    label = "",
    required = false,
    description = "",
    value = "",
    error = "",
    imgWidth = 800,
    imgHeight = 600,
    onImageUpload = () => {},
    onOpenImageDialog = () => {},
    icon = IconList.cloudUpload,
    item,
    allowedFileTypes,
    setPropName = () => {},
}) => {
    const [imageDimensions, setImageDimensions] = useState({
        width: imgWidth ?? 0,
        height: imgHeight ?? 0,
    });
    const [loadingImage, setLoadingImage] = useState(false);
    const [loaded, setLoaded] = useState(false);
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

    const { fileType, sizeInMB } = useImageFileType(value);

    return (
        <>
            {value ? (
                <Box sx={{ flexGrow: 1, width: "100%" }}>
                    <Grid container spacing={2} alignItems="center" margin={0} padding={0} width="100%">
                        <FormControl className={styles.formStyle} fullWidth>
                            <FormLabel required={required}>{label}</FormLabel>
                            <FormLabel>{`Dimenzije: ${imgWidth} x ${imgHeight} px`}</FormLabel>
                            <ButtonBase
                                focusRipple
                                className={styles.imageButtonStyled}
                                onClick={() => {
                                    onOpenImageDialog(value, label, name, imgWidth, imgHeight, item, sizeInMB);
                                }}
                            >
                                {value && (
                                    <>
                                        {fileType === "image" ? (
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
                                        ) : (
                                            <video
                                                autoPlay={true}
                                                muted={true}
                                                loop={true}
                                                style={{
                                                    position: "absolute",
                                                    left: 0,
                                                    right: 0,
                                                    top: 0,
                                                    bottom: 0,
                                                    width: "100%",
                                                    height: "100%",
                                                    objectFit: "cover",
                                                }}
                                            >
                                                <source src={value} type="video/mp4" />
                                            </video>
                                        )}
                                    </>
                                )}

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
                            <FormHelperText>{description}</FormHelperText>
                        </FormControl>
                    </Grid>
                </Box>
            ) : (
                <Box sx={{ width: "100%", marginTop: "0.5rem", padding: "0 0.3rem" }}>
                    <Grid
                        container
                        alignItems="center"
                        margin={0}
                        sx={{
                            "&>.MuiGrid-item": { padding: 0, width: "100%" },
                        }}
                    >
                        <Grid item margin={0} padding={0} sx={{ padding: 0 }}>
                            <FormControl error={error !== null} sx={{ width: "100%" }}>
                                <FormLabel required={required}>{label}</FormLabel>
                                <FormLabel>{`Dimenzije: ${imgWidth} x ${imgHeight} px`}</FormLabel>
                                <label htmlFor={label}>
                                    <Input
                                        multiple
                                        name={name}
                                        inputProps={{
                                            accept: allowedFileTypes
                                                ? allowedFileTypes
                                                      .map(({ mime_type }) => mime_type)
                                                      .flat()
                                                      .join(", ")
                                                : "*",
                                        }}
                                        id={label}
                                        onChange={(e) => {
                                            onImageUpload(e);
                                            setPropName(name);
                                        }}
                                        type="file"
                                        sx={{ display: "none" }}
                                    />
                                    <Button variant="contained" component="span" className={styles.buttonStyle}>
                                        <Box className={styles.avatarBoxStyle}>
                                            <Box sx={{ display: "flex", alignItems: "center" }}>
                                                <Icon className={styles.avatarStyle}>{icon}</Icon>
                                                {loadingImage && <CircularProgress className={styles.loadingImage} size={50} />}
                                                <Typography variant="subtitle1" className={styles.label}>
                                                    {label}
                                                </Typography>
                                            </Box>
                                        </Box>
                                    </Button>
                                </label>
                                <FormHelperText>{description}</FormHelperText>
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

export default ImageButton;
