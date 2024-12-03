import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useContext, useRef, useState } from "react";

import Box from "@mui/material/Box";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import PrintIcon from "@mui/icons-material/Print";

import PageWrapper from "../../../components/shared/Layout/PageWrapper/PageWrapper";
import addressTemplate from "../../../helpers/addressTemplate";
import OrderSection from "./OrdersSection";
import OrderPrices from "./OrderPrices";
import tableFields from "./tableFields.json";
import OrderItemsTable from "./OrderItemsTable";
import OrderStatus from "./OrderStatus";

import styles from "./B2COrdersDetails.module.scss";
import AuthContext from "../../../store/auth-contex";
import Button from "../../../components/shared/Button/Button";
import DeleteDialog from "../../../components/shared/Dialogs/DeleteDialog";
import { toast } from "react-toastify";
import { InputInput } from "../../../components/shared/Form/FormInputs/FormInputs";
import BillMediaPrint from "./BillMediaPrint/BillMediaPrint";

const B2COrdersDetails = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [showDialog, setShowDialog] = useState(false);
    const [search, setSearch] = useState("");
    const notesBoxRef = useRef(null);

    const apiPathOrderData = "admin/orders-b2c/summary";
    const apiPathBilling = "admin/orders-b2c/billing-address";
    const apiPathShipping = "admin/orders-b2c/shipping-address";
    const apiPathItems = "admin/orders-b2c/items";

    const apiPathNotes = "admin/orders-b2c/notes";

    const { isLoading: isOrderLoading, data: orderData } = useQuery(["data"], () => api.get(`${apiPathOrderData}/${orderId}`).then((response) => response?.payload));
    const { isLoading: isBillingLoading, data: billingData } = useQuery(["billing"], () => api.list(`${apiPathBilling}/${orderId}`).then((response) => response?.payload?.items[0]));
    const { isLoading: isShipingLoading, data: shippingData } = useQuery(["shipping"], () => api.list(`${apiPathShipping}/${orderId}`).then((response) => response?.payload?.items[0]));
    const { isLoading: isItemsLoading, data: orderItems } = useQuery(["items"], () => api.list(`${apiPathItems}/${orderId}`).then((response) => response?.payload?.items));
    const { isLoading: isNotesLoading, data: orderNotes, refetch } = useQuery(["notes"], () => api.list(`${apiPathNotes}/${orderId}`).then((response) => response?.payload?.items));
    console.log(orderData);
    const handlePrint = () => {
        window.print();
    };

    const submitHandlerNotes = (event) => {
        event.preventDefault();
        if (search.trim() !== "") {
            api.post(`admin/orders-b2c/notes`, { id: null, id_order: Number(orderId), description: search })
                .then((response) => {
                    setSearch("");
                    refetch();
                    toast.success("Uspešno ste dodali napomenu!");
                })
                .catch((error) => {
                    console.log(error);
                    toast.warning("Greška!");
                });
        } else {
            toast.warning("Unesite tekst napomene.");
        }
    };

    return (
        <PageWrapper
            title={`Narudžbenica:  ${orderData?.order.slug}`}
            back={() => {
                navigate(-1);
            }}
            ready={!(isOrderLoading || isBillingLoading || isShipingLoading || isItemsLoading)}
        >
            <Box sx={{ display: "flex", alignItems: "center", justifyContent: "flex-end", marginBottom: "1rem" }} className={styles.orderDupPrt}>
                <Tooltip arrow={true} title="Štampaj" placement="top">
                    <PrintIcon onClick={() => handlePrint()} sx={{ cursor: "pointer", fontSize: "2rem", color: "#17a2b9" }} />
                </Tooltip>
            </Box>
            <Box
                className={styles.orderData}
                sx={{
                    marginBottom: "1rem",
                    "@media (max-width: 1200px)": { flexDirection: "column" },
                }}
            >
                <OrderSection title="Podaci kupca:" className={styles.orderSection50}>
                    <BillMediaPrint orderData={orderData} billingData={billingData} />
                    <Box
                        className={styles.orderDataSection}
                        sx={{
                            "@media (max-width: 1536px)": {
                                flexDirection: "column",
                            },
                            "@media print": {
                                display: "none",
                            },
                        }}
                    >
                        <Box className={styles.orderDataDisplay}>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Kupac:</span>
                                {orderData?.order.bill_to_name ? orderData?.order.bill_to_name : "/"}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
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
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Telefon:</span>
                                {billingData?.phone ? billingData?.phone : "/"}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Email:</span>
                                {billingData?.email ? billingData?.email : "/"}
                            </p>
                        </Box>
                        <Box className={styles.orderDataDisplay}>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Plaćanje:</span>
                                {orderData?.payments.length === 0 && "/"}
                                {orderData?.payments.map((payment, index) => {
                                    return (
                                        <span key={payment.id}>
                                            {payment.data.status_info?.fields?.length > 0 ? (
                                                <Tooltip
                                                    placement="top"
                                                    arrow={true}
                                                    title={
                                                        <Box>
                                                            {payment.data.status_info?.fields?.map((item) => {
                                                                return (
                                                                    <Typography key={item?.label}>
                                                                        {item?.label}: {item?.value}
                                                                    </Typography>
                                                                );
                                                            })}
                                                        </Box>
                                                    }
                                                >
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
                                                </Tooltip>
                                            ) : (
                                                <>{payment.name ? payment.name : "/"}</>
                                            )}
                                            {index < orderData?.payments.length - 1 && ","}
                                        </span>
                                    );
                                })}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
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
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Vreme kupovine:</span>
                                {orderData?.order.created_at ? orderData?.order.created_at : "/"}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Napomena:</span>
                                {billingData?.note ? billingData?.note : "/"}
                            </p>
                        </Box>
                    </Box>
                </OrderSection>
                <OrderSection
                    title="Status narudžbenice:"
                    className={styles.orderSection50}
                    styleWrapperOfOrderSection={{
                        "@media print": {
                            display: "none",
                        },
                    }}
                >
                    <OrderStatus orderId={orderData?.order.id} status={orderData?.order.status} />
                </OrderSection>

                <OrderSection
                    title="Interna napomena:"
                    className={styles.orderSection50}
                    styleWrapperOfOrderSection={{
                        "@media print": {
                            display: "none",
                        },
                    }}
                >
                    {/* start notes */}
                    <Box component="form" autoComplete="off" onSubmit={submitHandlerNotes}>
                        <Box ref={notesBoxRef} sx={{ height: "5rem", overflowX: "auto", borderRadius: "0.25rem", border: "1px solid red", borderColor: "rgba(0, 0, 0, 0.23)" }}>
                            {orderNotes?.length > 0 ? (
                                orderNotes.map((text, index) => (
                                    <Box key={index} sx={{ padding: "0 0.5rem" }}>
                                        <Box sx={{ margin: "0.2rem 0", display: "flex", flexDirection: "column", alignItems: "end" }}>
                                            <span className={styles.createdAt}>
                                                {text.first_name + " " + text.last_name} / {text.created_at}
                                            </span>
                                        </Box>
                                        <Box className={styles.chatBox}>{text.description}</Box>
                                    </Box>
                                ))
                            ) : (
                                <Box sx={{ padding: "0 0.5rem" }}>
                                    <Box sx={{ margin: "0.2rem 0", display: "flex", flexDirection: "column", alignItems: "start", fontSize: "0.875rem" }}>Trenutno nema internih napomena.</Box>
                                </Box>
                            )}
                        </Box>
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                "@media (max-width: 1350px)": {
                                    flexDirection: "column",
                                },
                            }}
                        >
                            <InputInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Unesite tekst napomene" />
                            <Button
                                type="submit"
                                label={"Sačuvaj"}
                                variant="contained"
                                disabled={isItemsLoading}
                                sx={{
                                    marginLeft: "0.5rem",
                                    padding: "0.55rem",
                                    marginTop: "0.2rem",
                                    "@media (max-width: 1350px)": {
                                        marginLeft: "auto",
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </OrderSection>
            </Box>

            <Box
                sx={{
                    display: "grid",
                    gridTemplateColumns: "78% auto",
                    gap: "2rem",
                    "@media (max-width: 1500px)": { gridTemplateColumns: "60% auto" },
                    "@media (max-width: 1400px)": { gridTemplateColumns: "55% auto" },
                    "@media (max-width: 1024px)": { gridTemplateColumns: "1fr" },
                }}
            >
                <OrderSection
                    title="Proizvodi u narudžbenici:"
                    styleBodyProductOrders={{ paddingTop: "0.5rem", overflowX: "auto" }}
                    styleWrapperOfOrderSection={{ maxWidth: "100%", overflowX: "hidden" }}
                >
                    <OrderItemsTable fields={tableFields} items={orderItems} />
                </OrderSection>
                <OrderSection
                    title="Ukupno za naplatu:"
                    styleBodyProductOrders={{ padding: "0" }}
                    styleWrapperOfOrderSection={{
                        "@media print": {
                            width: "40%",
                            marginLeft: "auto",
                        },
                    }}
                >
                    <OrderPrices
                        total_with_out_vat={orderData?.order.total_with_out_vat}
                        total_delivery_amount={orderData?.order.total_delivery_amount}
                        total_discount={orderData?.order.total_discount}
                        total_promo_code={orderData?.order.total_promo_code}
                        total_vat={orderData?.order.total_vat}
                        total_with_vat={orderData?.order.total_with_vat}
                        total={orderData?.order.total}
                        currency={orderData?.order.currency}
                        total_items_discount_amount={orderData?.order.total_items_discount_amount}
                        total_cart_discount_amount={orderData?.order.total_cart_discount_amount}
                        total_promo_code_amount={orderData?.order.total_promo_code_amount}
                    />
                    <Tooltip title="Izbrišite narudžbenicu" arrow placement="top">
                        <Box
                            sx={{
                                width: "fit-content",
                                marginLeft: "auto",
                                "@media print": {
                                    display: "none",
                                },
                            }}
                        >
                            <Button
                                onClick={() => {
                                    setShowDialog(true);
                                }}
                                icon={"delete"}
                                sx={{
                                    border: "none",
                                    color: "var(--light-silver)",
                                    marginBottom: "0.5rem",
                                    marginLeft: "auto",
                                    paddingRight: "inherit",
                                    display: "flex",
                                    minWidth: "auto !important",
                                    "&:hover": { border: "none", backgroundColor: "transparent" },
                                }}
                            />
                        </Box>
                    </Tooltip>
                </OrderSection>
            </Box>

            <DeleteDialog
                openDeleteDialog={{ show: showDialog }}
                setOpenDeleteDialog={() => setShowDialog(false)}
                handleConfirm={() => {
                    api.delete(`admin/orders-b2c/list/${orderId}`)
                        .then((response) => {
                            navigate(-1);
                            toast.success("Uspešno!");
                        })
                        .catch((error) => {
                            console.log(error);
                            toast.warning("Greška!");
                        });
                    setShowDialog(false);
                }}
            />
        </PageWrapper>
    );
};

export default B2COrdersDetails;
