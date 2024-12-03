import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import IconList from "../../../helpers/icons";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import Form from "../../../components/shared/Form/Form";
import basic_data from "../tblFields.json";
import InputFields from "./panels/InputFields";
import AuthContext from "../../../store/auth-contex";
import {toast} from "react-toastify";

const AdminFormDetails = () => {

  const init = {
    id: null,
    slug: "",
    module: "",
    submodule: "",
    method: "",
    action_url: "",
    description: "",
    order: 0,
  };

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const { formId } = useParams();
  const [data, setData] = useState(init);
  const [isLoading, setIsLoading] = useState(false);
  const apiPath = "admin/forms";

  const getData = async () => {
    setIsLoading(true);
    await api
      .get(`${apiPath}/${formId}`)
      .then((response) => {
        setData(response?.payload);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  };

  const submitHandler = (data) => {
    // setIsLoadingOnSubmit(true);
    let oldId = data.id;
    api.post(apiPath, data)
      .then((response) => {
        setData(response?.payload);
        if (oldId === null) {
          let tId = response?.payload?.id;
          navigate(`/admin-form/${tId}`, { replace: true });
        }
        toast.success("Uspešno");

        // setIsLoadingOnSubmit(false);
      })
      .catch((error) => {
        console.warn(error);
          toast.warning(error.response.data.message ?? error?.response?.data?.payload?.message ?? "Greška");
        // setIsLoadingOnSubmit(false);
      });
  };

  useEffect(() => {
    getData();
  }, []);

  const fields = [
    {
      name: "Osnovno",
      icon: IconList.attribution,
      enabled: true,
      component: <Form formFields={basic_data} initialData={data} onSubmit={submitHandler} />,
    },
    {
      name: "Input polja",
      icon: IconList.list,
      enabled: data?.id,
      component: <InputFields groupId={data?.id} />,
    },
  ];

  return <DetailsPage title={data?.id != null && data?.name} fields={fields} ready={!isLoading} />;
};

export default AdminFormDetails;
