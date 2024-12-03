import { useContext, useEffect, useState } from "react";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import tblFields from "../forms/items.json";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../../../store/auth-contex";
import Box from "@mui/material/Box";
import AdditionalSection from "../AdditionalSection";
import Confrm from "./modalContent/Confrm";
import DialogCompleted from "../../../../components/shared/Dialogs/DeleteDialog";
import { toast } from "react-toastify";

const Items = ({ rId, basicData }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const navigate = useNavigate();

    const [openModal, setOpenModal] = useState({ show: false, id: null });
    const [openCompletedDialog, setOpenCompletedDialog] = useState({ show: false, id: null });
    const [tblFieldsTemp, setTblFieldsTemp] = useState(tblFields);
    const [rowDataListNew, setRowDataListNew] = useState([]);
    // const [basicDataInfo, setBasicDataInfo] = useState(basicData);
    const [infoRow, setInfoRow] = useState({});
    const [content, setContent] = useState("");
    // const [stateOnClose, setStateOnClose] = useState(false);

    // fetch
    const fetch = () => {
        api.list(`admin/reclamations-b2b/items/${rId}`)
            .then((data) => {
                const items = data?.payload || [];
                setRowDataListNew(items);
            })
            .catch((error) => {
                console.error("Refetch error:", error);
            });
    };

    useEffect(() => {
        fetch();
    }, []);

    const customActions = {
        edit: {
            type: "edit",
            display: false,
        },
        comment: {
            type: "custom",
            display: true,
            position: 5,
            icon: "comment",
            title: "Lista komentara",
            clickHandler: {
                type: "function",
                fnc: (rowData) => {
                    navigate(`/b2b-reclamations/${rId}?tab=comments&page=1`, { replace: true });
                    location.reload();
                },
            },
        },
        confirmation: {
            type: "custom",
            display: true,
            position: 2,
            icon: "hourglass_top",
            title: "Potvrda",
            clickHandler: {
                type: "modal_form",
                fnc: (rowData) => {
                    setContent("potvrda");
                    setInfoRow(rowData);
                    setOpenModal({ show: true, id: rowData.id });
                    return {
                        show: true,
                        id: rowData.id,
                    };
                },
            },
            displayCondition: {
                fnc: (rowData) => {
                    if (rowData?.completed === 1) {
                        return false;
                    } else {
                        return true;
                    }
                },
            },
        },
        completed: {
            type: "custom",
            display: true,
            position: 2,
            icon: "task_alt",
            title: "Realizovano",
            clickHandler: {
                type: "modal_form",
                fnc: (rowData) => {
                    setInfoRow(rowData);
                    setOpenCompletedDialog({ show: true, id: rowData.id });
                    return {
                        show: true,
                        id: rowData.id,
                    };
                },
            },
            displayCondition: {
                fnc: (rowData) => {
                    if (rowData?.completed === 1) {
                        return false;
                    } else {
                        return true;
                    }
                },
            },
        },
        delete: {
            type: "delete",
            display: false,
        },
    };

    const completedHandler = () => {
        api.post(`admin/reclamations-b2b/items-status/completed`, { id: infoRow.id, id_reclamations: rId })
            .then((response) => {
                setOpenCompletedDialog({ show: false, id: null });
                fetch();
                toast.success(`Uspešno`);
            })
            .catch((error) => {
                console.warn(error);
                toast.warning("Greška");
            });
    };

    const handleCancel = () => {
        setOpenCompletedDialog({ show: false, id: null });
    };

    return (
        <>
            <ListPage

                listPageId="B2BReclamationsItems"
                apiUrl={`admin/reclamations-b2b/items/${rId}`}
                editUrl={`admin/reclamations-b2b/items`}
                title=" "
                columnFields={tblFieldsTemp}
                customActions={customActions}
                actionNewButton="modal"
                onNewButtonPress={() => {
                    setContent("novo");
                    setOpenModal({ show: true, id: "new" });
                }}
                modalFormChildren={
                    <Box sx={{ padding: "2rem", display: "flex", flexFlow: "wrap" }}>
                        {content === "potvrda" && (
                            <Confrm
                                onClickSubmitHandler={() => {
                                    setOpenModal({ show: false, id: null });
                                    fetch();
                                }}
                                infoRow={infoRow}
                            />
                        )}
                        {content === "novo" && (
                            <AdditionalSection
                                basicData={basicData}
                                onClickSubmitHandler={() => {
                                    setOpenModal({ show: false, id: null });
                                }}
                                onCloseUpdateData={() => {
                                    fetch();
                                }}
                            />
                        )}
                    </Box>
                }
                openModalGlobal={openModal}
                onDismissModal={() => {
                    setOpenModal({ show: false, id: null });
                }}
                listData={rowDataListNew}
            />

            <DialogCompleted
                title=" "
                description="Da li ste sigurni?"
                openDeleteDialog={openCompletedDialog}
                setOpenDeleteDialog={setOpenCompletedDialog}
                handleConfirm={completedHandler}
                handleCancel={handleCancel}
                nameOfButton={"Da"}
                nameOfButtonCancel={"Ne"}
                sx={{ backgroundColor: "var(--theme)", color: "#fff", "&:hover": { backgroundColor: "rgb(28, 117, 77)" } }}
                deafultDeleteIcon={false}
            />
        </>
    );
};

export default Items;
