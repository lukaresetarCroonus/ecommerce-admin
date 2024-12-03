import { BarChart } from '@mui/x-charts/BarChart';
import Skeleton from '@mui/material/Skeleton';

const OrderCountChart = ({ countChart, isLoadingOrderCountChart }) => {

  return (
    <>
      {
        isLoadingOrderCountChart ? (
          <Skeleton variant="rounded" height={100} />
        ) : (
          countChart && countChart?.series?.length !== 0 && (
            <BarChart
              sx={{ height: "auto !important", width: "100% !important", ".MuiChartsLegend-root": { display: "none" }, ".MuiBarElement-root": { fill: "var(--theme)" }, ".MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": { transform: "rotate(90deg)", textAnchor: "start !important" } }}
              width={1000}
              height={350}
              series={countChart?.series}
              xAxis={countChart?.xAxis}
            />
          )
        )
      }
    </>
  )
}

export default OrderCountChart