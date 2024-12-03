import { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import Form from "../../../components/shared/Form/Form";
import { toast } from "react-toastify";
import IconList from "../../../helpers/icons";
import HeadOffice from "./panels/HeadOffice";
import Contact from "./panels/Contact";
import Notes from "./panels/Notes";
import basic_data from "./forms/basic_data.json";
import AnalitycsData from "./panels/AnalitycsData";
import SalesOfficers from "./panels/SalesOfficers";
import UsersPanel from "./panels/UsersPanel";
import DeliveryAddress from "./panels/DeliveryAddress";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import RebateScales from "./panels/RebateScales";
import AuthContext from "../../../store/auth-contex";
import { Rebates } from "./panels/Rebates";

const CompaniesDetails = () => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    const { comId } = useParams();
    const navigate = useNavigate();
    const activeTab = getUrlQueryStringParam("tab") ?? "basic";

    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

    const init = {
        id: null,
        id_category_product_groups: 0,
        parent_id: null,
        slug: "",
        name: "",
        order: 0,
        active: 1,
    };

    const [data, setData] = useState(init);

    const handleSubmit = (data) => {
        setIsLoadingOnSubmit(true);

        let oldId = data.id;
        api.post(`admin/customers-b2b/basic-data/`, data)

            .then((response) => {
                setData(response?.payload);
                toast.success("Uspešno");
                setIsLoadingOnSubmit(false);
                if (oldId === null) {
                    let tId = response?.payload?.id;
                    navigate(`/b2b-companies/${tId}`, { replace: true });
                }
            })
            .catch((error) => {
                console.warn(error);
                toast.warn("Greška");
                setIsLoadingOnSubmit(false);
            });
    };

    const handleData = () => {
        api.get(`admin/customers-b2b/basic-data/${comId}`)
            .then((response) => setData(response?.payload))
            .catch((error) => console.warn(error));
    };

    useEffect(() => {
        handleData();
    }, []);

    const fields = [
        {
            id: "basic",
            name: "Osnovno",
            icon: IconList.dataThresholding,
            enabled: true,
            component: <Form formFields={basic_data} initialData={data} onSubmit={handleSubmit} isLoading={isLoadingOnSubmit} />,
        },
        {
            id: "location",
            name: "Sedište",
            icon: IconList.locationCity,
            enabled: data?.id,
            component: <HeadOffice companyId={comId} />,
        },
        {
            id: "delivery_address",
            name: "Adresa dostave",
            icon: IconList.locationCity,
            enabled: data?.id,
            component: <DeliveryAddress companyId={comId} data={data} />,
        },
        {
            id: "contact",
            name: "Kontakt",
            icon: IconList.contactPage,
            enabled: data?.id,
            component: <Contact companyId={comId} />,
        },
        {
            id: "rebates",
            name: "Rabati",
            icon: IconList.percent,
            enabled: data?.id,
            component: <Rebates companyId={comId} />,
        },
        {
            id: "rebate-scales",
            name: "Rabatne skale",
            icon: IconList.percent,
            enabled: data?.id,
            component: <RebateScales companyId={comId} />,
        },
        {
            id: "analytics",
            name: "Analitika",
            icon: IconList.analytics,
            enabled: data?.id,
            component: <AnalitycsData companyId={comId} />,
        },
        {
            id: "notes",
            name: "Napomene",
            icon: IconList.note,
            enabled: data?.id,
            component: <Notes companyId={comId} />,
        },
        {
            id: "commercialists",
            name: "Komercijalista",
            icon: IconList.person,
            enabled: data?.id,
            component: <SalesOfficers companyId={comId} />,
        },
        {
            id: "users",
            name: "Korisnici",
            icon: IconList.naturePeople,
            enabled: data?.id,
            component: <UsersPanel companyId={comId} />,
        },
    ];

    // Handle after click on tab panel
    const panelHandleSelect = (field) => {
        let queryString = setUrlQueryStringParam("tab", field.id);
        const id = data.id == null ? "new" : data.id;
        navigate(`/b2b-companies/${id}?${queryString}`, { replace: true });
    };

    return <DetailsPage title={data?.id == null ? "Unos nove kompanije" : data?.name} fields={fields} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default CompaniesDetails;
