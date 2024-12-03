import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import IconList from "../../../helpers/icons";
import Form from "../../../components/shared/Form/Form";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";

import Gallery from "./panels/Gallery";
import Seo from "./panels/Seo";

import basic_data from "./forms/basic_data.json";
import Articles from "./panels/Articles/Articles";
import Thumbs from "./panels/Thumbs";
import AuthContext from "../../../store/auth-contex";

const B2CLandingPagesDetails = () => {
    const { lid } = useParams();
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/landing-pages-b2c/basic-data";
    const navigate = useNavigate();
    const activeTab = getUrlQueryStringParam("tab") ?? "basic";

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
    const [formFieldsTmp, setFormFieldsTmp] = useState(basic_data);

    const handleData = async () => {
        setIsLoading(true);
        api.get(`${apiPath}/${lid}`)
            .then((response) => {
                setData(response?.payload);
                setIsLoading(false);
            })
            .catch((error) => {
                console.warn(error);
                setIsLoading(false);
            });
    };
    const [fileTypes, setFileTypes] = useState([]);

    const handleInformationImage = () => {
        api.get(`admin/landing-pages-b2c/basic-data/options/upload`)
            .then((response) => {
                formatFormFields(response?.payload);
                setFileTypes(response?.payload?.allow_format);
            })
            .catch((error) => console.warn(error));
    };

    const saveData = async (data) => {
        setIsLoadingOnSubmit(true);
        let oldId = data.id;
        api.post(apiPath, { ...data })
            .then((response) => {
                setData(response?.payload);
                toast.success("Uspešno");

                if (oldId === null) {
                    let tId = response?.payload?.id;

                    navigate(`/b2c-landingpages/${tId}`, { replace: true });
                }
                setIsLoadingOnSubmit(false);
            })
            .catch((error) => {
                console.warn(error);
                toast.warning("Greška");
                setIsLoadingOnSubmit(false);
            });
    };

    const formatFormFields = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = basic_data.map((field) => {
                if (field?.prop_name === "image") {
                    return {
                        ...field,
                        description: descripiton,
                        validate: {
                            imageUpload: data,
                        },
                        ui_prop: {
                            fileUpload: data,
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
        handleData();
    }, []);

    useEffect(() => {
        handleInformationImage();
    }, []);

    const fields = [
        {
            id: "basic",
            name: "Osnovno",
            icon: IconList.inventory,
            enabled: true,
            component: (
                <Form
                    formFields={formFieldsTmp}
                    initialData={data}
                    onSubmit={saveData}
                    isLoading={isLoadingOnSubmit}
                    apiPathCrop={`admin/landing-pages-b2c/basic-data/options/crop`}
                    allowedFileTypes={fileTypes}
                />
            ),
        },
        {
            id: "gallery",
            name: "Galerija",
            icon: IconList.browseGallery,
            enabled: data?.id,
            component: <Gallery pageId={data?.id} apiPathForCrop={`admin/landing-pages-b2c/gallery/options/crop`} allowedFileTypes={fileTypes} isArray={true}/>,
        },
        {
            id: "articles",
            name: "Artikli",
            icon: IconList.article,
            enabled: data?.id,
            component: <Articles pageId={data?.id} />,
        },
        {
            id: "thumbs",
            name: "Thumbs",
            icon: IconList.image,
            enabled: data?.id,
            component: <Thumbs pageId={data?.id} />,
        },
        {
            id: "seo",
            name: "SEO",
            icon: IconList.search,
            enabled: data?.id,
            component: <Seo pageId={data?.id} />,
        },
    ];

    // Handle after click on tab panel
    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        const id = data.id == null ? "new" : data.id;
        navigate(`/b2c-landingpages/${id}?${queryString}`, { replace: true });
    };

    return (
        <DetailsPage
            title={data?.id == null ? "Unos nove promo stranice" : data?.name}
            fields={fields}
            ready={[lid === "new" || data?.id]}
            selectedPanel={activeTab}
            panelHandleSelect={panelHandleSelect}
        />
    );
};

export default B2CLandingPagesDetails;
