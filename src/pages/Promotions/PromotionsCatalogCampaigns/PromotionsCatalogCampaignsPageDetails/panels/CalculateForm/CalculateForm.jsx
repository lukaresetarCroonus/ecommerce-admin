import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import calc from "../../forms/calc.json"
import Form from "../../../../../../components/shared/Form/Form";
import { deepClone } from "@mui/x-data-grid/utils/utils";
import { toast } from "react-toastify";
import AuthContext from "../../../../../../store/auth-contex";


const CalculateForm = ({ campaignId }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const { nid } = useParams();
  const apiPath = "admin/campaigns/product-catalog/calculations";
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
        toast.warning("Greška");
        setIsLoadingOnSubmit(false);
      });
  };

  const chageHandler = (data, fieldName) => {
    api.get(`admin/campaigns/product-catalog/calculations/ddl/currency?discount_type=${data.discount_type}`)
      .then((response) => {

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
        if (response.payload.length === 2) {
          newData.currency = response.payload[1].id;
        }
        setData(newData);
        setFormFields(newFields);

      })
      .catch((error) => {
        console.log(error);
      })
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