import Paper from "@mui/material/Paper";
import { Table as MaterialTable } from "@mui/material";
import TableContainer from "@mui/material/TableContainer";

import scss from "./Table.module.scss";

/**
 * A universal table.
 *
 * @return {JSX.Element}
 * @constructor
 */
const Table = ({ children, styleTable }) => (
  <TableContainer component={Paper} className={scss.table} sx={styleTable}>
    <MaterialTable>{children}</MaterialTable>
  </TableContainer>
)

export default Table
