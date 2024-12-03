import { BarChart } from '@mui/x-charts/BarChart';
import Skeleton from '@mui/material/Skeleton';

const OrderAmountChart = ({ amountChart, isLoadingOrderAmountChart }) => {
  return (
    <>
      {isLoadingOrderAmountChart ? (
        <Skeleton variant="rounded" width={1000} height={100} />
      ) : (
        amountChart && amountChart?.series?.length !== 0 && (
          <BarChart
            sx={{ height: "auto !important", width: "100% !important", ".MuiChartsLegend-root": { display: "none" }, ".MuiBarElement-root": { fill: "var(--theme)" }, ".MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": { transform: "rotate(90deg)", textAnchor: "start !important" } }}
            width={1000}
            height={350}
            series={amountChart?.series}
            xAxis={amountChart?.xAxis}
          />
        )
      )}
    </>
  )
}

export default OrderAmountChart