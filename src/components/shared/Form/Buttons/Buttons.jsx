import { Box } from "@mui/material"
import scss from "./Buttons.module.scss"

/**
 * Show a list of buttons and the end of the form.
 *
 * @param {JSX.Element[]} children The buttons to render.
 *
 * @return {JSX.Element}
 * @constructor
 */
const Buttons = ({ children, styleWrapperButtons, className }) => {

  const combinedStyles = `${scss.wrapper} ${className}`;
  return (
    <Box className={combinedStyles} sx={styleWrapperButtons} >
      {children}
    </Box>
  )
}

export default Buttons
