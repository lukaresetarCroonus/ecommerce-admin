import { useContext, useEffect, useState } from "react";
import ListItem from "./ListItem";

import styles from "./List.module.scss";
import Button from "../../../../../components/shared/Button/Button";
import { toast } from "react-toastify";
import ModalForm from "../../../../../components/shared/Modal/ModalForm";
import Box from "@mui/material/Box";
import SearchableListForm from "../../../../../components/shared/Form/SearchableListForm/SearchableListForm";
import Buttons from "../../../../../components/shared/Form/Buttons/Buttons";
import DeleteModal from "../../../../../components/shared/Dialogs/DeleteDialog";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../../../../../store/auth-contex";
import useDebounce from "../../../../../hooks/useDebounce";

const List = ({ productId, apiPath }) => {
    const [fields, setFields] = useState([]);
    const [openModal, setOpenModal] = useState({ show: false, id: null });
    const [listData, setListData] = useState([]);
    const [selectedModalId, setSelectedModalId] = useState([]);
    const [newDisabled, setNewDisabled] = useState(false);
    const [openModalUncheckedSet, setOpenModalUncheckedSet] = useState({ show: false });
    const [stateRemove, setStateRemove] = useState([]);
    const [showProgress, setShowProgress] = useState(false);

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    const getList = () => {
        api.get(`${apiPath}/groups/${productId}`)
            .then((response) => {
                setListData(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const setListHandler = async (selectedIds) => {
        api.post(`${apiPath}/${productId}`, { selected: selectedIds })
            .then((response) => {
                setFields(response?.payload);
                setNewDisabled(false);
            })
            .catch((error) => {
                console.warn(error);
            });
    };

    const saveGroups = async (selectedIds) => {
        api.post(`${apiPath}/groups/${productId}`, { selected: selectedIds })
            .then((response) => {
                const remove = response?.payload?.remove;
                if (remove) {
                    setOpenModalUncheckedSet({ show: true, type: "remove" });
                    setStateRemove(remove);
                } else {
                    setFields(response?.payload);
                    setNewDisabled(false);
                }
            })
            .catch((error) => {
                console.warn(error);
            });
    };

    const deleteHandler = async (productId, setId, groupId) => {
        api.delete(`${apiPath}/group/${productId}/${setId}/${groupId}`)
            .then((response) => {
                toast.success("Uspešno");
                setListHandler(selectedModalId);
                getList();
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
            });
    };

    useEffect(() => {
        setListHandler(selectedModalId);
    }, []);

    useEffect(() => {
        getList();
    }, []);

    const handleSubmit = (data) => {
        saveGroups(data);
        setOpenModal({ show: false, id: null });
    };

    const onChangeData = async (data, attributes, attributeValues, field_change_id, set, group) => {
        for (const attribute of attributes) {
            // lastChange
            if (attribute.slug === field_change_id) {
                if (data[attribute.slug]) {
                    let attribute_value = (attributeValues[attribute.id] ?? []).filter((item) => item.id === data[attribute.slug])[0];
                    let req = {
                        id: data.id[attribute.slug] ?? null,
                        id_product: productId,
                        id_set: set?.id,
                        slug_set: set?.slug,
                        set_name: set?.name,
                        id_group: group?.id,
                        slug_group: group?.slug,
                        group_name: group?.name,
                        id_attribute: attribute.id,
                        slug_attribute: attribute.slug,
                        name_attribute: attribute.name,
                        id_attribute_value: attribute.field_type === "select" ? data[attribute.slug] : null,
                        slug_attribute_value: attribute.field_type === "select" ? attribute_value.slug : null,
                        name_attribute_value: attribute.field_type === "select" ? attribute_value.name : data[attribute.slug],
                    };

                    // TODO: dodati proveru da li je vrednost sacuvana
                    api.post(`${apiPath}`, req);
                } else {
                    await api.delete(`${apiPath}/attribute/${productId}/${set?.id}/${group?.id}/${attribute.id}`);
                }
            }
        }
    };

    const handleSubmitProgress = () => {
        setShowProgress(true);
        setTimeout(() => {
            setShowProgress(false);
        }, 1000);
    };

    return (
        <div className={styles.list}>
            <Buttons styleWrapperButtons={{ marginBottom: "2rem" }}>
                <Button
                    label={"Odaberi specifikaciju"}
                    vaiant={"contained"}
                    onClick={() => {
                        setOpenModal({ show: true, id: productId });
                    }}
                    sx={{ marginRight: "auto", backgroundColor: "#28a86e", color: "#ffff", "&:hover": { backgroundColor: "#1c754d", borderColor: "#1c754d" } }}
                />
                <Button
                    icon={"add"}
                    label="Dodavanje specifikacije"
                    href={"product-specs/groups"}
                    sx={{ backgroundColor: "#17a2b9", borderColor: "#17a2b9", color: "#ffff", "&:hover": { backgroundColor: "#17a2b9de", borderColor: "#17a2b9de" } }}
                />
            </Buttons>

            {fields.length === 0 ? (
                <Typography variant="subtitle1">Trenutno nema odabranih specifikacija.</Typography>
            ) : (
                fields.map(({ group, set, id }, index) => {
                    return (
                        <ListItem
                            key={group.id ? group.id : `${index}new`}
                            index={index}
                            onDelete={() => {
                                deleteHandler(productId, set.id, group.id);
                            }}
                            productId={productId}
                            title={group.name}
                            selectedSet={group.id ?? undefined}
                            apiPath={apiPath}
                            set={set}
                            group={group}
                            onChange={(data, attributes, attributeValues, field_change_id) => {
                                onChangeData(data, attributes, attributeValues, field_change_id, set, group);
                            }}
                        />
                    );
                })
            )}

            {fields.length !== 0 && (
                <Buttons>
                    <Button
                        label={showProgress ? <CircularProgress size={24} /> : "Sačuvaj"}
                        variant={"contained"}
                        onClick={() => {
                            handleSubmitProgress();
                            toast.success("Uspešno");
                        }}
                        disabled={showProgress ? true : false}
                    />
                </Buttons>
            )}

            <ModalForm
                anchor="right"
                openModal={openModal}
                setOpenModal={setOpenModal}
                submitButton={false}
                children={
                    <Box sx={{ padding: "1rem 2rem" }}>
                        <SearchableListForm available={listData?.available} selected={listData?.selected} onSubmit={handleSubmit} />
                    </Box>
                }
            />

            <DeleteModal
                openDeleteDialog={openModalUncheckedSet}
                setOpenDeleteDialog={setOpenModalUncheckedSet}
                handleConfirm={() => {
                    setOpenModalUncheckedSet({ show: false });
                    stateRemove.map((item) => {
                        deleteHandler(productId, item.id_set, item.id_group);
                    });
                }}
            />
        </div>
    );
};

export default List;
