import Stack from "@mui/material/Stack";
import Skeleton from "@mui/material/Skeleton";

const LoadingForm = ({ fields = 0 }) => {
  let stack = [];
  for (let i = 0; i < fields; i++) {
    stack.push(<Skeleton variant="text" height={80} key={i} />);
  }
  return (
    <Stack>
      {stack.map((field) => {
        return field;
      })}
    </Stack>
  );
};

export default LoadingForm;
