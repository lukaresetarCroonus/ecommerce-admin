import Skeleton from "@mui/material/Skeleton";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";

/**
 * Show loading table rows.
 *
 * @param {columns} columns The number of columns to show.
 * @param {number} rows The number of rows to show.
 * @param {number} height The height of the skeleton, in pixels.
 *
 * @return {JSX.Element}
 * @constructor
 */

const LoadingTableRows = ({ columns, rows = 30, height = 22 }) => (
  <>
    {Array(+rows).fill(null).map((val, key) => (
      <TableRow key={key}>
        {Array(+columns).fill(null).map((val, key) => (
          <TableCell key={key}>
            <Skeleton variant="text" height={height} key={key} />
          </TableCell>
        ))}
      </TableRow>
    ))}
  </>
)

export default LoadingTableRows
