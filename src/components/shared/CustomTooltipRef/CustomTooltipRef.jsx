import { forwardRef } from "react";
import Tooltip from "@mui/material/Tooltip";

const CustomTooltipRef = forwardRef(({ children, ...props }, ref) => {
  return (
    // If we use an element that needs to be referenced and to be wrapp with a tooltip, we use this component
    <Tooltip {...props} ref={ref}>
      {children}
    </Tooltip>
  );
});

export default CustomTooltipRef;