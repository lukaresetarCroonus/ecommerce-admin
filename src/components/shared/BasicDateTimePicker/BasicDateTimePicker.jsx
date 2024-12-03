import React from "react";

import TextField from "@mui/material/TextField";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";

import styles from "./BasicDateTimePicker.module.scss";

const BasicDateTimePicker = ({
  value = null,
  label = "",
  error = null,
  name = "",
  onChangeHandler = () => { },
}) => {
  const handleChange = (newValue) => {
    const ev = {
      target: {
        name: name,
        value: newValue,
      },
    };
    onChangeHandler(ev, "date_time");
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DateTimePicker
        label={label}
        value={value}
        onChange={handleChange}
        ampm={false}
        inputFormat="dd/MM/yyyy hh:mm"
        renderInput={(params) => (
          <TextField
            className={styles.dateTimePickerStyle}
            {...params}
          // inputProps={{ readOnly: true }}
          />
        )}
      />
    </LocalizationProvider>
  );
};

export default BasicDateTimePicker;
