import { BarChart } from '@mui/x-charts/BarChart';
import Skeleton from '@mui/material/Skeleton';

const ProductItemSellCount = ({ itemSellChart, isLoadingItemSellChart }) => {

  return (
    <>
      {isLoadingItemSellChart ? (
        <Skeleton variant="rounded" width={1000} height={100} />
      ) : (
        itemSellChart && itemSellChart?.series?.length !== 0 && (
          <BarChart
            sx={{ height: "auto !important", width: "100% !important", ".MuiChartsLegend-root": { display: "none" }, ".MuiBarElement-root": { fill: "var(--theme)" }, ".MuiChartsAxis-bottom .MuiChartsAxis-tickLabel": { transform: "rotate(90deg)", textAnchor: "start !important" } }}
            width={1000}
            height={350}
            series={itemSellChart?.series}
            xAxis={itemSellChart?.xAxis}
          />
        )
      )}
    </>
  )
}

export default ProductItemSellCount