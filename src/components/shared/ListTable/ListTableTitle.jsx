import React from "react";

import AddIcon from "@mui/icons-material/Add";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";

import styles from "./ListTableTitle.module.scss";

const ListTableTitle = ({
  title = "",
  showButton = false,
  handleCreateNew = () => { },
  additionalButtons = [],
}) => {
  return (
    <Box>
      <Typography variant="h5" component="div" className={styles.titleStyle}>
        {title}
      </Typography>

      {showButton && (
        <Button onClick={handleCreateNew} className={styles.buttonCreate}>
          <AddIcon className={styles.AddIcon} />
          Kreiraj novi
        </Button>
      )}
      {additionalButtons.map((button) => {
        return (
          <Button
            key={button.id}
            onClick={button.action}
            className={`${styles.buttonAdditional} ${button.className}`}
          >
            {button.icon}
            {button.text}
          </Button>
        );
      })}
    </Box>
  );
};

export default ListTableTitle;
