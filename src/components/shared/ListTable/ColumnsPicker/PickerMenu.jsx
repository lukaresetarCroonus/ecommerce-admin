import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

import Box from "@mui/material/Box";
import FormControl from "@mui/material/FormControl";
import Menu from "@mui/material/Menu";

import { createPairs } from "../../../../helpers/data";
import Button from "../../Button/Button";
import Buttons from "../../Form/Buttons/Buttons";
import { InputCheckbox } from "../../Form/FormInputs/FormInputs";

import styles from "./ColumnsPicker.module.scss";

const PickerMenu = ({ anchor = null, tableFields = [], handleConfirm, handleClose, listPageId }) => {
    // Show errors on the list
    const [errorInput, setErrorInput] = useState(null);
    const errorMessage = "Bar jedna kolona mora ostati vidljiva";

    // With useLocation cheking location of page
    const { pathname } = useLocation();

    let localStorageKey = listPageId ? "columnPickerState." + listPageId : "columnPickerState." + pathname;

    // Check if is localStorage empty
    let visible = createPairs(tableFields, "prop_name", "in_main_table");

    const inLocalStorage = JSON.parse(localStorage.getItem(localStorageKey));

    if (inLocalStorage !== null && Object.keys(inLocalStorage).length > 0) {
        visible = inLocalStorage;
    } else {
        localStorage.setItem(localStorageKey, JSON.stringify(visible));
    }

    // Not all columns can be hidden
    const [visibleColumns, setVisibleColumns] = useState(visible);

    useEffect(() => {
        const timeout = setTimeout(() => {
            setVisibleColumns(visible);
            handleConfirm(tableFields.map((item) => ({ ...item, in_main_table: visible[item.prop_name] })));
        }, 200);
        return () => clearTimeout(timeout);
    }, []);

    // Handle each time a user click a checkbox
    const handleChange = ({ target }, checked) =>
        setVisibleColumns((visibleColumns) => {
            setErrorInput(null);

            // Count the number of visible columns
            let visibleColumnsCount = 0;
            for (const column of tableFields.filter(isColumnToggleable)) {
                visibleColumnsCount += visibleColumns[column.prop_name] ? 1 : 0;
            }

            // At least one column must be selected
            if (visibleColumnsCount > 1 || checked) {
                visibleColumns[target.name] = checked;
            } else {
                setErrorInput(target.name);
            }

            // If returned without {} state is not refreshed
            return { ...visibleColumns };
        });

    // Apply the selected columns
    const onConfirm = () => {
        localStorage.setItem(localStorageKey, JSON.stringify(visibleColumns));
        handleConfirm(tableFields.map((item) => ({ ...item, in_main_table: visibleColumns[item.prop_name] })));
    };

    // Check if the column is toggleable
    const isColumnToggleable = (column: FieldSpec): boolean => column.field_name !== "";

    return (
        <Menu id="column-picker-menu" anchorEl={anchor} open={anchor !== null} onClose={handleClose}>
            <Box className={styles.formStyle} sx={{ flexDirection: "column" }}>
                <FormControl className={styles.formControl} component="fieldset" variant="standard">
                    {tableFields.filter(isColumnToggleable).map((item) => (
                        <InputCheckbox
                            key={item.prop_name}
                            name={item.prop_name}
                            label={item.field_name}
                            value={visibleColumns[item.prop_name]}
                            error={errorInput === item.prop_name ? errorMessage : null}
                            onChange={handleChange}
                            labelStyle={{
                                "& .MuiFormControlLabel-label": {
                                    fontSize: "0.813rem",
                                },
                                "& .MuiButtonBase-root": {
                                    padding: "0.3rem",
                                },
                            }}
                            styleCheckBoxWrapp={{
                                margin: 0,
                            }}
                        />
                    ))}
                    <Buttons>
                        <Button variant="contained" label="Odaberi" onClick={onConfirm} />
                        <Button
                            variant="outlined"
                            label="Otkaži"
                            onClick={() => {
                                handleClose();
                                setVisibleColumns(visible);
                                handleConfirm(tableFields.map((item) => ({ ...item, in_main_table: visible[item.prop_name] })));
                            }}
                        />
                    </Buttons>
                </FormControl>
            </Box>
        </Menu>
    );
};

export default PickerMenu;
