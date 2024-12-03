import React from "react";
import { Switch } from "@mui/material";
import { styled } from "@mui/system";

const SystemSwitch = styled(Switch)(({ theme }) => ({
    width: 100,
    height: 44,
    padding: 7,
    "& .MuiSwitch-switchBase": {
        margin: 2,
        padding: 0,
        transform: "translateX(0px)",
        "&.Mui-checked": {
            transform: "translateX(56px)",
            "& .MuiSwitch-thumb:before": {
                content: "'B2B'",
            },
            "& + .MuiSwitch-track": {
                opacity: 1,
                backgroundColor: theme.palette.mode === "dark" ? "#2ECA45" : "#65C466",
            },
        },
    },
    "& .MuiSwitch-thumb": {
        backgroundColor: theme.palette.common.white,
        width: 40,
        height: 40,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",

        "&:before": {
            content: "'B2C'",
            fontSize: 12,
            color: theme.palette.common.black,
        },
    },
    "& .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#8796A5" : "#aab4be",
        borderRadius: 22,
    },
}));

export default SystemSwitch;
