import tblFields from "./tblFields.json";
import { useEffect, useState } from "react";
import Form from "../../../../../components/shared/Form/Form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAPI from "../../../../../api/api";
import PageWrapper from "../../../../../components/shared/Layout/PageWrapper/PageWrapper";
import { useNavigate } from "react-router-dom";
import { deepClone } from "@mui/x-data-grid/utils/utils";

const Calculation = () => {
    const [fields, setFields] = useState(tblFields);
    const navigate = useNavigate();
    const [data, setData] = useState();
    const api = useAPI();
    const { pid } = useParams();

    const { mutate: onSubmit, isLoading } = useMutation(
        [pid, data],
        async (data) => {
            return await api
                .post(`admin/campaigns/promo-codes/calculations`, data)
                .then((res) => {
                    toast.success(`Uspešno!`);
                    refetch();
                })
                .catch((error) => {
                    toast.error(error.response?.data?.message || error.response?.data?.payload?.message || "Greška!");
                });
        },
        {}
    );

    const { data: calcInfo, refetch } = useQuery(
        [pid],
        async () => {
            return await api.get(`admin/campaigns/promo-codes/calculations/${pid}`).then((res) => {
                setData(res?.payload);
            });
        },
        { refetchOnWindowFocus: false }
    );

    const chageHandler = (data, fieldName) => {
        api.get(`admin/campaigns/promo-codes/calculations/ddl/currency?discount_type=${data.discount_type}`)
            .then((response) => {
                if (fieldName != "discount_type") {
                    return;
                }

                let discountTypeValue = data.discount_type;
                if (discountTypeValue == undefined) {
                    console.warn("Vrednost data.discount nije pronadjena!");
                    return;
                }

                let newFields = deepClone(fields);

                let currencyField = newFields.find((item) => item.prop_name === "currency");
                if (currencyField == undefined) {
                    console.warn("Polje currency nije pronadjeno!");
                    return;
                }

                const queryString = `discount_type=${discountTypeValue}`;

                currencyField.queryString = queryString;

                let newData = { ...data };
                newData.currency = "";
                if (response.payload.length === 2) {
                    newData.currency = response.payload[1].id;
                }
                setData(newData);
                setFields(newFields);
            })
            .catch((error) => {
                console.log(error);
            });
    };

    useEffect(() => {
        if (data && data.discount_type) {
            api.get(`admin/campaigns/promo-codes/calculations/ddl/currency?discount_type=${data.discount_type}`)
                .then((response) => {
                    let discountTypeValue = data.discount_type;
                    if (discountTypeValue == undefined) {
                        console.warn("Vrednost data.discount nije pronadjena!");
                        return;
                    }

                    let newFields = deepClone(fields);

                    let currencyField = newFields.find((item) => item.prop_name === "currency");
                    if (currencyField == undefined) {
                        console.warn("Polje currency nije pronadjeno!");
                        return;
                    }

                    const queryString = `discount_type=${discountTypeValue}`;

                    currencyField.queryString = queryString;

                    setFields(newFields);
                })
                .catch((error) => {
                    console.log(error);
                });
        }
    }, [data]);

    return <Form formFields={fields} initialData={data} onSubmit={(data) => onSubmit(data)} isLoading={isLoading} onChange={chageHandler} />;
};

export default Calculation;
