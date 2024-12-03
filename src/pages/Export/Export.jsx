import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";
import { useQuery } from "react-query";
import useAPI from "../../api/api";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Export = () => {
    const api = useAPI();
    const [fileId, setFileId] = useState({
        id_file: null,
        id_row: null,
    }); //id fajla koji se skida [downloadFile]
    const [file, setFile] = useState(null);
    const downloadFile = useQuery(
        ["downloadFile", fileId.id_row, fileId.id_file],
        async () => {
            return await api
                .get(`admin/export/list/${fileId?.id_file}`)
                .then((res) => {
                    setFile(res?.payload);
                    setFileId({
                        id_file: null,
                        id_row: null,
                    });
                })
                .catch((error) => {
                    setFile(null);
                    setFileId({
                        id_file: null,
                        id_row: null,
                    });
                    toast.error(error.response?.data?.message);
                });
        },
        { refetchOnWindowFocus: false, enabled: false }
    );

    const customActions = {
        delete: {
            type: "delete",
            display: false,
        },
        edit: {
            type: "edit",
            display: false,
        },
        download: {
            type: "custom",
            display: true,
            position: 2,
            icon: "download",
            title: "Preuzmite dokument",
            clickHandler: {
                type: "",
                fnc: (rowData) => {
                    setFileId({
                        id_file: rowData?.id_file,
                        id_row: rowData?.id,
                    });
                },
            },
        },
    };
    useEffect(() => {
        if (fileId?.id_row) {
            downloadFile.refetch();
        }
    }, [fileId?.id_row]);

    const navigate = useNavigate();
    useEffect(() => {
        if (file) {
            const a = document.createElement("a");
            a.href = file?.file_base64;
            a.download = file?.file_name;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            setFile(null);
        }
    }, [file]);

    const buttons = [
        {
            type: "contained",
            label: "Izvezi",
            title: "Izvezi",

            action: () => {
                navigate("/export/new");
            },
        },
    ];

    return (
        <ListPage
            showNewButton={false}
            additionalButtons={buttons}
            listPageId="Export"
            apiUrl="admin/export/list"
            title="Izvoz podataka iz fajla"
            columnFields={tblFields}
            customActions={customActions}
        />
    );
};

export default Export;
