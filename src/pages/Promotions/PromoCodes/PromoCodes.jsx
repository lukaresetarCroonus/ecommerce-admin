import tblfields from "./tblFields.json";
import { useState } from "react";
import ListPage from "../../../components/shared/ListPage/ListPage";
import { useNavigate } from "react-router-dom";

const PromoCodes = () => {
    const [fields, setFields] = useState(tblfields);
    const navigate = useNavigate();
    const [rowData, setRowData] = useState(null);

    const buttons = [
        {
            type: "contained",
            label: "Novi unos",
            icon: "add",
            title: "Novi unos",
            action: () => {
                navigate("/promotions/promo-codes/new");
            },
        },
    ];
    const customActions = {
        edit: {
            type: "edit",
            display: true,
            clickHandler: {
                type: "navigate",
                fnc: (rowData) => {
                    navigate(`/promotions/promo-codes/${rowData.id}`);
                },
            },
        },
    };

    return (
        <ListPage
            title={` `}
            useColumnFields={true}
            listPageId={`PromoCodesList`}
            apiUrl={`admin/campaigns/promo-codes/list`}
            deleteUrl={`admin/campaigns/promo-codes/list`}
            showNewButton={false}
            columnFields={fields}
            additionalButtons={buttons}
            customActions={customActions}
        />
    );
};

export default PromoCodes;
