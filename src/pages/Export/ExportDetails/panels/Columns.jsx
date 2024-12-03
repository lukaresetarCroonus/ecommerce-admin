import React, { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-contex";
import { InputCheckbox } from "../../../../components/shared/Form/FormInputs/FormInputs";
import { useQuery } from "react-query";
import Button from "../../../../components/shared/Button/Button";
import classes from "../../../EOffer/AddProducts/styles.module.css";
import CircularProgress from "@mui/material/CircularProgress";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Columns = ({ id }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const apiPathExport = "admin/export/connect";
    const apiPathExportPost = "admin/export/columns";
    const [dataModalContent, setDataModalContent] = useState([]);

    const [dataExport, setDataExport] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [isChecked, setIsChecked] = useState([]);
    // const handleData = async () => {
    //     setIsLoading(true);
    //     api.put(`${getImport}/${id}`)
    //         .then((response) => {
    //             setDataImport(response?.payload);
    //             console.log(dataImport);
    //             setIsLoading(false);
    //         })
    //         .catch((error) => {
    //             console.warn(error);
    //             setIsLoading(false);
    //         });
    // };
    //
    const navigate = useNavigate();
    const submitHandler = (data) => {
        setIsLoading(true);
        api.post(apiPathExportPost, {
            id_admin_export_set: id,
            columns: data?.map((item) => item?.id),
        })
            .then((response) => {
                console.log(response);
                toast.success("Uspešno!");
                setIsLoading(false);
                navigate(`/export/${id}?tab=content`, { replace: true });
            })
            .catch((error) => {
                toast.error("Došlo je do greške!");
                setIsLoading(false);
            });
    };

    const { data } = useQuery(
        ["export", id],
        async () => {
            return await api.get(`admin/export/columns/${id}`).then((res) => setDataModalContent(res?.payload));
        },
        {
            refetchOnWindowFocus: false,
        }
    );

    const handleCheckboxChange = (event) => {
        const { name, checked, id } = event.target;
        if (checked) {
            setIsChecked((prevChecked) => [
                ...prevChecked,
                {
                    name: name,
                    id: id,
                },
            ]);
        } else {
            setIsChecked((prevChecked) => prevChecked.filter((item) => item.id !== id));
        }
    };

    const selectAll = () => {
        if (isChecked?.length === dataModalContent?.length) {
            setIsChecked([]);
        } else {
            setIsChecked(dataModalContent?.map((item) => ({ name: item.name, id: item.id })));
        }
    };

    return (
        <>
            <div style={{ display: "flex", justifyContent: "flex-end", borderBottom: "1px solid", borderBottomColor: "lightgray" }}>
                <InputCheckbox
                    value={isChecked?.length === dataModalContent?.length}
                    onChange={selectAll}
                    id="selectAll"
                    name="selectAll"
                    label="Selektuj sve"
                    styleCheckbox={{ padding: "0 0.563rem 0 0.563rem" }}
                />
            </div>
            {dataModalContent?.map((item) => {
                const isCheckedItem = Boolean(isChecked.find((el) => el.id === item.id));
                return (
                    <InputCheckbox
                        onChange={handleCheckboxChange}
                        key={item.id}
                        id={item?.id}
                        name={item.name}
                        label={item.name}
                        styleCheckbox={{ padding: "0 0.563rem 0 0.563rem" }}
                        value={isCheckedItem}
                    />
                );
            })}
            <div
                style={{
                    marginTop: "2rem",
                    marginLeft: "auto",
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Button
                    disabled={isLoading}
                    onClick={() => submitHandler(isChecked)}
                    label={isLoading ? <CircularProgress size="1.5rem" /> : "Sačuvaj"}
                    variant={`contained`}
                    className={classes.button}
                ></Button>
            </div>
        </>
    );
};

export default Columns;
