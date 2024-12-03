import Card from "../../../../components/shared/Card/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import HowToRegIcon from '@mui/icons-material/HowToReg';
import Tooltip from "@mui/material/Tooltip";
import Skeleton from "@mui/material/Skeleton";
import { v4 } from "uuid";

const TopBuyer = ({ cusTopBuyerB2B, isLoadingCusTopBuyerB2B, cusNeverOrderedPercentageB2B, isLoadingCusNeverOrderedPercentageB2B, cusSingleOrderPercentageB2B, isLoadingCusSingleOrderPercentageB2B }) => {

  return (
    <Card
      styleCard={{ display: "flex", flexDirection: "column", gridColumn: "2/3", boxShadow: "none", "@media (max-width: 1200px)": { gridColumn: "1/-1" } }}
      children={
        <>
          <CardHeader
            title={<Typography variant="h6" sx={{ color: "var(--text-color)", backgroundColor: "var(--main-bg-color)", padding: "0.5rem 1rem", borderRadius: "0.4rem", lineHeight: "1", fontSize: "1rem" }}>Kompanije</Typography>}
          />
          <CardContent>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>

              <Box sx={{ textAlign: "center" }}>

                <Box sx={{ position: 'relative', display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                  {isLoadingCusSingleOrderPercentageB2B
                    ?
                    <Skeleton variant="circular" width={65} height={65} />
                    :
                    <>
                      <CircularProgress variant="determinate" value={parseFloat(cusSingleOrderPercentageB2B?.label)} sx={{ color: "var(--dashboardOrange)" }} size={65} />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "600", fontSize: "0.875rem" }}
                          variant="caption"
                          component="div"
                        >{`${Math.round(cusSingleOrderPercentageB2B?.percentage)}%`}</Typography>
                      </Box>
                    </>
                  }
                </Box>
                <span style={{ fontSize: "0.875rem" }}>Sa jednom <br /> kupovinom</span>
              </Box>

              <Box sx={{ textAlign: "center" }}>
                <Box sx={{ position: 'relative', display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "0.5rem" }}>
                  {isLoadingCusNeverOrderedPercentageB2B ?
                    <Skeleton variant="circular" width={65} height={65} /> :
                    <>
                      <CircularProgress variant="determinate" value={parseFloat(cusNeverOrderedPercentageB2B?.label)} sx={{ color: "var(--dashboardBlue)" }} size={65} />
                      <Box
                        sx={{
                          top: 0,
                          left: 0,
                          bottom: 0,
                          right: 0,
                          position: 'absolute',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Typography
                          sx={{ fontWeight: "600", fontSize: "0.875rem" }}
                          variant="caption"
                          component="div"
                        >{`${Math.round(cusNeverOrderedPercentageB2B?.percentage)}%`}</Typography>
                      </Box>
                    </>
                  }
                </Box>
                <span style={{ fontSize: "0.875rem" }}>Nemaju <br /> kupovinu</span>
              </Box>
            </Box>
            <TableContainer>
              {cusTopBuyerB2B?.length > 0 ?
                <Table className="dashboardTable">
                  <TableHead>
                    <TableRow>
                      <TableCell></TableCell>
                      <TableCell>Broj kupovina</TableCell>
                      <TableCell>Iznos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {cusTopBuyerB2B?.map((row) => (
                      <TableRow key={v4()} sx={{ "&:nth-of-type(odd)": { backgroundColor: "var(--main-bg-color)" }, border: 0 }}>
                        <TableCell sx={{ display: "flex", alignItems: "center" }}>
                          {row.name}{row.type === "register" ? <Tooltip title="Registrovan kupac" arrow placement="top"><HowToRegIcon sx={{ color: "var(--theme)", fontSize: "1.2rem", marginLeft: "0.3rem" }} /></Tooltip> : null}</TableCell>
                        <TableCell>{row.count}</TableCell>
                        <TableCell>{row.total}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                : <Typography variant="body2" sx={{ color: "var(--text-color)", fontSize: "0.875rem", marginTop: "2rem" }}>Trenutno nema podataka za prikaz.</Typography>}
            </TableContainer>
          </CardContent>
        </>
      }
    />
  )
}

export default TopBuyer