import tblFields from "../Codes/tblFields.json";
import { useState, useEffect } from "react";
import ListPage from "../../../../../components/shared/ListPage/ListPage";
import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import useAPI from "../../../../../api/api";
import { setUrlQueryStringParam } from "../../../../../helpers/functions";

const CodesList = () => {
    const api = useAPI();
    const [formFields, setFormFields] = useState(tblFields);
    const { pid } = useParams();

    const customActions = {
        edit: {
            display: false,
        },
    };

    const [downloadLink, setDownloadLink] = useState(null);
    const [isExporting, setIsExporting] = useState(false);

    const startExport = async () => {
        setIsExporting(true);
        await api
            .post("admin/campaigns/promo-codes/export", {
                campaign_id: pid,
            })
            .then((res) => {
                checkExport();
                return res?.payload;
            })
            .catch((err) => {
                toast.error(`Došlo je do greške prilikom pokretanja exporta promo kodova!`);
                console.warn(err);
                setIsExporting(false);
            });
    };

    const checkExport = async (idExport = -1) => {
        let downloadStarted = false;
        await api
            .get(`admin/campaigns/promo-codes/export/info/${pid}/${idExport}`)
            .then((res) => {
                idExport = res?.payload?.id_export;
                if (res?.payload.download_enabled) {
                    downloadStarted = true;
                    startDownload(idExport);
                }
                let checkTimeout;
                if (checkTimeout) {
                    clearTimeout(checkTimeout);
                }
                if (!downloadStarted) {
                    checkTimeout = setTimeout(() => checkExport(idExport), 2 * 1000);
                }
            })
            .catch((error) => {
                console.warn(error);
                toast.error(`Došlo je do greške prilikom provere exporta promo kodova!`);
                setIsExporting(false);
                return;
            });
    };

    const startDownload = async (idExport) => {
        await api
            .get(`admin/campaigns/promo-codes/export/file/${pid}/${idExport}`)
            .then((res) => {
                setDownloadLink(res?.payload);
            })
            .catch((err) => {
                toast.error(`Došlo je do greške prilikom preuzimanja promo kodova!`);
                console.warn(err);
            });

        setIsExporting(false);
    };

    const buttons = [
        {
            position: 0,
            action: startExport,
            icon: "download",
            disabled: isExporting,
            title: "Preuzmi promo kodove",
            label: `${isExporting ? `Preuzimanje u toku...` : "Preuzmi promo kodove"}`,
        },
    ];

    //download fajla: appendujemo a tag u DOM, pa ga kliknemo, a onda ga uklonimo
    useEffect(() => {
        if (downloadLink) {
            const a = document.createElement("a");
            a.href = downloadLink?.file_base64;
            a.download = downloadLink?.file_name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setDownloadLink(null);
        }
    }, [downloadLink]);

    const navigate = useNavigate();
    const {} = useQuery(
        ["campaignInfoGetSystem", pid],
        async () => {
            return await api.get(`admin/campaigns/product-catalog/basic-data/${pid}`).then((res) => {
                if (res?.payload?.system) {
                    let queryString = setUrlQueryStringParam("system", res?.payload?.system);
                    navigate(`?${queryString}`, { replace: true });
                }
            });
        },
        {}
    );

    return (
        <ListPage
            title={` `}
            useColumnFields={true}
            listPageId={`promo-codes-campaigns-list`}
            apiUrl={`admin/campaigns/promo-codes/codes/${pid}`}
            deleteUrl={`admin/campaigns/promo-codes/codes`}
            columnFields={tblFields}
            showNewButton={true}
            additionalButtons={buttons}
            customActions={customActions}
        />
    );
};

export default CodesList;
