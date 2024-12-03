import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { v4 } from "uuid";

const SearchTermsLatest = ({ sTermsLatest }) => {
  return (
    <TableContainer>
      <Table className="dashboardTable">
        <TableHead>
          <TableRow>
            <TableCell>Pretrage</TableCell>
            <TableCell>Kupci</TableCell>
            <TableCell>Rezultat</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sTermsLatest?.map((row) => (
            <TableRow key={v4()} sx={{ "&:nth-of-type(odd)": { backgroundColor: "var(--main-bg-color)" }, border: 0 }}>
              <TableCell>{row.terms}</TableCell>
              <TableCell>{row.user_count}</TableCell>
              <TableCell>{row.result_count}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default SearchTermsLatest