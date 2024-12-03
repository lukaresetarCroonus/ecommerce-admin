import React from "react";
import { useNavigate } from "react-router-dom";

import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

import Button from "../../Button/Button";
import scss from "./PageTitle.module.scss";

const PageTitle = ({ title, back, actions = [] }) => {
    const navigate = useNavigate();

    // If `back` is set to true, back button will navigate back
    if (back === true) {
        back = () => navigate(-1);
    }

    return (
        <Box className={scss.wrapper}>
            {/* Buttons */}
            <Box className={scss.buttons}>
                {actions.map((button, index) => {
                    return (
                        <Button
                            key={index}
                            disabled={button.disabled}
                            icon={button.icon}
                            label={button.label}
                            onClick={button.action}
                            variant={button.variant}
                            // sx={{
                            //   ...(button.label !== "Novi unos" && {
                            //     backgroundColor: "#17a2b9",
                            //     borderColor: "#17a2b9",
                            //     color: "#fff",
                            //     "&:hover": {
                            //       backgroundColor: "#17a2b9de",
                            //       borderColor: "#17a2b9de",
                            //     },
                            //   }),
                            // }}
                        />
                    );
                })}

                {/* Optional back button */}
                {back && (
                    <Button
                        icon={"arrow_back"}
                        label="Nazad"
                        onClick={back}
                        sx={{
                            "@media print": {
                                display: "none",
                            },
                        }}
                    />
                )}
            </Box>

            {/* The title */}
            <Typography variant="h5" component="div" scss={scss.title}>
                {title}
            </Typography>
        </Box>
    );
};

export default PageTitle;
