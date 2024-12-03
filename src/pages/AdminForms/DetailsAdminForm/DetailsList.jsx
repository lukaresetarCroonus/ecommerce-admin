import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Icon from "@mui/material/Icon";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import fields from "./DetailsListFields.json";

import styles from "./DetailsList.module.scss";

const DetailsList = ({
  handleSelectInDetails = () => { },
  detailsList = [],
  selected = "",
  isLoadingList,
  isErrorList = false,
}) => {
  const { submodules, name, module } = detailsList;

  const handleSelect = (slug) => {
    handleSelectInDetails(module, slug);
  };

  // NOTE: Icons are dynamic aligned with material ui icons and google icons just a string.
  // More info can be find on link
  // https://fontawesomeicons.com/materialdesign/icons
  return (
    <>
      <List
        subheader={
          <Typography
            variant="h5"
            component="div"
            sx={{ margin: "1rem" }}
            className={styles.title}
          >
            {name}
          </Typography>
        }
      >
        {!isLoadingList ? (
          <>
            {fields.map(
              ({ prop_name, field_name, disabled, ui_prop }, index) => (
                <ListItem
                  key={prop_name}
                  disablePadding
                  selected={selected === prop_name ? true : false}
                  onClick={() => handleSelect(submodules[index]?.slug)}
                  disabled={disabled}
                >
                  <ListItemButton>
                    <ListItemIcon>
                      <Icon>{ui_prop}</Icon>
                    </ListItemIcon>
                    <ListItemText primary={field_name} />
                    <ChevronRightIcon />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </>
        ) : (
          <Stack spacing={1}>
            <Skeleton variant="text" height={50} />
            <Skeleton variant="text" height={50} />
            <Skeleton variant="text" height={50} />
            <Skeleton variant="text" height={50} />
          </Stack>
        )}
      </List>
      {isErrorList && (
        <Stack sx={{ width: "100%" }}>
          <Alert severity="error">
            Doslo je do greske. Molim Vas pokusajte kasnije.
          </Alert>
        </Stack>
      )}
    </>
  );
};

export default DetailsList;
