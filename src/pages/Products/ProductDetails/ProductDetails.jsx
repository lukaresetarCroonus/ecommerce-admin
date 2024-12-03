import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Specification from "./ProductDetailsSpecification/Specification";
import ProductDetailsVariation from "./ProductDetailsVariation/ProductDetailsVariation";
import IconList from "../../../helpers/icons";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import Form from "../../../components/shared/Form/Form";
import Declaration from "./panels/Declaration";
import Seo from "./panels/Seo";
import Description from "./panels/Description";
import Prices from "./panels/Prices";

import basic_data from "./forms/basic_data.json";
import Inventories from "./panels/Inventories";
import Categories from "./panels/Categories";
import Gallery from "./panels/Gallery";
import Document from "./panels/Document";
import DisplayIn from "./panels/DisplayIn";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import AuthContext from "../../../store/auth-contex";
import DigitalMaterial from "./panels/DigitalMaterial";
import VariationDigitalMaterial from "./ProductDetailsVariation/VaritaionDigitalMaterial/VariationDigitalMaterial";

const ProductDetails = () => {
    const { prodId } = useParams();
    const navigate = useNavigate();
    const activeTab = getUrlQueryStringParam("tab") ?? "basic";
    const subtab = getUrlQueryStringParam("sub_tab");
    const variantId = getUrlQueryStringParam("variant_id");
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

    const init = {
        id: null,
        b2b_active: false,
        b2c_active: false,
        name: null,
        sku: null,
        barcode: null,
        new: false,
        new_from: null,
        new_to: null,
        order: 0,
        status: "on",
    };
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [data, setData] = useState(init);
    const [basicDataTemp, setBasicDataTemp] = useState(basic_data);

    const updateNewFieldsInDetails = (isNew, isDigital) => {
        setBasicDataTemp((old) => {
            return old.map((item) => {
                if (item.prop_name === "new_from" || item.prop_name === "new_to") {
                    item.in_details = isNew;
                }
                if (item.prop_name === "digital_type") {
                    item.in_details = isDigital;
                    item.required = isDigital;
                }

                if (item.prop_name === "using_to" || item.prop_name === "using_from") {
                    item.in_details = isDigital;
                }
                return item;
            });
        });
    };

    const handleSubmit = (data) => {
        setIsLoadingOnSubmit(true);
        let oldId = data.id;
        api.post(`admin/product-items/basic-data/`, data)
            .then((response) => {
                toast.success("Uspešno");
                setData(response?.payload);
                if (oldId === null) {
                    let tId = response?.payload?.id;
                    navigate(`/products/${tId}`, { replace: true });
                }
                setIsLoadingOnSubmit(false);
            })
            .catch((error) => {
                console.warn(error);
                toast.warning(error?.response?.data?.message ?? error?.response?.data?.payload?.message ?? "Greška");
                setIsLoadingOnSubmit(false);
            });
    };

    const handleData = () => {
        api.get(`admin/product-items/basic-data/${prodId}`)
            .then((response) => {
                setData(response?.payload);
                updateNewFieldsInDetails(response?.payload?.new, response?.payload?.is_digital);
            })
            .catch((error) => console.warn(error));
    };

    useEffect(() => {
        handleData();
    }, []);

    const validateData = (data, field) => {
        let ret = data;
        switch (field) {
            case "new":
            case "is_digital":
                updateNewFieldsInDetails(ret.new, ret.is_digital);
                return ret;

            default:
                return ret;
        }
    };

    const fields = [
        {
            id: "basic",
            name: "Osnovno",
            icon: IconList.inventory,
            enabled: true,
            component: <Form formFields={basicDataTemp} initialData={data} onSubmit={handleSubmit} validateData={validateData} isLoading={isLoadingOnSubmit} />,
        },
        {
            id: "description",
            name: "Opis",
            icon: IconList.description,
            enabled: data?.id,
            component: <Description productId={data?.id} />,
        },
        {
            id: "prices",
            name: "Cene",
            icon: IconList.money,
            enabled: data?.id,
            component: <Prices productId={data?.id} />,
        },
        {
            id: "lager",
            name: "Lager",
            icon: IconList.inventory2,
            enabled: data?.id,
            component: <Inventories productId={data?.id} />,
        },
        {
            id: "category",
            name: "Kategorije",
            icon: IconList.category,
            enabled: data?.id,
            component: <Categories productId={data?.id} />,
        },
        {
            id: "gallery",
            name: "Galerija",
            icon: IconList.browseGallery,
            enabled: data?.id,
            component: <Gallery productId={data?.id} />,
        },
        {
            id: "declaration",
            name: "Deklaracija",
            icon: IconList.editDocument,
            enabled: data?.id,
            component: <Declaration productId={data?.id} />,
        },
        {
            id: "seo",
            name: "SEO",
            icon: IconList.search,
            enabled: data?.id,
            component: <Seo productId={data?.id} />,
        },
        {
            id: "display",
            name: "Prikaz",
            icon: IconList.displaySettings,
            enabled: data?.id,
            component: <DisplayIn productId={data?.id} />,
        },
        { id: "digital_material", name: "Digitalni materijal", icon: IconList.download, enabled: data?.id, component: <DigitalMaterial productId={data?.id} /> },
        {
            id: "document",
            name: "Dokumenta",
            icon: IconList.documentScanner,
            enabled: data?.id,
            component: <Document productId={data?.id} />,
        },
        {
            id: "specifications",
            name: "Specifikacije",
            icon: IconList.checklist,
            enabled: data?.id,
            component: <Specification productId={data?.id} data={data} />,
        },
        {
            id: "variation",
            name: "Varijacije",
            icon: IconList.difference,
            enabled: data?.id,
            component:
                subtab === "digital_material" && variantId ? (
                    <VariationDigitalMaterial parentId={data?.id} variantId={variantId} />
                ) : (
                    <ProductDetailsVariation parentId={data?.id} isParentDigital={data?.is_digital} />
                ),
        },
    ];

    if (!data.is_digital) {
        fields.splice(fields.indexOf(fields.find((item) => item.id === "digital_material")), 1);
    }

    // Handle after click on tab panel
    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        const id = data.id == null ? "new" : data.id;
        navigate(`/products/${id}?${queryString}`, { replace: true });
    };

    return (
        <DetailsPage
            title={data?.id == null ? "Unos novog proizvoda" : data?.name}
            fields={fields}
            ready={[prodId === "new" || data?.id]}
            selectedPanel={activeTab}
            panelHandleSelect={panelHandleSelect}
        />
    );
};

export default ProductDetails;
