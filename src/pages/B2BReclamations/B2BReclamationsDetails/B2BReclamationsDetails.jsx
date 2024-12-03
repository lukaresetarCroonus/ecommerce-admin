import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import IconList from "../../../helpers/icons";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import Items from "./panels/Items";
import Comments from "./panels/Comments";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import AuthContext from "../../../store/auth-contex";
import Basic from "./panels/Basic";

const B2BReclamationsDetails = () => {
    const { rid } = useParams();
    const navigate = useNavigate();
    const activeTab = getUrlQueryStringParam("tab") ?? "basic";

    const init = {
        id: null,
        slug: null,
        id_company: null,
        id_company_user: null,
        reclamation_token: null,
        company_sinhro_id: null,
        company_name: null,
        company_pib: null,
        company_maticni_broj: null,
        company_address: null,
        company_object_number: null,
        company_floor: null,
        company_apartment_number: null,
        company_id_town: null,
        company_town_name: null,
        company_town_display_name: null,
        company_zip_code: null,
        company_id_municipality: null,
        company_municipality_name: null,
        company_id_country: null,
        company_country_name: null,
        user_first_name: null,
        user_last_name: null,
        user_phone: null,
        user_email: null,
        note: null,
        order: null,
        status: null,
        created_at: null,
    };

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [data, setData] = useState(init);

    const handleData = () => {
        api.get(`admin/reclamations-b2b/basic-data/${rid}`)
            .then((response) => {
                setData(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    useEffect(() => {
        handleData();
    }, []);

    const onClickUpdateData = (newData) => {
        setData(newData);
    };

    const fields = [
        {
            id: "basic",
            name: "Osnovno",
            icon: IconList.inventory,
            enabled: true,
            component: <Basic data={data} rId={data.id} onClickUpdateData={onClickUpdateData} />,
        },
        {
            id: "items",
            name: "Stavke",
            icon: IconList.category,
            enabled: data?.id,
            component: <Items rId={data.id} basicData={data} />,
        },
        {
            id: "comments",
            name: "Komentari",
            icon: IconList.comment,
            enabled: data?.id,
            component: <Comments rId={data.id} />,
        },
    ];

    // Handle after click on tab panel
    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        const id = data.id == null ? "new" : data.id;
        navigate(`/b2b-reclamations/${id}?${queryString}`, { replace: true });
    };

    return (
        <DetailsPage
            title={data?.id == null ? "Unos nove reklamacije" : data?.slug}
            fields={fields}
            ready={[rid === "new" || data?.id]}
            selectedPanel={activeTab}
            panelHandleSelect={panelHandleSelect}
        />
    );
};

export default B2BReclamationsDetails;
