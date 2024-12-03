import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import IconList from "../../../helpers/icons";
import Form from "../../../components/shared/Form/Form";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";

import Payments from "./panels/Payments";
import Delivery from "./panels/Delivery";

import basic_data from "./forms/basic_data.json";
import AuthContext from "../../../store/auth-contex";

const B2CCustomersDetails = () => {
  const { cid } = useParams();
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const apiPath = "admin/customers-b2c/profile";
  const navigate = useNavigate();
  const activeTab = getUrlQueryStringParam("tab") ?? 'basic';

  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

  const handleData = async () => {
    setIsLoading(true);
    api.get(`${apiPath}/${cid}`)
      .then((response) => {
        setData(response?.payload);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  };



  const saveData = async (data) => {
    setIsLoadingOnSubmit(true);
    let oldId = data.id;
    api.post(apiPath, { ...data, id_customer: data.id })
      .then((response) => {
        setData(response?.payload);
        toast.success("Uspešno");

        if (oldId === null) {
          let tId = response?.payload?.id;

          navigate(`/b2c-customers/${tId}`, { replace: true });
        }
        setIsLoadingOnSubmit(false);
      })
      .catch((error) => {
        console.warn(error);
        toast.warning("Greška");
        setIsLoadingOnSubmit(false);
      });
  };

  useEffect(() => {
    handleData();
  }, []);


  const fields = [
    {
      id: "basic",
      name: "Profil",
      icon: IconList.inventory,
      enabled: true,
      component: <Form formFields={basic_data} initialData={data} onSubmit={saveData} isLoading={isLoadingOnSubmit} />,
    },
    {
      id: "payments",
      name: "Plaćanja",
      icon: IconList.payments,
      enabled: data?.id,
      component: <Payments customerId={data?.id} data={data} />,
    },
    {
      id: "delivery",
      name: "Dostava",
      icon: IconList.localShipping,
      enabled: data?.id,
      component: <Delivery customerId={data?.id} />,
    },
  ];

  // Handle after click on tab panel
  const panelHandleSelect = (field) => {
    let queryString = setUrlQueryStringParam("tab", field.id);
    const id = data.id == null ? "new" : data.id;
    navigate(`/b2c-customers/${id}?${queryString}`, { replace: true });
  }

  return <DetailsPage title={data?.id == null ? "Unos novog kupca" : data?.first_name + " " + data?.last_name} fields={fields} ready={[cid === "new" || data?.id]} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default B2CCustomersDetails;
