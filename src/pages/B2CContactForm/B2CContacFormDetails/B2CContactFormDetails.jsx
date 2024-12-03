import { useQuery } from "react-query";
import { useNavigate, useParams } from "react-router-dom";

import Form from "../../../components/shared/Form/Form";
import FormWrapper from "../../../components/shared/Layout/FormWrapper/FormWrapper";

import formFields from "../tblFields.json";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../store/auth-contex";

const B2CContactFormDetails = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/contact-form-b2c";

    const { data, isLoading } = useQuery(["ContactForm.details"], async () => {
        return await api.get(`${apiPath}/${id}`).then((response) => response?.payload);
    });

    const [fields, setFields] = useState(formFields);
    useEffect(() => {
        if (data) {
            let fields = [...formFields];
            fields = fields.filter((item) => data[item.prop_name] !== null);
            setFields(fields);
        }
    }, [data]);

    return (
        <FormWrapper title={data?.customer_name != null ? `Poruka od: ${data?.customer_name}` : " "} back={() => navigate(-1)} ready={!isLoading}>
            <Form formFields={fields} initialData={data} submitButton={false} />
        </FormWrapper>
    );
};

export default B2CContactFormDetails;
