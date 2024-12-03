import { useContext, useEffect, useState } from "react";

import Box from "@mui/material/Box";

import { toast } from "react-toastify";
import Button from "../../../components/shared/Button/Button";
import Buttons from "../../../components/shared/Form/Buttons/Buttons";
import { InputCheckbox, InputHtml, InputSelect } from "../../../components/shared/Form/FormInputs/FormInputs";
import HistoryModal from "./HistoryModal";
import AuthContext from "../../../store/auth-contex";
import { useQuery } from "react-query";
import CircularProgress from "@mui/material/CircularProgress";

const OrderStatus = ({ orderId, status }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/orders-b2c/status";

    const init = { id_order: orderId, status, send_mail: null, mail_to_customer: null, mail_to_admin: null, subject: null, content: null };

    const [data, setData] = useState(init);
    const [originalMessage, setOriginalMessage] = useState(data.content);
    const [openDialog, setOpenDialog] = useState({ show: false });
    const [sendMail, setSendMail] = useState("0");
    const [oldStatus, setOldStatus] = useState(status);

    const [loaded, setLoaded] = useState(false);

    const getMessage = (statusCode) => {
        api.get(`${apiPath}/message/${orderId}/${statusCode}`)
            .then((response) => {
                setOriginalMessage(response?.payload.content);
                setSendMail(response?.payload.send_mail);
                setData({ ...data, ...response?.payload, send_to_customer: response?.payload.send_mail === "1" });
            })
            .catch((error) => console.warn(error));
    };

    useEffect(() => {
        getMessage(data.status);
    }, [data.status]);

    const [done, setDone] = useState(true);

    const formSubmitHandler = () => {
        setDone(false);
        let ret = {};
        if (data.send_to_customer) {
            ret = { ...data, send_default_message: data.content === originalMessage };
        } else {
            ret = { ...data, send_default_message: null, mail_to_customer: null, mail_to_customers: null, content: null, subject: null };
        }
        api.post(apiPath, ret)
            .then((response) => {
                setData({ ...data, content: originalMessage, send_to_customer: false });
                toast.success("Uspešno!");
                setOldStatus(data.status);
                setDone(true);
            })
            .catch((error) => {
                toast.warn("Greška");
                setDone(true);
                console.warn(error);
            });
    };

    //dobijamo sve statuse
    const { data: allStatuses, refetch: getAllStatuses } = useQuery(
        [apiPath, orderId],
        async () => {
            return await api.get("admin/orders-b2c/status/ddl/status").then((res) => {
                return res?.payload;
            });
        },
        { refetchOnWindowFocus: false, enabled: true }
    );

    //dobijamo dostupne na osnovu odabranog statusa
    const {
        data: availableStatuses,
        refetch: getAvailableStatuses,
        isSuccess,
    } = useQuery(
        [data?.status],
        async () => {
            return await api.get(`admin/orders-b2c/status/ddl/status_flow/${data?.status}`).then((res) => {
                if (res?.payload && allStatuses) {
                    setOpt(renderStatuses(allStatuses, res?.payload));
                }
                return res?.payload;
            });
        },
        { refetchOnWindowFocus: false, enabled: true }
    );

    const renderStatuses = (allStatuses, availableStatuses) => {
        let arr = [];
        //trazimo selektovani status
        const selectedStatus = allStatuses?.find((status) => status?.id === data?.status);
        //niz dostupnih ne sadrzi selektovani, pa se pravi novi niz gde ce biti i selektovani i dostupni
        if (!availableStatuses?.find((status) => status?.id === data?.status)) {
            arr = [selectedStatus, ...availableStatuses];
        } else {
            arr = [...availableStatuses];
        }
        return arr;
    };

    const [opt, setOpt] = useState();

    useEffect(() => {
        const timeout = setTimeout(() => {
            getAvailableStatuses();
            getAllStatuses();
        }, 500);
        if (!done && isSuccess) {
            if (allStatuses && availableStatuses) {
                setOpt(renderStatuses(allStatuses, availableStatuses));
            }
        }
        return () => clearTimeout(timeout);
    }, [done, isSuccess, data?.status]);

    return (
        <Box>
            {done ? (
                <InputSelect
                    label="Status porudžbine"
                    required={true}
                    name="status"
                    value={data.status ?? ""}
                    onChange={({ target }) => {
                        setData({ ...data, [target.name]: target.value });
                    }}
                    usePropName={false}
                    options={opt}
                    // fillFromApi={`${apiPath}/ddl/status`}
                    styleFormControl={{ ".MuiFormLabel-root": { fontSize: "0.875rem" }, "&.MuiFormControl-root": { marginTop: "0" } }}
                />
            ) : (
                <CircularProgress size={`1.5rem`} />
            )}
            {sendMail === "1" && data.status !== oldStatus && (
                <>
                    <InputCheckbox
                        label="Pošalji poruku kupcu"
                        name="send_to_customer"
                        value={data.send_to_customer ?? false}
                        onChange={({ target }) => {
                            setData({ ...data, [target.name]: target.checked });
                        }}
                    />
                    {data.send_to_customer && (
                        <InputHtml
                            label="Poruka"
                            name="content"
                            value={data.content ?? ""}
                            onChange={({ target }) => {
                                if (!loaded) {
                                    setOriginalMessage(target.value);
                                    setLoaded(true);
                                }
                                setData({ ...data, [target.name]: target.value });
                            }}
                        />
                    )}
                </>
            )}
            <Buttons>
                <Button
                    label="Istorija"
                    onClick={() => setOpenDialog({ show: true })}
                    sx={{
                        "@media (max-width: 500px)": {
                            minWidth: "fit-content !important",
                            padding: "0.2rem 0.5rem !important",
                        },
                    }}
                />
                <Button
                    label="Sačuvaj"
                    variant="contained"
                    onClick={formSubmitHandler}
                    disabled={data.status === oldStatus}
                    sx={{
                        "@media (max-width: 500px)": {
                            minWidth: "fit-content !important",
                            padding: "0.2rem 0.5rem !important",
                        },
                    }}
                />
            </Buttons>
            <HistoryModal openDialog={openDialog} setOpenDialog={setOpenDialog} apiPath={`${apiPath}/${orderId}`} />
        </Box>
    );
};

export default OrderStatus;
