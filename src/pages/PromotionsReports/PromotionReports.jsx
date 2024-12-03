import { useNavigate } from "react-router-dom";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../helpers/functions";
import DetailsPage from "../../components/shared/ListPage/DetailsPage/DetailsPage";
import IconList from "../../helpers/icons";
import codesFields from "./forms/codes.json";
import ListPage from "../../components/shared/ListPage/ListPage";

const PromotionReports = () => {
    const activeTab = getUrlQueryStringParam("tab") ?? "promo_codes";
    const navigate = useNavigate();

    const fields = [
        {
            id: "promo_codes",
            name: "Promo kodovi",
            icon: IconList.list,
            enabled: true,
            component: (
                <ListPage apiUrl={`admin/reports/campaigns/promo-codes/cart-summary`} columnFields={codesFields} listPageId={`promo_codes_reports`} useColumnFields={true} showNewButton={false} />
            ),
        },
    ];

    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        navigate(`/reports/products?${queryString}`, { replace: true });
    };

    return <DetailsPage title={`Promocije`} fields={fields} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default PromotionReports;
