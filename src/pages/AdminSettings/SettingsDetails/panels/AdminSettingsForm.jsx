import { useContext, useEffect, useState } from "react";
import Form from "../../../../components/shared/Form/Form";
import Loading from "../../../../components/shared/Loading/Loading";
import { toast } from "react-toastify";
import AuthContext from "../../../../store/auth-contex";

const AdminSettingsForm = ({ form_slug, config_module_id, module, submodule }) => {
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [isLoading, setIsLoading] = useState(false);

  const [formFields, setFormFields] = useState([]);
  const [formData, setFormData] = useState([]);

  const dataHandler = () => {
    setIsLoading(true);
    api.get(`admin/form/data/${form_slug}`)
      .then((response) => {
        setFormFields(response?.payload);

        setIsLoading(false);
      })
      .catch((error) => console.warn(error));
    api.get(`admin/configuration-admin/main/${module}/${submodule}`)
      .then((response) => setFormData(response?.payload))
      .catch((error) => console.warn(error));
  };

  useEffect(() => {
    dataHandler();
  }, []);

  const initialData = {};
  for (const item of formData?.items ?? []) {
    initialData[item.slug] = item.type === "image" ? item?.base64 : item?.value;
  }

  const submitHandler = (data) => {
    api.post(`admin/configuration-admin/main/${module}/${submodule}`, data)
      .then((response) => {
        setFormData(response?.payload)
        toast.success("Uspešno");
      })
      .catch((error) => console.warn(error));
  };
  return !isLoading ? <Form formFields={formFields} onSubmit={submitHandler} initialData={initialData} /> : <Loading />;
};

export default AdminSettingsForm;
