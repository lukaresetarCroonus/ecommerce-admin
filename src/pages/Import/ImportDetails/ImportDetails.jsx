import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import IconList from "../../../helpers/icons";
import Form from "../../../components/shared/Form/Form";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import Connection from "./panels/Connection";

import basic_data from "./forms/basic_data.json";
import AuthContext from "../../../store/auth-contex";

const ImportDetails = () => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const { upId } = useParams();
  const apiPath = "admin/import/basic-data";
  const activeTab = getUrlQueryStringParam("tab") ?? 'basic';
  const navigate = useNavigate();

  const [isBasicData, setBasicData] = useState(basic_data);

  const init = {
    id: null,
    import_type: false,
    import_options: false,
    import_file_type: null,
    filename: null,
  };

  const [data, setData] = useState(init);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
  //file csv:
  const [file, setFile] = useState(null);

  const handleData = async () => {
    setIsLoading(true);
    api.get(`${apiPath}/${upId}`)
      .then((response) => {
        setData(response?.payload);
        setFile({ name: response?.payload?.filename })
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  };

  const submitHandler = (data) => {
    setIsLoadingOnSubmit(true);
    let oldId = data.id;
    api.post(apiPath, { ...data, file: file.base_64 })
      .then((response) => {
        setData(response?.payload);
        console.log("dataaa", data)
        if (oldId === null) {
          let tId = response?.payload?.id;
          navigate(`/import/${tId}`, { replace: true });
        }
        toast.success("Uspešno");
        setIsLoadingOnSubmit(false);
      })
      .catch((error) => {
        console.warn(error);
        toast.warn(error.response.data.message);
        setIsLoadingOnSubmit(false);
      });
  };

  useEffect(() => {
    handleData();
  }, []);

  useEffect(() => {
    setBasicData((prevBasicData) =>
      prevBasicData.map((item) => {
        if (data.id !== null) {
          return {
            ...item,
            disabled: true,
          };
        }
        return item;
      })
    );
  }, [data.id]);

  const fields = [
    {
      id: "basic",
      name: "Osnovno",
      icon: IconList.inventory,
      enabled: true,
      component: <Form formFields={isBasicData} initialData={data} onSubmit={submitHandler} isLoading={isLoadingOnSubmit} onFilePicked={setFile} selectedFile={file} />,
    },
    {
      id: "connection",
      name: "Povezivanje",
      icon: IconList.settingsEthernet,
      enabled: data?.id,
      component: <Connection file={file} id={data?.id} />,
    },
  ];

  const panelHandleSelect = (field) => {
    let queryString = setUrlQueryStringParam("tab", field.id);
    const id = data.id == null ? "new" : data.id;
    navigate(`/import/${id}?${queryString}`, { replace: true });
  }




  return <DetailsPage title={data?.id == null ? "Unos nove stranice" : file?.name} fields={fields} ready={!isLoading} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default ImportDetails;
