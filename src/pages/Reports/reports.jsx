import tblFields from "./fields.json";
import ListPage from "../../components/shared/ListPage/ListPage";
import DetailsPage from "../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../helpers/functions";
import IconList from "../../helpers/icons";
import Form from "../../components/shared/Form/Form";
import basic_data from "../Companies/CompaniesDetails/forms/basic_data.json";
import { useNavigate } from "react-router-dom";

export const Reports = () => {
    const activeTab = getUrlQueryStringParam("tab") ?? "low-stock";
    const navigate = useNavigate();

    const customActions = {
        edit: {
            type: "edit",
            display: true,
            clickHandler: {
                type: "navigate",
                fnc: ({ id, attributes_text }) => {
                    if (attributes_text) {
                        navigate(`/products/${id}?tab=variation`);
                    } else {
                        navigate(`/products/${id}?tab=lager`);
                    }
                },
            },
        },
        delete: {
            display: false,
        },
    };

    const fields = [
        {
            id: "low-stock",
            name: "Male količine",
            icon: IconList.inventory,
            enabled: true,
            component: (
                <ListPage customActions={customActions} apiUrl={`admin/reports/products/low-stock`} columnFields={tblFields} listPageId={`reports`} useColumnFields={true} showNewButton={false} />
            ),
        },
    ];

    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        navigate(`/reports/products?${queryString}`, { replace: true });
    };

    return <DetailsPage title={`Proizvodi`} fields={fields} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};
