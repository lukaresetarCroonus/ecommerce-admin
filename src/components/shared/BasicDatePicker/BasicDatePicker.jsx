import React from "react";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

import styles from "./BasicDatePicker.module.scss";

const BasicDatePicker = ({ value = new Date(), label = "", name = "", onChangeHandler = () => {} }) => {
    const handleChange = (newValue) => {
        const ev = {
            target: {
                name: name,
                value: newValue,
            },
        };
        onChangeHandler(ev, "date");
    };
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DatePicker label={label} value={value} onChange={handleChange} inputFormat="dd/MM/yyyy" renderInput={(params) => <TextField {...params} className={styles.datePickerStyle} />} />
        </LocalizationProvider>
    );
};

export default BasicDatePicker;
