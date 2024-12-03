import { useNavigate } from "react-router-dom";
import IconList from "../../../helpers/icons";
import GroupAttributes from "./GroupAttributes/GroupAttributes";
import GroupValues from "./GroupValues/GroupValues";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";

const ProductVariantsAttributeDetails = () => {
    const activeTab = getUrlQueryStringParam("tab") ?? "attributes";
    const navigate = useNavigate();

    const fields = [
        {
            id: "attributes",
            name: "Atributi",
            icon: IconList.attribution,
            enabled: true,
            component: <GroupAttributes />,
        },
        {
            id: "attributes_values",
            name: "Vrednosti atributa",
            icon: IconList.list,
            enabled: true,
            component: <GroupValues />,
        },
    ];

    // Handle after click on tab panel
    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        navigate(`?${queryString}`, { replace: true });
    };

    return <DetailsPage title="Atributi za varijacije" fields={fields} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default ProductVariantsAttributeDetails;
