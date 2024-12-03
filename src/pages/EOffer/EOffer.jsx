import ListPage from "../../components/shared/ListPage/ListPage";
import fields from "./fields.json";
import { useEffect, useState } from "react";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import useAPI from "../../api/api";
import CircularProgress from "@mui/material/CircularProgress";

const EOffer = () => {
    const api = useAPI();
    const navigate = useNavigate();
    const [downloadLink, setDownloadLink] = useState(null);

    //POST za export e-ponude
    const { mutate: exportData, isLoading } = useMutation(
        ["export-eponuda-basic-data"],
        async () => {
            return await api
                .post("admin/export-eponuda/list")
                .then((res) => {
                    toast.success(`Uspešno pokrenut export e-ponude!`);
                    return res?.payload;
                })
                .catch((err) => {
                    toast.error(`Došlo je do greške prilikom exporta e-ponude!`);
                    console.log(err);
                });
        },
        {}
    );

    //GET za download e-ponude
    const getFile = useQuery(
        ["export-eponuda-download"],
        async () => {
            return await api
                .get("admin/export-eponuda/list")
                .then((res) => {
                    setDownloadLink(res?.payload);
                })
                ?.catch((err) => console.log(err));
        },
        { refetchOnWindowFocus: false, enabled: false }
    );

    //dugmad za download i export
    const additionalButtons = [
        {
            position: 1,
            action: () => {
                getFile.refetch();
            },
            icon: "download",
            disabled: getFile.isFetching || isLoading,
            title: "Preuzmi fajl",
            label: `${getFile.isFetching ? `Preuzimanje u toku...` : "Preuzmi fajl"}`,
        },
        {
            position: 2,
            action: () => {
                exportData();
            },
            disabled: isLoading || getFile.isFetching,
            icon: "upload",
            title: "Export E-ponude",
            label: `${isLoading ? `Export u toku...` : "Export e-ponude"}`,
        },
        {
            position: 3,
            action: () => {
                navigate("/eponuda/details?tab=addproducts");
            },
            icon: "add",
            title: "Označi",
            label: "Označi",
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

    return (
        <ListPage
            listPageId="Products"
            columnFields={fields}
            useColumnFields
            title={"E-ponuda - Lista proizvoda za export"}
            apiUrl="admin/export-eponuda/list"
            deleteUrl="admin/export-eponuda/list/"
            showNewButton={false}
            showAddButton={false}
            additionalButtons={additionalButtons}
        />
    );
};

export default EOffer;
