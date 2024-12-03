import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import IconList from "../../../helpers/icons";
import Form from "../../../components/shared/Form/Form";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import Columns from "./panels/Columns";
import Content from "./panels/Content";
import basic_data from "./forms/basic_data.json";
import AuthContext from "../../../store/auth-contex";
import useAPI from "../../../api/api";

const ExportDetails = () => {
    const { exId } = useParams();
    const authCtx = useContext(AuthContext);
    const api = useAPI();
    const apiPath = "admin/export/basic-data";
    const activeTab = getUrlQueryStringParam("tab") ?? "basic";
    const navigate = useNavigate();

    const [isBasicData, setBasicData] = useState(basic_data);

    const init = {
        id: null,
        export_type: false,
        export_options: false,
        export_file_type: null,
        filename: null,
    };

    const [data, setData] = useState(init);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
    //file csv:
    const [file, setFile] = useState(null);

    const handleData = async () => {
        setIsLoading(true);
        api.get(`${apiPath}/${exId}`)
            .then((response) => {
                setData(response?.payload);
                setFile({ name: response?.payload?.filename });
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
        api.post(apiPath, data)
            .then((response) => {
                navigate(`/export/${response?.payload?.id}?tab=columns`, { replace: true });

                setData(response?.payload);
                if (oldId === null) {
                    let tId = response?.payload?.id;
                }
                toast.success("Uspešno");
                setIsLoadingOnSubmit(false);
            })
            .catch((error) => {
                console.warn(error);
                toast.warn(error.response.data.message ?? error?.response?.data?.payload?.message ?? "Greška");
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
            id: "columns",
            name: "Kolone",
            icon: IconList.viewColumn,
            enabled: true,
            component: <Columns id={exId} />,
        },
        {
            id: "content",
            name: "Sadržaj",
            icon: IconList.contentPasteSearch,
            enabled: true,
            component: <Content file={file} id={data?.id} />,
        },
    ];

    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        const id = data.id == null ? "new" : data.id;
        navigate(`/export/${id}?${queryString}`, { replace: true });
    };

    return <DetailsPage title={`Izvoz`} fields={fields} ready={!isLoading} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default ExportDetails;
