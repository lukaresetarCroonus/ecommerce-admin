import Box from "@mui/material/Box";
import { currencyFormat } from "../../../helpers/functions";
import Divider from '@mui/material/Divider';

import styles from "./B2COrdersDetails.module.scss";

const OrderPrices = ({ total_with_out_vat, total_delivery_amount, total_discount, total_promo_code, total_vat, total_with_vat, total, currency, total_cart_discount_amount, total_items_discount_amount, total_promo_code_amount }) => {

  currency = currency == null ? "" : currency;

  const totalDiscount = Number(total_items_discount_amount) + Number(total_cart_discount_amount);

  return (
    <Box
      sx={{
        background: "#ecf0fa",
        padding: "1rem 0.5rem",
        borderRadius: "0.25rem",
        marginTop: "1rem",
        "@media print": {
          marginTop: "0",
        },
      }}
    >
      {/* <hr /> */}
      <Box className={styles.priceRow}>
        <span>Ukupno bez PDV:</span>
        <span className={styles.priceValue}>{`${currencyFormat(total_with_out_vat)} ${currency}`}</span>
      </Box>
      <Box className={styles.priceRow}>
        <span>PDV:</span>
        <span className={styles.priceValue}>{`${currencyFormat(total_vat)} ${currency}`}</span>
      </Box>
      <Divider sx={{ margin: "1rem 0", borderColor: "#ffff", "@media print": { borderColor: "rgba(224, 224, 224, 1)" } }} />
      <Box className={styles.priceRow}>
        <span>Popust:</span>
        <span className={styles.priceValue}>{`${currencyFormat(totalDiscount)} ${currency}`}</span>
      </Box>
      <Box className={styles.priceRow}>
        <span>Promo kod:</span>
        <span className={styles.priceValue}>{`-${currencyFormat(total_promo_code_amount)} ${currency}`}</span>
      </Box>
      <Box className={styles.priceRow}>
        <span>Dostava:</span>
        <span className={styles.priceValue}>{`${currencyFormat(total_delivery_amount)} ${currency}`}</span>
      </Box>
      <Divider sx={{ margin: "1rem 0", borderColor: "#ffff", "@media print": { borderColor: "rgba(224, 224, 224, 1)" } }} />
      <Box className={`${styles.totalPriceRow} ${styles.priceRow}`} sx={{ color: "#28a86e !important" }}>
        <span style={{ fontWeight: "600" }}>UKUPNO:</span>
        <span className={styles.priceValue}>{`${currencyFormat(total)} ${currency}`}</span>
      </Box>
    </Box>
  );
};

export default OrderPrices;
