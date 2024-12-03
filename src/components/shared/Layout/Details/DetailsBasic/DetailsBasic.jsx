import React from "react";

import ListTableTitle from "../../../ListTable/ListTableTitle";

import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import UTurnLeftIcon from "@mui/icons-material/UTurnLeft";

import styles from "./DetailsBasic.module.scss";

const DetailsBasic = ({
  list,
  handleBackToList,
  title,
  main,
  children,
}) => {

  return (
    <Paper elevation={0} className={styles.paperStyle}>

      {/* Show the title above*/}
      {title && <ListTableTitle title={title} />}

      <Box display="grid" gridTemplateColumns="repeat(12, 1fr)" gap={2}>

        {/* Left aside content */}
        <Box gridColumn="span 3" className={styles.list + " settings-list"}>
          {list}
        </Box>

        <Box gridColumn="span 9">

          {/* Show the back button*/}
          {handleBackToList && (
            <Button onClick={handleBackToList} className={styles.buttonBack}>
              <i><UTurnLeftIcon /></i>
              Nazad
            </Button>
          )}

          {/* The main content */}
          <Box className={styles.main}>{main ?? children}</Box>
        </Box>
      </Box>
    </Paper>
  );
};

export default DetailsBasic;
