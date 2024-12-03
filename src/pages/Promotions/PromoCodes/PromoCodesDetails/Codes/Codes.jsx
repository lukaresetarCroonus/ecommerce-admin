import tblFields from "./tblFields.json";
import { useEffect, useState } from "react";
import Form from "../../../../../components/shared/Form/Form";
import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import useAPI from "../../../../../api/api";
import PageWrapper from "../../../../../components/shared/Layout/PageWrapper/PageWrapper";
import { useNavigate } from "react-router-dom";
import Button from "../../../../../components/shared/Button/Button";
const Codes = () => {
    const [fields, setFields] = useState(tblFields);
    const navigate = useNavigate();
    const [data, setData] = useState({});

    const api = useAPI();

    const { pId } = useParams();
    const { mutate: onSubmit, isLoading } = useMutation(
        ["createPromoCode"],
        async (data) => {
            return await api
                .post(`admin/campaigns/promo-codes/codes`, data)
                .then((res) => {
                    toast.success(`Uspešno!`);
                    navigate(`/promotions/promo-codes/${pId}?tab=codes`);
                })
                .catch((error) => {
                    toast.error(error.response?.data?.payload?.message || error.response?.data?.message || "Greška!");
                });
        },
        {}
    );

    const { data: codesInfo, refetch } = useQuery(
        ["campaignInfo", pId],
        async () => {
            return await api.get(`admin/campaigns/promo-codes/codes/new/${pId}`).then((res) => {
                setData({ ...res?.payload, quantity: null, id_campaign: pId });
            });
        },
        {}
    );

    const { data: generatedCode, refetch: getCode } = useQuery(
        ["newCode"],
        async () => {
            return await api.get(`admin/campaigns/promo-codes/codes/generate`).then((res) => {
                setData({ ...data, code: res?.payload?.code });
            });
        },
        { enabled: false }
    );

    useEffect(() => {
        if (data?.type === "multiple") {
            let temp;
            temp = fields.find((f) => f?.prop_name === "quantity");
            temp.editable = true;
            temp.in_main_table = true;
            temp.required = true;

            let temp2;
            temp2 = fields.find((f) => f?.prop_name === "code");
            temp2.editable = false;
            temp2.in_main_table = false;

            setFields([...fields]);
        } else {
            let temp;
            temp = fields.find((f) => f?.prop_name === "quantity");
            temp.editable = false;
            temp.in_main_table = false;

            let temp2;
            temp2 = fields.find((f) => f?.prop_name === "code");
            temp2.editable = true;
            temp2.in_main_table = true;

            setFields([...fields]);
        }
    }, [data]);

    return (
        <PageWrapper title={`Unos novog promo koda`} back>
            <Form
                formFields={fields}
                onChange={(ret) => {
                    setData({
                        ...data,
                        ...ret,
                    });
                }}
                submitButton={false}
                initialData={data}
                isLoading={isLoading}
            />
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                }}
            >
                {data?.type === "single" && (
                    <Button
                        label="Generiši kod"
                        variant="contained"
                        onClick={() => {
                            getCode();
                        }}
                    />
                )}
                <div
                    style={{
                        alignSelf: "flex-end",
                        marginLeft: "auto",
                    }}
                >
                    <Button
                        label={"Sačuvaj"}
                        variant="contained"
                        onClick={() => {
                            onSubmit(data);
                        }}
                        disabled={isLoading}
                    />
                </div>
            </div>
        </PageWrapper>
    );
};

export default Codes;
