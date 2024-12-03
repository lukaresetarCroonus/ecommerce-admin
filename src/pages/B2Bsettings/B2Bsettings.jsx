import { useLocation } from "react-router-dom";
import ListPage from "../../components/shared/ListPage/ListPage";
import fields from "./tblFields.json";

const B2Bsettings = () => {
    const { pathname } = useLocation();

    const customActions = {
        edit: {
            clickHandler: {
                type: "navigate",
                fnc: (rowData) => {
                    return `${pathname}/${rowData.module}`;
                },
            },
        },
    };

    return (
        <ListPage
            listPageId="B2Bsettings"
            apiUrl="admin/configuration-b2b/main"
            title="B2B podešavanja"
            columnFields={fields}
            previewColumn="module"
            showNewButton={false}
            customActions={customActions}
        />
    );
};

export default B2Bsettings;
