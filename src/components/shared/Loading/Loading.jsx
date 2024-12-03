import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

/**
 * Basic loading
 *
 * @param {"string"|number} size The size of the component. If using a number, the pixel unit is assumed. If using a string, you need to provide the CSS unit, e.g '3rem'.
 * @param sx
 */

const Loading = ({ size, sx }) => (
    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
        <CircularProgress size={size} sx={sx} />
    </Box>
);

export default Loading;
