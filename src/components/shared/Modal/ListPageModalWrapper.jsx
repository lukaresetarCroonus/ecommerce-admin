

import React from 'react';

import Drawer from "@mui/material/Drawer";
import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";

const ListPageModalWrapper = ({ children, anchor, open, sx, variant, onClose, onCloseButtonClick, styleBox }) => {
  return (
    <Drawer anchor={anchor} open={open} onClose={onClose} sx={sx} variant={variant} >
      <IconButton sx={{ display: "flex", alignItems: "flex-start", width: "fit-content", position: "fixed", right: "calc(50rem + 2rem)", top: "1rem", color: "var(--bg-color)" }} onClick={onCloseButtonClick}>
        <Icon>close</Icon>
      </IconButton>
      <Box width="50rem" height="100%" sx={styleBox}>
        {children}
      </Box>
    </Drawer>
  )
}

export default ListPageModalWrapper
