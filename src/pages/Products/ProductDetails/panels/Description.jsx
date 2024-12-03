import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../../../components/shared/Form/Form";

import formFields from "../forms/description.json";
import AuthContext from "../../../../store/auth-contex";

const Description = ({ productId }) => {
    const init = {
        id: productId,
        short_description: null,
        description: null,
        id_manufacture: null,
        id_brand: null,
        stickers: null,
    };
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    const [data, setData] = useState(init);
    const apiPath = "admin/product-items/description";
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

    const handleData = () => {
        api.get(`${apiPath}/${productId}`)
            .then((response) => {
                let stickers = [];
                if (response?.payload.stickers) stickers = JSON.parse(response?.payload?.stickers);
                let res = { ...response?.payload, stickers: stickers };
                setData(res);
            })
            .catch((error) => console.warn(error));
    };

    const handleSubmit = (data) => {
        setIsLoadingOnSubmit(true);
        let req = {
            ...data,
            stickers: JSON.stringify(data.stickers),
        };

        api.post(`${apiPath}`, req)
            .then((response) => {
                let stickers = [];
                if (response?.payload.stickers) stickers = JSON.parse(response?.payload?.stickers);
                let res = { ...response?.payload, stickers: stickers };
                setData(res);
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

export default Description;
