import Box from "@mui/material/Box";
import { currencyFormat } from "../../../helpers/functions";

import styles from "./B2BOrdersDetails.module.scss";
import Divider from "@mui/material/Divider";

const OrderPrices = ({ total_original, total_with_out_vat, subtotal, total_delivery_amount, total_discount, total_promo_code, total_rabat_1, total_rabat_2, total_vat, total_with_vat, total, currency }) => {
  currency = currency == null ? "" : currency;
  // const totalDiscount = Number(total_items_discount_amount) + Number(total_cart_discount_amount);
  return (
    <Box sx={{
      background: "#ecf0fa",
      padding: "1rem 0.5rem",
      borderRadius: "0.25rem",
      marginTop: "1rem",
      "@media print": {
        marginTop: "0",
      },
    }}>

      <Box className={styles.priceRow}>
        <span>Ukupan iznos:</span>
        <span className={styles.priceValue}>{`${currencyFormat(total_original)} ${currency}`}</span>
      </Box>
      <Box className={styles.priceRow}>
        <span>Iznos rabata:</span>
        <span className={styles.priceValue}>-{`${currencyFormat(total_rabat_1)} ${currency}`}</span>
      </Box>
      <Box className={styles.priceRow}>
        <span>Iznos popusta:</span>
        <span className={styles.priceValue}>-{`${currencyFormat(total_discount)} ${currency}`}</span>
      </Box>
      <Divider sx={{ margin: "1rem 0", borderColor: "#ffff", "@media print": { borderColor: "rgba(224, 224, 224, 1)" } }} />
      <Box className={styles.priceRow}>
        <span>Ukupna osnovica:</span>
        <span className={styles.priceValue}>{`${currencyFormat(subtotal)} ${currency}`}</span>
      </Box>
      <Box className={styles.priceRow}>
        <span>Ukupan pdv:</span>
        <span className={styles.priceValue}>{`${currencyFormat(total_vat)} ${currency}`}</span>
      </Box>
      <Box className={styles.priceRow}>
        <span>Iznos dostave:</span>
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
