import { useContext, useEffect, useState } from "react";
import Form from "../../../../components/shared/Form/Form";
import formFields from "../forms/rebate.json";
import { toast } from "react-toastify";
import AuthContext from "../../../../store/auth-contex";
import { useQuery } from "react-query";

const RebateScales = ({ companyId }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [data, setData] = useState({ rebate_tier_id: null });
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

    const handleData = () => {
        api.get(`admin/customers-b2b/rebate-tiers/${companyId}`)
            .then((response) => setData(response?.payload))
            .catch((error) => console.warn(error));
    };

    const { data: message, refetch } = useQuery(
        [companyId],
        async () => {
            return await api
                .get(`admin/customers-b2b/rebate-tiers/allow-use/${companyId}`)
                .then((res) => res?.payload)
                ?.catch((err) => console.warn(err));
        },
        { refetchOnWindowFocus: false }
    );

    const saveData = (data) => {
        setIsLoadingOnSubmit(true);
        api.post(`admin/customers-b2b/rebate-tiers/${companyId}`, data)
            .then((response) => {
                setData(response?.payload);
                toast.success("Uspešno");
                setIsLoadingOnSubmit(false);
                refetch();
            })
            .catch((error) => {
                console.warn(error);
                toast.warn(error?.response?.data?.payload?.message);
                setIsLoadingOnSubmit(false);
            });
    };

    useEffect(() => {
        handleData();
    }, []);



    return (
        <>
            {message?.status === false && <p>{message?.message}</p>}

            <Form formFields={formFields} initialData={data} onSubmit={saveData} isLoading={isLoadingOnSubmit} />
        </>
    );
};

export default RebateScales;
