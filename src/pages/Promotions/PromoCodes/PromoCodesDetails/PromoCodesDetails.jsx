import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import IconList from "../../../../helpers/icons";
import DetailsPage from "../../../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../../helpers/functions";
import Basic from "./Basic/Basic";
import Codes from "./Codes/Codes";
import CodesList from "./Codes/CodesList";
import Calculation from "./Calculation/Calculation";
import Conditions from "./Conditions/Conditions";

const PromoCodesDetails = () => {
    const activeTab = getUrlQueryStringParam("tab");
    const navigate = useNavigate();
    const { pid } = useParams();
    const fields = [
        {
            id: "basic",
            name: "Osnovno",
            icon: IconList.inventory,
            enabled: true,
            component: <Basic />,
            title: "Osnovno",
        },
        {
            id: "codes",
            name: "Kodovi",
            icon: IconList.code,
            enabled: pid !== "new",
            component: <CodesList />,
            title: "Kodovi",
        },
        {
            id: "conditions",
            name: "Uslovi",
            icon: IconList.settings,
            enabled: pid !== "new",
            component: <Conditions />,
            title: "Uslovi",
        },
        {
            id: "calculation",
            name: "Obračun",
            icon: IconList.money,
            enabled: pid !== "new",
            component: <Calculation />,
            title: "Obračun",
        },
    ];

    // Handle after click on tab panel
    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        navigate(`?${queryString}`, { replace: true });
    };

    return <DetailsPage title={`Unos novog promo koda`} fields={fields} selectedPanel={activeTab ?? "basic"} panelHandleSelect={panelHandleSelect} />;
};

export default PromoCodesDetails;
