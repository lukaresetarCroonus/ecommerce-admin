import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../../../components/shared/Form/Form";

import formFields from "./formFields.json";
import AuthContext from "../../../../store/auth-contex";

const DetailsDisplayIn = ({ cid }) => {
    const init = {
        display_in_section_recommendation: null,
    };
    const [data, setData] = useState(init);
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/category-product/display-in-section";
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

    const handleData = () => {
        api.get(`${apiPath}/${cid}`)
            .then((response) => {
                setData(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const handleSubmit = (data) => {
        setIsLoadingOnSubmit(true);
        api.post(`${apiPath}`, { ...data, id: cid })
            .then((response) => {
                setData(response?.payload);
                toast.success("Uspešno");
                setIsLoadingOnSubmit(false);
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
                setIsLoadingOnSubmit(false);
            });
    };

    useEffect(() => {
        handleData();
    }, []);

    return <Form formFields={formFields} initialData={data} onSubmit={handleSubmit} isLoading={isLoadingOnSubmit} />;
};

export default DetailsDisplayIn;
