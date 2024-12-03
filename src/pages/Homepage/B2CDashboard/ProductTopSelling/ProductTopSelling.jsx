import CardHeader from "@mui/material/CardHeader";
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { Link } from "react-router-dom";
import Card from "../../../../components/shared/Card/Card";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";

const ProductTopSelling = ({ productTopSellingB2C, productActiveCountB2C, productLowStockCountB2C, isLoadingProductActiveCountB2C, isLoadingProductTopSellingB2C, isLoadingProductLowStockCountB2C }) => {

  return (
    <Card
      styleCard={{ display: "flex", flexDirection: "column", gridColumn: "1/2", boxShadow: "none", "@media (max-width: 1200px)": { gridColumn: "1/-1" } }}
      children={
        <>
          <CardHeader
            title={<Typography variant="h6" sx={{ color: "var(--text-color)", backgroundColor: "var(--main-bg-color)", padding: "0.5rem 1rem", borderRadius: "0.4rem", lineHeight: "1", fontSize: "1rem" }}>Proizvodi</Typography>}
          />
          <CardContent>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem", marginBottom: "1.5rem" }}>
              <Box sx={{ padding: "0.5rem", borderRadius: "0.4rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-color)", minWidth: "80%", margin: "0 auto", backgroundColor: "var(--dashboardGreenOp)" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", justifyContent: "center" }}>
                  {isLoadingProductActiveCountB2C ? (
                    <Skeleton variant="rounded" width={70} height={25} sx={{ marginBottom: "0.3rem" }} />
                  ) : (
                    productActiveCountB2C?.count ?? 0
                  )}
                </Typography>

                Aktivnih proizvoda
              </Box>
              <Box sx={{ padding: "0.5rem", borderRadius: "0.4rem", textAlign: "center", fontSize: "0.875rem", color: "var(--text-color)", minWidth: "80%", margin: "0 auto", backgroundColor: "var(--dashboardBlueOp)" }}>
                <Typography variant="h6" sx={{ fontWeight: 600, display: "flex", justifyContent: "center" }}>
                  {isLoadingProductLowStockCountB2C ? (
                    <Skeleton variant="rounded" width={70} height={25} sx={{ marginBottom: "0.3rem" }} />
                  ) : (
                    productLowStockCountB2C?.count ?? 0
                  )}
                </Typography>
                Male količine
              </Box>
            </Box>
            {isLoadingProductTopSellingB2C ? (
              <>
                <Skeleton variant="rounded" sx={{ marginBottom: "0.5rem" }} />
                <Skeleton variant="rounded" sx={{ marginBottom: "0.5rem" }} />
                <Skeleton variant="rounded" sx={{ marginBottom: "0.5rem" }} />
              </>
            ) : (
              <TableContainer>
                {productTopSellingB2C?.length > 0 ?
                  <Table className="dashboardTable">
                    <TableHead>
                      <TableRow>
                        <TableCell>Najprodavaniji proizvod</TableCell>
                        <TableCell>Količina</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {productTopSellingB2C?.map((row) => (
                        <TableRow key={row.id_product} sx={{ "&:nth-of-type(odd)": { backgroundColor: "var(--main-bg-color)" }, border: 0 }}>
                          <TableCell>
                            <Link to={`/products/${row.id_product}`} style={{ display: "flex", alignItems: "center" }}>
                              <Box sx={{ width: "40px", height: "40px", marginRight: "0.5rem" }}>
                                <img src={row.image} alt={row.name} style={{ width: "100%", objectFit: "cover", height: "100%" }} />
                              </Box>
                              {row.name}
                            </Link>
                          </TableCell>
                          <TableCell>{row.count}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                  : <Typography variant="body2" sx={{ color: "var(--text-color)", fontSize: "0.875rem", marginTop: "2rem" }}>Trenutno nema podataka za prikaz.</Typography>}
              </TableContainer>
            )}

          </CardContent>
        </>
      }
    />
  )
}

export default ProductTopSelling