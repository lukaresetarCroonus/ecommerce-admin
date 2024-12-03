import Box from "@mui/material/Box";
import addressTemplate from "../../../../helpers/addressTemplate";
import styles from "../B2COrdersDetails.module.scss";

const BillMediaPrint = ({ orderData, billingData }) => {
    return (
        <Box
            sx={{
                display: "none",
                "@media print": {
                    display: "flex",
                    gap: "1rem",
                },
            }}
        >
            <Box className={styles.orderDataDisplay}>
                <p>
                    <span className={styles.dataLabel}>Kupac:</span>
                    {orderData?.order.bill_to_name ? orderData?.order.bill_to_name : "/"}
                </p>
                <p>
                    <span className={styles.dataLabel}>Adresa:</span>
                    {addressTemplate(
                        billingData?.address,
                        billingData?.object_number,
                        billingData?.floor,
                        billingData?.apartment_number,
                        billingData?.zip_code,
                        billingData?.town_name,
                        billingData?.country_name
                    )}
                </p>
                <p>
                    <span className={styles.dataLabel}>Telefon:</span>
                    {billingData?.phone ? billingData?.phone : "/"}
                </p>
                <p>
                    <span className={styles.dataLabel}>Email:</span>
                    {billingData?.email ? billingData?.email : "/"}
                </p>
            </Box>
            <Box className={styles.orderDataDisplay}>
                <p>
                    <span className={styles.dataLabel}>Plaćanje:</span>
                    {orderData?.payments.length === 0 && "/"}
                    {orderData?.payments.map((payment, index) => {
                        return (
                            <span key={payment.id}>
                                {payment.data.status_info?.fields?.length > 0 ? (
                                    <span
                                        style={{
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            color:
                                                payment.data.status_info.status_info === "danger"
                                                    ? "#d32f2f"
                                                    : payment.data.status_info.status_info === "success"
                                                    ? "#28a86e"
                                                    : payment.data.status_info.status_info === "warning"
                                                    ? "#FFCC00"
                                                    : "black", // Default color
                                        }}
                                    >
                                        {payment.name ? payment.name : "/"}
                                    </span>
                                ) : (
                                    <span>{payment.name ? payment.name : "/"}</span>
                                )}
                                {index < orderData?.payments.length - 1 && ","}
                            </span>
                        );
                    })}
                </p>
                <p>
                    <span className={styles.dataLabel}>Dostava:</span>
                    {orderData?.deliveries.length === 0 && "/"}
                    {orderData?.deliveries.map((item, index) => {
                        return (
                            <span>
                                {item.format_data?.full_name ? item.format_data?.full_name : "/"} {index < orderData?.deliveries.length - 1 && ","}
                            </span>
                        );
                    })}
                </p>
                <p>
                    <span className={styles.dataLabel}>Vreme kupovine:</span>
                    {orderData?.order.created_at ? orderData?.order.created_at : "/"}
                </p>
                <p>
                    <span className={styles.dataLabel}>Napomena:</span>
                    {billingData?.note ? billingData?.note : "/"}
                </p>
            </Box>
        </Box>
    );
};

export default BillMediaPrint;
