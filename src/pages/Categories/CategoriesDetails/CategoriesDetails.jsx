import { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import Form from "../../../components/shared/Form/Form";
import IconList from "../../../helpers/icons";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import DetailsSeo from "./DetailsSeo/DetailsSeo";

import formFields from "./formFields.json";
import DetailsDisplayIn from "./DetailsDisplayIn/DetailsDisplayIn";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import AuthContext from "../../../store/auth-contex";
import { useQuery } from "react-query";

const CategoriesDetails = () => {
    const { gid, cid } = useParams();

    const init = {
        id: null,
        name: null,
        slug: null,
        parent_id: null,
        image: null,
        icon: null,
        description: null,
        short_description: null,
        status: "on",
    };

    const [data, setData] = useState(init);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
    const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/category-product/categories";
    const navigate = useNavigate();
    const activeTab = getUrlQueryStringParam("tab") ?? "basic";
    const [isDone, setIsDone] = useState(false);
    const [apiPathCrop, setApiPathCrop] = useState(null);

    const fetchInformationImageIcon = async () => {
        try {
            const response = await api.get("admin/category-product/categories/options/upload?field=icon");
            return response.payload;
        } catch (error) {
            console.log(error);
        }
    };
    const handleInformationImageImage = (field, prop_name) => {
        api.get(`admin/category-product/categories/options/upload?field=${field}`)
            .then((response) => {
                formatFormFields(response?.payload, field);
                const interval = setInterval(() => {
                    setIsDone(true);
                }, 500);
                return () => clearInterval(interval);
            })
            .catch((error) => console.warn(error));
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

    const handleSubmit = (data) => {
        setIsLoadingOnSubmit(true);

        let oldId = data.id;
        api.post(apiPath, { ...data, id_category_product_groups: gid })
            .then((response) => {
                setData(response?.payload);
                toast.success("Uspešno");
                if (oldId === null) {
                    let tId = response?.payload?.id;
                    navigate(`/product-categories/category/${gid}/${tId}`, { replace: true });
                }
                setIsLoadingOnSubmit(false);
            })
            .catch((error) => {
                console.warn(error);
                toast.warning("Greška");
                setIsLoadingOnSubmit(false);
            });
    };

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

    useEffect(() => {
        handleData();
    }, []);

    const formatFormFields = (data, prop_name) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = formFieldsTemp.map((field) => {
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
            setFormFieldsTemp([...arr]);
        }
    };

    useEffect(() => {
        isDone && handleInformationImageImage("image");
    }, [isDone]);

    const [propName, setPropName] = useState(null);

    const fields = [
        {
            id: "basic",
            name: "Osnovno",
            icon: IconList.inventory,
            enabled: true,
            component: (
                <Form
                    formFields={formFieldsTemp}
                    initialData={data}
                    onSubmit={handleSubmit}
                    queryString={`id_category_product_groups=${gid}&id_category_product=${data?.id}`}
                    isLoading={isLoadingOnSubmit}
                    apiPathCrop={apiPathCrop}
                    setPropName={setPropName}
                />
            ),
        },
        {
            id: "seo",
            name: "Seo",
            icon: IconList.search,
            enabled: data?.id,
            component: <DetailsSeo cid={data?.id} />,
        },
        {
            id: "display",
            name: "Prikaz",
            icon: IconList.displaySettings,
            enabled: data?.id,
            component: <DetailsDisplayIn cid={data?.id} />,
        },
        /* 
        Specifikacija za kategoriju se ne koristi pa je zbog toga sakrivena
    {
        name: "Specifikacija",
        icon: "settings",
        enabled: data?.id,
        component: <DetailsSpecification cid={data?.id} gid={gid} />,
    }, */
    ];

    // Handle after click on tab panel
    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        const id = data.id == null ? "new" : data.id;
        navigate(`/product-categories/category/${gid}/${id}?${queryString}`, { replace: true });
    };

    return <DetailsPage title={data?.id == null ? "Unos nove kategorije" : data?.name} fields={fields} ready={!isLoading} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default CategoriesDetails;
