import LinearProgress from '@mui/material/LinearProgress';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const UploadSkeleton = ({ textUploading = "Ucitavanje je u toku..." }) => {
  return (
    <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }}>
      <LinearProgress sx={{ width: "30%" }} />
      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        {textUploading}
      </Typography>
    </Box>
  )
}

export default UploadSkeleton