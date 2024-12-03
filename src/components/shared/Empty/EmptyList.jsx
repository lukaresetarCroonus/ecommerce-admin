import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import styles from "./EmptyList.module.scss"

const EmptyList = ({ span = 1, message = "Nema podataka za prikaz" }) => {
  return (
    <TableRow>
      <TableCell colSpan={span} className={styles.empty}>
        {message}
      </TableCell>
    </TableRow>
  )
}

export default EmptyList
