import Skeleton from "@mui/material/Skeleton";
import Box from "@mui/material/Box";

const DashboardSkeleton = () => {
  return (
    <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem" }}>
      <Skeleton
        width="55%"
        height={50}
        sx={{
          gridColumn: "1/2",
          "@media (max-width: 768px)": {
            gridColumn: "1/-1",
            width: "30%"
          },
          height: "100%",
          transformOrigin: "none !important",
          transform: "none !important",
        }}
      />
      <Skeleton
        height={140}
        sx={{
          borderRadius: "1.4rem",
          gridColumn: "1/2",
          "@media (max-width: 768px)": {
            gridColumn: "1/-1",
          },
          height: "100%",
          transformOrigin: "none !important",
          transform: "none !important",
        }}
      />
      <Skeleton
        height={140}
        sx={{
          borderRadius: "1.4rem",
          gridColumn: "2/3",
          "@media (max-width: 768px)": {
            gridColumn: "1/-1",
          },
          height: "100%",
          transformOrigin: "none !important",
          transform: "none !important",
        }}
      />
      <Skeleton
        height={140}
        sx={{
          borderRadius: "1.4rem",
          gridColumn: "3/-1",
          "@media (max-width: 768px)": {
            gridColumn: "1/-1",
          },
          height: "100%",
          transformOrigin: "none !important",
          transform: "none !important",
        }}
      />
      <Skeleton
        height={140}
        sx={{
          gridColumn: "1/-1",
          "@media (max-width: 768px)": {
            gridColumn: "1/-1",
          },
          height: "100%",
          transformOrigin: "none !important",
          transform: "none !important",
        }}
      />

      <Skeleton
        height={450}
        sx={{
          gridColumn: "1/3",
          "@media (max-width: 768px)": {
            display: "none",
          },
          height: "100%",
          transformOrigin: "none !important",
          transform: "none !important",
        }}
      />
      <Skeleton
        height={450}
        sx={{
          gridColumn: "3/-1",
          "@media (max-width: 768px)": {
            display: "none",
          },
          height: "100%",
          transformOrigin: "none !important",
          transform: "none !important",
        }}
      />

    </Box>
  );
};

export default DashboardSkeleton;