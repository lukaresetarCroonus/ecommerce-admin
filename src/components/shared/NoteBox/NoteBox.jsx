import Box from "@mui/material/Box"
import scss from "./NoteBox.module.scss"

/**
 * Show a semi-important box.
 *
 * @param {string} message Optional message to show in a standardized form.
 * @param {JSX.Element[]} children The children to include in the box.
 *
 * @return {JSX.Element}
 * @constructor
 */
const NoteBox = ({ message, children }) => (

  <Box className={scss.wrapper}>
    {message && <p className={scss.message}>{message}</p>}
    {children}
  </Box>
)

export default NoteBox
