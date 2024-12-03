import React from "react";
import Icon from "@mui/material/Icon";


/**
 * Support for both MUI (as string)
 * @see https://mui.com/material-ui/material-icons/.
 *
 * @param {string|{}} icon String to load from MUI
 *
 * @return {JSX.Element}
 * @constructor
 */
const Unicon = ({ icon, styleIcon }) => (
  typeof icon !== "object" && <Icon sx={styleIcon}>{icon}</Icon>
)

export default Unicon
