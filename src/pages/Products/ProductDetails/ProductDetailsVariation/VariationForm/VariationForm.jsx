import { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import Button from "../../../../../components/shared/Button/Button";
import Buttons from "../../../../../components/shared/Form/Buttons/Buttons";
import CreateForm from "../../../../../components/shared/Form/CreateForm";
import DeleteDialog from "../../../../../components/shared/Dialogs/DeleteDialog";

const VariationForm = ({ fields = [], initSelected = [], onSumbit = () => {} }) => {
    const [data, setData] = useState(fields);
    const [deleteDialogDescription, setDeleteDialogDescription] = useState();
    const currentSelected = [];

    const [openDeleteDialog, setOpenDeleteDialog] = useState({
        show: false,
    });

    const formItemChangeHandler = ({ target }) => {
        const [id_attr, id_value] = target.name.split("_");
        const arr = [...data];
        for (const field of arr) {
            if (field.attr.id === Number(id_attr)) {
                for (const value of field.values) {
                    if (value.id === Number(id_value)) {
                        value.selected = target.checked;
                    }
                }
            }
        }
        setData(arr);
    };

    useEffect(() => {
        setData(fields);
    }, [fields]);

    const handleCancel = () => {
        setOpenDeleteDialog({ show: false });
    };

    const submitHandler = () => {
        setCurrentSelected(data);
        let remove = checkInitSelections(initSelected, currentSelected);
        if (remove.status) {
            setDeleteDialogDescription(`Da li ste sigurni da želite da isključite ${remove.description} iz varijacija?`);
            setOpenDeleteDialog({ show: true });
        } else {
            onSumbit(data);
        }
    };

    const deleteDialogSubmitHandler = () => {
        onSumbit(data);
        setOpenDeleteDialog({ show: false });
    };

    const setCurrentSelected = (values) => {
        values.map((row) => {
            row.values.map((r) => {
                if (r.selected) {
                    currentSelected.push({
                        key: r.id_group + "_" + r.id_group_attribute + "_" + r.id,
                        attr: row.attr.name,
                        val: r.name,
                        selected: r.selected,
                    });
                }
            });
        });
    };

    const checkInitSelections = (initSelected, currentSelected) => {
        let status = false;
        let description = "";
        let remove = [];

        initSelected.map((initItem) => {
            let selected = false;
            currentSelected.map((currentItem) => {
                if (initItem.key == currentItem.key) {
                    selected = true;
                }
            });

            if (!selected) {
                remove.push(initItem);
            }
        });

        if (remove.length) {
            status = true;
            remove.map((item) => {
                description += " " + item.attr + ": " + item.val;
            });
        }

        return {
            status: status,
            description: description,
        };
    };

    return (
        <Box>
            {data.map((item) => {
                return (
                    <Box key={item.attr.id}>
                        <Box>{item.attr.name}</Box>
                        {item.values.map((value) => (
                            <CreateForm
                                data-test-id="admin-form"
                                onChangeHandler={formItemChangeHandler}
                                item={{
                                    editable: true,
                                    prop_name: `${item.attr.id}_${value.id}`,
                                    input_type: "switch",
                                    field_name: value.name,
                                }}
                                key={value.id}
                                error={""}
                                value={value.selected ?? false}
                            />
                        ))}
                    </Box>
                );
            })}
            <Buttons>
                <Button
                    label="Sačuvaj"
                    onClick={() => {
                        submitHandler();
                    }}
                    variant="contained"
                />
            </Buttons>

            <DeleteDialog
                title=""
                description={deleteDialogDescription}
                handleCancel={handleCancel}
                handleConfirm={deleteDialogSubmitHandler}
                openDeleteDialog={openDeleteDialog}
                setOpenDeleteDialog={setOpenDeleteDialog}
                nameOfButton="Sačuvaj"
                deafultDeleteIcon={false}
                sx={{ background: "#28a86e" }}
            />
        </Box>
    );
};

export default VariationForm;
