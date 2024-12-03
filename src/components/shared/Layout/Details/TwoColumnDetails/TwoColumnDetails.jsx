import React from "react";

import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import CheckIcon from "@mui/icons-material/Check";

import styles from "./TwoColumnDetails.module.scss";

const TwoColumnDetails = ({
  middle = <div />,
  right = <div />,
  onSubmit = () => { },
  buttonText = "",
  hasButton = true,
  ...props
}) => {
  return (
    <Box sx={{ flexGrow: 1 }} className={props.className}>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={6}>
          {middle}
        </Grid>
        <Grid item xs={5}>
          {right}
        </Grid>
      </Grid>
      {hasButton && (
        <Button
          className={styles.saveButton}
          variant="contained"
          endIcon={<CheckIcon />}
          onClick={onSubmit}
        >
          {buttonText}
        </Button>
      )}
    </Box>
  );
};

export default TwoColumnDetails;
