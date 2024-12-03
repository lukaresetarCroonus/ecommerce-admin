import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";

import formFields from "./formField.json";
import { toast } from "react-toastify";
import Form from "../../../components/shared/Form/Form";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import IconList from "../../../helpers/icons";
import RolesListPanel from "./RolesListPanel";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import AuthContext from "../../../store/auth-contex";

const RolesDetailsPage = () => {
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const { roleId } = useParams();
  const init = {
    id: null,
    screen: null,
    name: null,
  };
  const apiPath = "admin/roles/main";
  const [data, setData] = useState(init);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
  const navigate = useNavigate();
  const activeTab = getUrlQueryStringParam("tab") ?? 'basic';


  const handleData = async () => {
    setIsLoading(true);
    await api
      .get(`${apiPath}/${roleId}`)
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
    api.post(apiPath, data)
      .then((response) => {
        setData(response?.payload);
        toast.success(`Uspešno`);

        if (oldId === null) {
          let tId = response?.payload?.id;
          navigate(`/roles/${tId}`, { replace: true });
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
      name: "Osnovno",
      icon: IconList.dataThresholding,
      enabled: true,
      component: <Form formFields={formFields} initialData={data} onSubmit={saveData} isLoading={isLoadingOnSubmit} />,
    },
    {
      id: "pages",
      name: "Stranice",
      icon: IconList.screenShare,
      enabled: data?.id,
      component: <RolesListPanel roleId={data?.id} />,
    },
  ];

  // Handle after click on tab panel
  const panelHandleSelect = (field) => {
    let queryString = setUrlQueryStringParam("tab", field.id);
    const id = data.id == null ? "new" : data.id;
    navigate(`/roles/${id}?${queryString}`, { replace: true });
  }

  return <DetailsPage title={data?.id == null ? "Unos nove uloge" : data?.name} fields={fields} ready={!isLoading} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default RolesDetailsPage;
