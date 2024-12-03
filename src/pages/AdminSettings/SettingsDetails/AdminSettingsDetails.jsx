import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import IconList from "../../../helpers/icons";
import AdminSettingsForm from "./panels/AdminSettingsForm";
import AuthContext from "../../../store/auth-contex";

const AdminSettingsDetails = () => {
    const { AdminId } = useParams();

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/configuration-admin/main";

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        api.list(`${apiPath}/${AdminId}`)
            .then((response) => {
                setData(response?.payload);
                setIsLoading(false);
            })
            .catch((error) => {
                console.warn(error);
                setIsLoading(false);
            });
    }, []);

    const fields = (data?.items ?? []).map((panel) => {
        return {
            name: panel?.name,
            icon: IconList.settings,
            enabled: true,
            component: <AdminSettingsForm key={panel?.id} form_slug={panel?.form_slug} module={panel?.module} submodule={panel?.submodule} config_module_id={panel?.id} />,
        };
    });

    return <DetailsPage adminSettings={true} title={AdminId} fields={fields.length > 0 ? fields : [{}]} ready={!isLoading} />;
};

export default AdminSettingsDetails;
