import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../../../components/shared/Form/Form";

import formFields from "../forms/declaration.json";
import AuthContext from "../../../../store/auth-contex";

const Declaration = ({ productId }) => {
  const init = {
    id_product: productId,
    declaration_id_manufacture: null,
    declaration_id_country: null,
    declaration_name: null,
    declaration_note: null,
    declaration_year: null,
    declaration_importer_name: null,
    declaration_importer_id: null,
  };

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const [data, setData] = useState(init);
  const apiPath = "admin/product-items/declaration";
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

  const handleData = () => {
    api.get(`${apiPath}/${productId}`)
      .then((response) => setData(response?.payload))
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

  return <Form formFields={formFields} initialData={data} onSubmit={handleSubmit} isLoading={isLoadingOnSubmit} />;
};

export default Declaration;
