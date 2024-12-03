import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import IconList from "../../../helpers/icons";
import B2CSettingsForm from "./panels/B2CSettingsForm";
import AuthContext from "../../../store/auth-contex";

const B2CSettingsDetails = () => {
    const { B2CId } = useParams();

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPath = "admin/configuration-b2c/main";

    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        setIsLoading(true);
        api.list(`${apiPath}/${B2CId}`)
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
            component: <B2CSettingsForm key={panel?.id} form_slug={panel?.form_slug} module={panel?.module} submodule={panel?.submodule} config_module_id={panel?.id} />,
        };
    });
    return <DetailsPage adminSettings={true} title={B2CId} fields={fields.length > 0 ? fields : [{}]} ready={!isLoading} />;
};

export default B2CSettingsDetails;
