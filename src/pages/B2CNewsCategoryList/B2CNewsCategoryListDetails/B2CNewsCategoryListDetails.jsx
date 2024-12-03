import { useState, useEffect, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Form from "../../../components/shared/Form/Form";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import IconList from "../../../helpers/icons";

import formFields from "./formFields.json";
import Seo from "./panels/Seo";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import AuthContext from "../../../store/auth-contex";
import { useQuery } from "react-query";

const B2CNewsCategoryListDetails = () => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const { cid } = useParams();
    const apiPath = "admin/news-b2c/category/basic-data";
    const navigate = useNavigate();
    const activeTab = getUrlQueryStringParam("tab") ?? "basic";
    const [formFieldsTmp, setFormFieldsTmp] = useState(formFields);
    const [fileTypes, setFileTypes] = useState([]);
    const [isDone, setIsDone] = useState(false); // TODO: Remove this state
    const init = {
        id: null,
        slug: null,
        name: null,
        image: null,
        short_description: null,
        description: null,
        parent_id: null,
        category_path: null,
    };

    const [data, setData] = useState(init);
    const [isLoading, setIsLoading] = useState(false);

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
        setIsLoading(true);
        api.post(apiPath, { ...data, image: data.image })
            .then((response) => {
                setData(response?.payload);
                setIsLoading(false);
                toast.success("Uspešno");
            })
            .catch((error) => {
                console.warn(error);
                toast.warning("Greška");
            });
    };

    const fetchInformationImageIcon = async () => {
        try {
            const response = await api.get("admin/news-b2c/category/basic-data/options/upload?field=icon");
            return response.payload;
        } catch (error) {
            console.log(error);
        }
    };

    const { data: iconInfo } = useQuery(["informationImageIcon"], fetchInformationImageIcon, {
        onSuccess: (data) => {
            formatFormFields(data, "icon");
            const interval = setInterval(() => {
                setIsDone(true);
            }, 1000);
            return () => clearInterval(interval);
        },
        onError: (error) => console.warn(error),
    });

    const handleInformationImageImage = () => {
        api.get(`admin/news-b2c/category/basic-data/options/upload?field=image`)
            .then((response) => {
                formatFormFields(response?.payload, "image");
            })
            .catch((error) => console.warn(error));
    };

    const formatFormFields = (data, prop_name) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = formFieldsTmp.map((field) => {
                if (field?.prop_name === prop_name) {
                    return {
                        ...field,
                        description: descripiton,
                        validate: {
                            imageUpload: data,
                        },
                        ui_prop: {
                            fileUpload: {
                                ...field?.ui_prop?.fileUpload,
                                allow_format: allow_format,
                                allow_size: allow_size,
                                image: {
                                    width: image?.width,
                                    height: image?.height,
                                },
                            },
                        },
                        dimensions: { width: image?.width, height: image?.height },
                    };
                } else {
                    return {
                        ...field,
                    };
                }
            });
            setFormFieldsTmp([...arr]);
        }
    };

    useEffect(() => {
        isDone && handleInformationImageImage();
    }, [isDone]);

    useEffect(() => {
        handleData();
    }, []);

    const fields = [
        {
            id: "basic",
            name: "Osnovno",
            icon: IconList.category,
            enabled: true,
            component: <Form formFields={formFieldsTmp} initialData={data} onSubmit={saveData} apiPathCrop={`admin/news-b2c/category/basic-data/options/crop`} isLoading={isLoading} />,
        },
        {
            id: "seo",
            name: "Seo",
            icon: IconList.search,
            enabled: data?.id,
            component: <Seo categoryId={data?.id} />,
        },
    ];

    // Handle after click on tab panel
    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        const id = data.id == null ? "new" : data.id;
        navigate(`/b2c-news/category/${id}?${queryString}`, { replace: true });
    };

    return <DetailsPage title={data?.id == null ? "Unos nove kategorije" : data?.name} fields={fields} ready={!isLoading} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default B2CNewsCategoryListDetails;
