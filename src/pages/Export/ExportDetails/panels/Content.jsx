import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Buttons from "../../../../components/shared/Form/Buttons/Buttons";
import Button from "../../../../components/shared/Button/Button";
import { rotateMatrix } from "../../../../helpers/data";
import Table from "../../../../components/shared/Table/Table";

import Check from "@mui/icons-material/Check";
import CircularProgress from "@mui/material/CircularProgress";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import AuthContext from "../../../../store/auth-contex";
import { useQuery } from "react-query";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import { useLocation, useNavigate } from "react-router-dom";

const Content = ({ id, file }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const getExport = "admin/export/content";
    const postExportExecute = "admin/export/content";

    const [dataExport, setDataExport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
    const [offset, setOffset] = useState(1);
    const [insert, setInsert] = useState(false);
    const navigate = useNavigate();
    //search iz URL
    const { search } = useLocation();
    const searchParams = new URLSearchParams(search);
    const searchValue = searchParams.get("search");

    // The selected mapping by the user
    const [mapping, setMapping] = useState({});
    const updateMapping = (event) => setMapping({ ...mapping, [event.target.name]: event.target.value });
    const submitHandler = (data) => {
        setIsLoadingOnSubmit(true);
        api.post(postExportExecute, {
            id_admin_export_set: id,
            search: searchValue,
            filters: null,
        })
            .then((response) => {
                toast.success("Uspešno ste izvezli dokument!");
                setIsLoadingOnSubmit(false);
                navigate("/export");
            })
            .catch((error) => {
                toast.error("Došlo je do greške prilikom izvoza dokumenta!");
                setIsLoadingOnSubmit(false);
            });
    };

    const { data: tableStructure, isFetching } = useQuery(["tableStructure", id], async () => {
        return await api.get(`admin/export/content/table-structure/${id}`).then((res) => res?.payload);
    });

    return (
        <>
            {isFetching ? (
                <CircularProgress />
            ) : (
                <>
                    <ListPage showNewButton={false} apiUrl={`${getExport}/${id}`} columnFields={tableStructure} title="Sadržaj" />
                    <Buttons styleWrapperButtons={{ alignItems: "end" }}>
                        {/* <Button icon={<Check />} label={isLoadingOnSubmit ? <CircularProgress size="1.5rem" /> : "Uvezi dokument"} onClick={() => submitHandler({ offset: offset })} variant="contained" /> */}
                        <Button icon={<Check />} label={isLoading ? <CircularProgress size="1.5rem" /> : "Potvrdi izvoz"} onClick={submitHandler} variant="contained" />
                    </Buttons>
                </>
            )}
        </>
    );
};

export default Content;
