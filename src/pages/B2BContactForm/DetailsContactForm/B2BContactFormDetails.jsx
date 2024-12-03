import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";

import Form from "../../../components/shared/Form/Form";
import FormWrapper from "../../../components/shared/Layout/FormWrapper/FormWrapper";
import formFields from "./formFields.json";
import { useContext } from "react";
import AuthContext from "../../../store/auth-contex";

const B2BContactFormDetails = () => {
    const { id } = useParams();

    const navigate = useNavigate();

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/contact-form-b2b";

    const { data, isLoading } = useQuery(["ContactForm.details"], async () => {
        return await api.get(`${apiPath}/${id}`).then((response) => response?.payload);
    });

    return (
        <FormWrapper title={data?.first_name != null ? `Poruka od:${data?.first_name} ${data?.last_name}` : " "} back={() => navigate(-1)} ready={!isLoading}>
            <Form formFields={formFields} initialData={data} submitButton={false} />
        </FormWrapper>
    );
};

export default B2BContactFormDetails;
