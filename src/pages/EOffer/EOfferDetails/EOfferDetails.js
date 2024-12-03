import { useNavigate } from "react-router-dom";

import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import AddCategories from "../AddCategories/AddCategories";
import RemoveCategories from "../RemoveCategories/RemoveCategories";
import AddProducts from "../AddProducts/AddProducts";
import RemoveProducts from "../RemoveProducts/RemoveProducts";
const EOfferDetails = () => {
    const navigate = useNavigate();
    const activeTab = getUrlQueryStringParam("tab") ?? "basic";

    const panels = [
        {
            id: "addproducts",
            name: "Dodaj proizvode",
            icon: "add",
            enabled: true,
            component: <AddProducts activeTab={activeTab} />,
        },
        {
            id: "removeproducts",
            name: "Obriši proizvode",
            icon: "remove",
            enabled: true,
            component: <RemoveProducts activeTab={activeTab} />,
        },
        {
            id: "addcategories",
            name: "Dodaj kategorije",
            icon: "add",
            enabled: true,
            component: <AddCategories activeTab={activeTab} />,
        },
        {
            id: "removecategories",
            name: "Obriši kategorije",
            icon: "remove",
            enabled: true,
            component: <RemoveCategories activeTab={activeTab} />,
        },
    ];

    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        navigate(`/eponuda/details?${queryString}`, { replace: true });
    };

    return <DetailsPage title={`E-ponuda`} fields={panels} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default EOfferDetails;
