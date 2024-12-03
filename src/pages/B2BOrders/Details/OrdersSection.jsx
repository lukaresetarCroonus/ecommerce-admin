import Box from "@mui/material/Box";

import styles from "./B2BOrdersDetails.module.scss";

const OrderSection = ({ title, children, className, styleBodyProductOrders, styleWrapperOfOrderSection }) => {
  return (
    <Box className={`${className} ${styles.orderSection}`} sx={styleWrapperOfOrderSection}>
      <Box className={styles.orderSectionTitle}>{title}</Box>
      <Box className={styles.orderSectionBody} sx={styleBodyProductOrders}>{children}</Box>
    </Box>
  );
};

export default OrderSection;
