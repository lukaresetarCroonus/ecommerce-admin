import Card from "../../../../components/shared/Card/Card";
import CardHeader from "@mui/material/CardHeader";
import Typography from '@mui/material/Typography';
import img from "../../../../assets/images/ukupan-prihod-prodaja.png";
import Box from "@mui/material/Box";
import CardContent from "@mui/material/CardContent";
import Skeleton from "@mui/material/Skeleton";
import { v4 } from "uuid";

const LifetimeRevenue = ({ lifetimeRevenueB2B, isLoadinglifetimeRevenueB2B }) => {

  return (
    <Card
      className="cardDashboard"
      styleCard={{ display: "flex", flexDirection: "column", justifyContent: "center", boxShadow: "none", borderRadius: "1.4rem", backgroundColor: "var(--dashboardGreenOp)" }}
      children={
        <>
          <CardHeader
            sx={{ ".MuiCardHeader-action": { marginTop: 0, marginRight: 0, marginBottom: 0 }, paddingBottom: 0 }}
            action={
              <Box sx={{ width: "3.75rem" }}>
                <img src={img} alt="Ukupan-prihod-od-prodaje" style={{ width: "100%" }} />
              </Box>
            }
            title={
              <Typography variant="h6" sx={{ color: "var(--text-color)", lineHeight: "1.3", fontSize: "0.9rem" }}>
                Ukupan <br /> prihod od  prodaje
              </Typography>
            }

          />
          <CardContent sx={{ "&.MuiCardContent-root:last-child": { paddingBottom: "1rem" }, paddingTop: "0.5rem" }}>
            {
              isLoadinglifetimeRevenueB2B ? (
                <Skeleton variant="rounded" width={40} height={15} />
              ) : (
                lifetimeRevenueB2B?.length === 0 ? (
                  <Typography variant="h5" sx={{ fontWeight: 600, fontSize: "1.4rem", color: "var(--text-color)" }}>
                    -
                  </Typography>
                ) : (
                  lifetimeRevenueB2B?.map((total) => (
                    <Typography key={v4()} variant="h5" sx={{ fontWeight: 600, fontSize: "1.4rem", color: "var(--text-color)" }}>
                      {total?.total}  <span style={{ marginRight: "0.5rem" }}>{total?.currency.toUpperCase()}</span>
                    </Typography>
                  ))
                )
              )
            }

          </CardContent>
        </>
      }
    />
  )
}

export default LifetimeRevenue