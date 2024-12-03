import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import IconList from "../../helpers/icons";
import DetailsPage from "../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../helpers/functions";
import PromotionsCatalogCampaigns from "./PromotionsCatalogCampaigns/PromotionsCatalogCampaigns";
import PromotionsCartSummary from "./PromotionsCartSummary/PromotionsCartSummary";
import PromotionsDeliveryCampaigns from "./PromotionsDeliveryCampaigns/PromotionsDeliveryCampaigns";
import PromotionsRecommended from "./PromotionsRecommended/PromotionsRecommended";
import PromotionsUpSells from "./PromotionsUpSells/PromotionsUpSells";
import PromotionsCrossSells from "./PromotionsCrossSells/PromotionsCrossSells";
import PromoCodes from "./PromoCodes/PromoCodes";

const Promotions = () => {
    const activeTab = getUrlQueryStringParam("tab") ?? "products";
    const navigate = useNavigate();

    const fields = [
        {
            id: "products",
            name: "Proizvodi",
            icon: IconList.inventory,
            enabled: true,
            component: <PromotionsCatalogCampaigns />,
            title: "Promocije za proizvode",
        },
        {
            id: "cart_summary_campaigns",
            name: "Iznos u korpi",
            icon: IconList.requestQuote,
            enabled: true,
            component: <PromotionsCartSummary />,
            title: "Promocije za iznos u korpi",
        },
        {
            id: "delivery_campaigns",
            name: "Dostava",
            icon: IconList.localShipping,
            enabled: true,
            component: <PromotionsDeliveryCampaigns />,
            title: "Promocije za dostavu",
        },
        {
            id: "reccomended",
            name: "Preporučeni",
            icon: IconList.list,
            enabled: true,
            component: <PromotionsRecommended />,
            title: "Preporučeni proizvodi",
        },
        {
            id: "up_sells",
            name: "Up-sells",
            icon: IconList.attribution,
            enabled: true,
            component: <PromotionsUpSells />,
            title: "Up-sells proizvodi",
        },
        {
            id: "cross_sells",
            name: "Cross-sells",
            icon: IconList.list,
            enabled: true,
            component: <PromotionsCrossSells />,
            title: "Cross-sells proizvodi",
        },
        {
            id: "promo_codes",
            name: "Promo kodovi",
            icon: IconList.list,
            enabled: true,
            component: <PromoCodes />,
            title: "Promo kodovi",
        },
    ];

    const [pageTitle, setPageTitle] = useState(`${fields.find((field) => field.id === activeTab)?.name}`);

    // Handle after click on tab panel
    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        navigate(`?${queryString}`, { replace: true });
        setPageTitle(`${field.title}`);
    };

    return <DetailsPage title={pageTitle} fields={fields} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default Promotions;
