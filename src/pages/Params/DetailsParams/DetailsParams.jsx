import { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";

import ParamsForm from "./ParamsForm/ParamsForm";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import ListPage from "../../../components/shared/ListPage/ListPage";
import long_text from "./forms/long_text.json";
import number from "./forms/number.json";
import date from "./forms/date.json";
import datetime from "./forms/datetime.json";
import image from "./forms/image.json";
import image_description from "./forms/image_description.json";
import slug from "./forms/slug.json";
import status from "./forms/status.json";
import actions from "./forms/actions.json"
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import AuthContext from "../../../store/auth-contex";



const ParamsDetails = () => {

  const init = {
    id: null,
    field_type: null,
    field_is_multiple: false,
    field_description: null,
    slug: null,
    name: null,
    int_value: null,
    text_value: null,
    datetime_value: null,
    title: null,
    subtitle: null,
    description: null,
    image: null,
    button: null,
    target: null,
    url: null,
    active_from: null,
    active_to: null,
    system_required: null,
    status: "on",
  };

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const { pid } = useParams();
  const [data, setData] = useState(init);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const activeTab = getUrlQueryStringParam("tab") ?? 'basic';

  const apiPath = "admin/params/values";

  const onSubmit = (data) => {
    let oldId = data.id;
    api.post(`admin/params/main/`, { ...init, ...data })
      .then((response) => {
        toast.success("Uspešno");
        setData(response?.payload);

        if (oldId === null) {
          let tId = response?.payload?.id;
          navigate(`/params/${tId}`, { replace: true });
        }
      })
      .catch((error) => {
        toast.warning("Greška");
        console.warn(error);
      });
  };

  const onChange = (data) => {
    setData(data);
  };

  const handleGetData = async () => {
    setIsLoading(true);
    await api
      .get(`admin/params/main/${pid}`)
      .then((response) => {
        setData(response?.payload);
      })
      .catch((error) => {
        console.warn(error);
      });
    setIsLoading(false);
  };

  useEffect(() => {
    handleGetData();
  }, []);


  const getParamSubForm = (form) => {
    if (data.field_is_multiple && form) {
      return [];
    }
    switch (data.field_type) {
      case "long_text":
        return long_text;
      case "number":
        return number;
      case "date":
        return date;
      case "datetime":
        return datetime;
      case "image":
        return image;
      case "image_description":
        return image_description;
      default:
        return [];
    }
  };

  const fields = data.field_is_multiple
    ? [
      {
        id: "basic",
        name: "Osnovno",
        icon: "settings",
        enabled: true,
        component: <ParamsForm onSubmit={onSubmit} data={data} onChange={onChange} subForm={getParamSubForm(true)} isLoading={isLoading} />,
      },
      {
        id: "values",
        name: "Vrednosti",
        icon: "settings",
        enabled: data?.id,
        component: <ListPage apiUrl={`${apiPath}/${pid}`} editUrl={`${apiPath}`} deleteUrl={`${apiPath}`} columnFields={[slug, ...getParamSubForm(false), status, actions]} addFieldLabel="Dodajte vrednost" title=" " showAddButton={true} actionNewButton="modal" initialData={{ id_params: pid }} />,
      },
    ]
    : [
      {
        id: "basic",
        name: "Osnovno",
        icon: "settings",
        enabled: true,
        component: <ParamsForm onSubmit={onSubmit} data={data} onChange={onChange} subForm={getParamSubForm(true)} isLoading={isLoading} />,
      },
    ];

  // Handle after click on tab panel
  const panelHandleSelect = (field) => {
    let queryString = setUrlQueryStringParam("tab", field.id);
    const id = data.id == null ? "new" : data.id;
    navigate(`/params/${id}?${queryString}`, { replace: true });
  }

  return <DetailsPage title={data?.id == null ? "Unos novog parametra" : data?.name} fields={fields} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default ParamsDetails;
