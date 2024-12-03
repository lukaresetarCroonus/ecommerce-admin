import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../../../components/shared/Form/Form";
import formFields from "../forms/analitics.json";
import AuthContext from "../../../../store/auth-contex";

const AnalitycsData = ({ companyId }) => {
  const init = {
    id_company: companyId,
    saldo: null,
    debt_in_currency: null,
    debt_out_currency: null,
    credit_limit: null,
    debt_days: null,
  };
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [data, setData] = useState(init);

  const apiPath = "admin/customers-b2b/analytics-data";
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

  const handleData = () => {
    api.get(`${apiPath}/${companyId}`)
      .then((response) => setData(response?.payload))
      .catch((error) => console.warn(error));
  };

  const saveData = (data) => {
    setIsLoadingOnSubmit(true);
    api.post(`${apiPath}`, { ...data, id_company: companyId })
      .then((response) => {
        setData(response?.payload);
        toast.success("Uspešno");
        setIsLoadingOnSubmit(false);
      })
      .catch((error) => {
        console.warn(error);
        toast.warn("Greška");
        setIsLoadingOnSubmit(false);
      });
  };

  useEffect(() => {
    handleData();
  }, []);
  return <Form formFields={formFields} initialData={data} onSubmit={saveData} isLoading={isLoadingOnSubmit} />;
};

export default AnalitycsData;
