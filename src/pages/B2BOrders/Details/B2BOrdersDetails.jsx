import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { useContext, useRef, useState } from "react";

import { toast } from "react-toastify";
import PageWrapper from "../../../components/shared/Layout/PageWrapper/PageWrapper";
import addressTemplate from "../../../helpers/addressTemplate";
import OrderSection from "./OrdersSection";
import OrderPrices from "./OrderPrices";
import OrderItemsTable from "./OrderItemsTable";
import OrderStatus from "./OrderStatus";
import AuthContext from "../../../store/auth-contex";

import tableFields from "./tableFields.json";

import styles from "./B2BOrdersDetails.module.scss";
import Button from "../../../components/shared/Button/Button";
import DeleteDialog from "../../../components/shared/Dialogs/DeleteDialog";
import Tooltip from "@mui/material/Tooltip";
import PrintIcon from "@mui/icons-material/Print";
import Box from "@mui/material/Box";
import { InputInput } from "../../../components/shared/Form/FormInputs/FormInputs";
import { currencyFormat } from "../../../helpers/functions";
import Typography from "@mui/material/Typography";

const B2BOrdersDetails = () => {
    const navigate = useNavigate();
    const { orderId } = useParams();
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [showDialog, setShowDialog] = useState(false);
    const [search, setSearch] = useState("");
    const notesBoxRef = useRef(null);

    const apiPathOrderData = "admin/orders-b2b/summary";
    const apiPathBilling = "admin/orders-b2b/billing-address";
    const apiPathShipping = "admin/orders-b2b/shipping-address";
    const apiPathItems = "admin/orders-b2b/items";
    const apiPathNotes = "admin/orders-b2b/notes";

    const { isLoading: isOrderLoading, data: orderData } = useQuery(["data"], () => api.get(`${apiPathOrderData}/${orderId}`).then((response) => response?.payload));
    const { isLoading: isBillingLoading, data: billingData } = useQuery(["billing"], () => api.list(`${apiPathBilling}/${orderId}`).then((response) => response?.payload?.items[0]));
    const { isLoading: isShipingLoading, data: shippingData } = useQuery(["shipping"], () => api.list(`${apiPathShipping}/${orderId}`).then((response) => response?.payload?.items[0]));
    const { isLoading: isNotesLoading, data: orderNotes, refetch } = useQuery(["notes"], () => api.list(`${apiPathNotes}/${orderId}`).then((response) => response?.payload?.items));

    const { isLoading: isItemsLoading, data: orderItems } = useQuery(["items"], () =>
        api.list(`${apiPathItems}/${orderId}`).then((response) =>
            response?.payload?.items.map((itemRow) => {
                let rebate = [];
                if (itemRow?.price?.price_rebate_amount && itemRow?.price_campaigns?.length > 0) {
                    itemRow?.price_campaigns.map((campaignItem) => {
                        if (campaignItem?.campaign_type === "b2b_rebate") {
                            rebate.push(campaignItem?.calc_name);
                        }
                        return false;
                    });
                }

                let temp = {
                    id: itemRow?.item?.id,
                    id_product: itemRow?.item?.id_product,
                    image: itemRow?.item?.image,
                    name: itemRow?.item?.name + " " + (itemRow?.item?.attributes_text ? " (" + itemRow?.item?.attributes_text + ")" : ""),
                    attributes_text: itemRow?.item?.attributes_text,
                    sku: itemRow?.item?.sku,
                    quantity: itemRow?.price?.quantity,
                    price_with_out_vat: itemRow?.price?.price_with_out_vat,
                    rebate: rebate?.length > 0 ? rebate.join(", ") : "-0,00%",
                    discount: "-" + currencyFormat(Number(itemRow?.price?.price_discount_amount)),
                    price_subtotal: Number(itemRow?.price?.price_subtotal),
                    vat_procent: currencyFormat(Number(itemRow?.price?.price_vat_procent)) + "%",
                    total_with_vat: Number(itemRow?.price?.total),
                };

                return temp;
            })
        )
    );

    const handlePrint = () => {
        window.print();
    };

    const scrollToBottom = () => {
        if (notesBoxRef.current) {
            notesBoxRef.current.scrollTop = notesBoxRef.current.scrollHeight;
        }
    };

    const submitHandlerNotes = (event) => {
        event.preventDefault();
        if (search.trim() !== "") {
            api.post(`admin/orders-b2b/notes`, { id: null, id_order: Number(orderId), description: search })
                .then((response) => {
                    setSearch("");
                    refetch();
                    toast.success("Uspešno ste dodali napomenu!");
                    scrollToBottom();
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
            title={`Narudžbenica: ${orderData?.slug}`}
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
                    "@media (max-width: 1536px)": { flexDirection: "column" },
                }}
            >
                <OrderSection title="Podaci partnera:" className={styles.orderSection50}>
                    <Box className={styles.orderDataSection}>
                        <Box className={styles.orderSection100}>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Kompanija:</span>
                                {billingData?.company_name}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Matični broj:</span>
                                {billingData?.maticni_broj}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>PIB:</span>
                                {billingData?.pib}
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
                                {billingData?.phone}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>E-mail:</span>
                                {billingData?.email}
                            </p>
                            {billingData?.note && (
                                <p style={{ fontSize: "0.875rem" }}>
                                    <span className={styles.dataLabel}>Napomena:</span>
                                    {billingData?.note}
                                </p>
                            )}
                        </Box>
                    </Box>
                </OrderSection>

                <OrderSection title="Adresa za dostavu:" className={styles.orderSection50}>
                    <Box className={styles.orderDataSection}>
                        <Box className={styles.orderSection100}>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Kompanija:</span>
                                {shippingData?.company_name}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Ime:</span>
                                {shippingData?.first_name + " " + shippingData?.last_name}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Adresa:</span>
                                {addressTemplate(
                                    shippingData?.address,
                                    shippingData?.object_number,
                                    shippingData?.floor,
                                    shippingData?.apartment_number,
                                    shippingData?.zip_code,
                                    shippingData?.town_name,
                                    shippingData?.country_name
                                )}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Telefon:</span>
                                {shippingData?.phone}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>E-mail:</span>
                                {shippingData?.email}
                            </p>
                            {shippingData?.note && (
                                <p style={{ fontSize: "0.875rem" }}>
                                    <span className={styles.dataLabel}>Napomena:</span>
                                    {shippingData?.note}
                                </p>
                            )}
                        </Box>
                    </Box>
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
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                            <InputInput value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Unesite tekst napomene" />
                            <Button type="submit" label={"Sačuvaj"} variant="contained" disabled={isItemsLoading} sx={{ marginLeft: "0.5rem", padding: "0.55rem", marginTop: "0.2rem" }} />
                        </Box>
                    </Box>
                </OrderSection>

                <OrderSection title="Podaci narudžbenice:" className={styles.orderSection50}>
                    <Box className={styles.orderDataSection}>
                        <Box className={styles.orderSection100}>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Plaćanje:</span>
                                {orderData?.payment_method_status?.fields?.length > 0 ? (
                                    <Tooltip
                                        placement="top"
                                        arrow={true}
                                        title={
                                            <Box>
                                                {orderData?.payment_method_status?.fields?.map((item) => {
                                                    return (
                                                        <Typography>
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
                                                    orderData?.payment_method_status.status_info === "danger"
                                                        ? "#d32f2f"
                                                        : orderData?.payment_method_status.status_info === "success"
                                                        ? "#28a86e"
                                                        : orderData?.payment_method_status.status_info === "warning"
                                                        ? "#FFCC00"
                                                        : "black", // Default color
                                            }}
                                        >
                                            {orderData?.payment_method_name ? orderData?.payment_method_name : "/"}
                                        </span>
                                    </Tooltip>
                                ) : (
                                    <>{orderData?.payment_method_name ? orderData?.payment_method_name : "/"}</>
                                )}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Dostava:</span>
                                {orderData?.delivery_method_name}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Vreme kupovine:</span>
                                {orderData?.created_at}
                            </p>
                            <p style={{ fontSize: "0.875rem" }}>
                                <span className={styles.dataLabel}>Napomena:</span>
                                {orderData?.note ? orderData?.note : "/"}
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
                    <OrderStatus orderId={orderData?.id} status={orderData?.status} />
                </OrderSection>
            </Box>
            <Box sx={{ display: "grid", gridTemplateColumns: "78% auto", gap: "2rem", "@media (max-width: 1536px)": { gridTemplateColumns: "1fr" } }}>
                <OrderSection
                    title="Proizvodi u narudžbenici:"
                    styleBodyProductOrders={{ paddingTop: "0.5rem", overflowX: "auto" }}
                    styleWrapperOfOrderSection={{ maxWidth: "100%", overflowX: "hidden" }}
                >
                    <OrderItemsTable fields={tableFields} items={orderItems} />
                </OrderSection>
                <OrderSection
                    title="Porudžbina:"
                    styleBodyProductOrders={{ padding: "0" }}
                    styleWrapperOfOrderSection={{
                        "@media print": {
                            width: "40%",
                            marginLeft: "auto",
                        },
                    }}
                >
                    <OrderPrices
                        total_original={orderData?.total_original}
                        total_with_out_vat={orderData?.total_with_out_vat}
                        total_delivery_amount={orderData?.total_delivery_amount}
                        total_promo_code={orderData?.total_promo_code}
                        total_rabat_1={orderData?.total_rebate_amount}
                        total_discount={Number(orderData?.total_items_discount_amount) + Number(orderData?.total_cart_discount_amount)}
                        total_vat={orderData?.total_vat}
                        total_with_vat={orderData?.total_with_vat}
                        total={orderData?.total}
                        currency={orderData?.currency}
                        subtotal={orderData?.subtotal}
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
                                    marginLeft: "auto",
                                    marginTop: "0.5rem",
                                    paddingRight: "0",
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
                    api.delete(`admin/orders-b2b/list/${orderId}`)
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

export default B2BOrdersDetails;
