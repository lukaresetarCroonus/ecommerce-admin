import React from "react";
import "../../../variables.scss";

import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import TextField from "@mui/material/TextField";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";

const TextBoxSingle = ({
  name = "",
  label = "",
  value = "",
  description = "",
  required = false,
  width = "100%",
  margin = "0",
  placeholder = "",
  size = "small",
  fontWeight = "normal",
  fontSize = "0.875rem",
  error = "",
  saveIcon = "check_circle",
  cancelIcon = "cancel",
  styleFormControl,
  onChange = () => { },
  onSaveClick = () => { },
  onCancelClick = () => { },
}) => {
  // reusable component for individual input fields that have actions save and cancel
  return (
    <FormControl
      sx={{
        width: width,
        margin: margin,
        ...styleFormControl
      }}
    >
      <FormLabel
        required={required}
        sx={{
          fontWeight: fontWeight,
          fontSize: fontSize,
        }}
      >
        {label}
      </FormLabel>
      <div style={{ display: "flex", alignItems: "flex-end" }}>
        <TextField
          name={name}
          size={size}
          value={value ? value : ""}
          error={!!error}
          placeholder={placeholder}
          onChange={onChange}
          sx={{
            "& legend": { display: "none" },
            "& fieldset": { top: 0 },
            ".MuiInputBase-input": { fontSize: "0.875rem" },
          }}
          helperText={error?.content ? error.content : description}

        />
        <IconButton onClick={onSaveClick} aria-label="plus" style={{ color: "#28a86e", padding: "4px" }}>
          {/* <AddCircleOutlineIcon fontSize="inherit" /> */}
          <Icon>{saveIcon}</Icon>
        </IconButton>
        <IconButton onClick={onCancelClick} aria-label="minus" style={{ color: "#d32f2f", padding: "4px" }}>
          <Icon>{cancelIcon}</Icon>
        </IconButton>
      </div>
    </FormControl>
  );
};

export default TextBoxSingle;
