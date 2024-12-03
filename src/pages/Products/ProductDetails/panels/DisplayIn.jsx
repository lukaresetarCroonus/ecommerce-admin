import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../../../components/shared/Form/Form";

// import formFields from "../forms/display_in.json";
import AuthContext from "../../../../store/auth-contex";

const DisplayIn = ({ productId }) => {
    const init = {
        display_in_section_super_action: null,
        display_in_section_top_sellers: null,
        display_in_section_best_sell: null,
        display_in_section_new_arrival: null,
        display_in_section_action: null,
        display_in_section_sale: null,
        display_in_section_recommendation: null,
        display_in_section_position: null,
        b2b_display_in_section_recommendation: null,
    };
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    const [data, setData] = useState(init);
    const apiPath = "admin/product-items/display-in-section";
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

    const handleData = () => {
        api.get(`${apiPath}/${productId}`)
            .then((response) => {
                setData(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const handleSubmit = (data) => {
        setIsLoadingOnSubmit(true);
        api.post(`${apiPath}`, data)
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

    const [formFields, setFormFields] = useState([]);

    useEffect(() => {
        api.get("admin/form/data/admin_product_items_display_in")
            .then((response) => {
                setFormFields(response?.payload);
            })
            .catch((error) => console.error(error));
    }, []);

    return <Form formFields={formFields} initialData={data} onSubmit={handleSubmit} isLoading={isLoadingOnSubmit} />;
};

export default DisplayIn;
