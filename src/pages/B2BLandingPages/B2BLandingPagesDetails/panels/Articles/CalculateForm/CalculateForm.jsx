import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import calc from "../../forms/calc.json"
import Form from "../../../../../../components/shared/Form/Form";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { toast } from "react-toastify";
import AuthContext from "../../../../../../store/auth-contex";


const CalculateForm = ({ campaignId }) => {

  const { nid } = useParams();
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const apiPath = "admin/landing-pages-b2b/calculations";
  const [formFields, setFormFields] = useState(calc);

  const init = {
    id_campaign: campaignId,
    currency: null,
    discount_type: null,
    discount_value: null
  };

  const [data, setData] = useState(init);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

  const saveData = async (data) => {
    setIsLoadingOnSubmit(true);
    api.post(apiPath, data)
      .then((response) => {
        setData(response?.payload);
        toast.success("Uspešno");
        setIsLoadingOnSubmit(false);
      })
      .catch((error) => {
        console.warn(error);
          toast.warning(error.response.data.message ?? error?.response?.data?.payload?.message ?? "Greška");

          setIsLoadingOnSubmit(false);
      });
  };

  const chageHandler = (data, fieldName) => {

    if (fieldName != "discount_type") {
      return;
    }

    let discountTypeValue = data.discount_type;
    if (discountTypeValue == undefined) {
      console.warn("Vrednost data.discount nije pronadjena!");
      return;
    }

    let newFields = deepClone(formFields);

    let currencyField = newFields.find((item) => item.prop_name === "currency")
    if (currencyField == undefined) {
      console.warn("Polje currency nije pronadjeno!");
      return;
    }

    const queryString = `discount_type=${discountTypeValue}`;

    currencyField.queryString = queryString

    let newData = { ...data };
    newData.currency = "0";
    setData(newData);
    setFormFields(newFields);
  }

  useEffect(() => {
    setIsLoading(true);
    api.get(`${apiPath}/${nid}`)
      .then((response) => {
        setData(response?.payload);

        if (response?.payload?.id) {
          if (response?.payload?.discount_type == undefined) {
            console.warn("Vrednost data.discount nije pronadjena!");
            return;
          }

          let newFields = deepClone(formFields);
          let currencyField = newFields.find((item) => item.prop_name === "currency")
          if (currencyField == undefined) {
            console.warn("Polje currency nije pronadjeno!");
            return;
          }

          const queryString = `discount_type=${response?.payload?.discount_type}`;
          currencyField.queryString = queryString;

          setFormFields(newFields);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  }, []);



  return <Form formFields={formFields} initialData={data} onSubmit={saveData} onChange={chageHandler} isLoading={isLoadingOnSubmit} />;
}

export default CalculateForm;
