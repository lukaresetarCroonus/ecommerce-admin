import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import classes from "./classes.module.css";
import { columnCell, columnProps } from "../../../helpers/table";
import EmptyList from "../Empty/EmptyList";
import LoadingTableRows from "../Loading/LoadingTableRows";
import ActionField from "./ActionField/ActionField";
import Form from "../Form/Form";
import useAPI from "../../../api/api";
import AuthContext from "../../../store/auth-contex";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import { useMutation, useQuery } from "react-query";
import styles from "./ListTable.module.scss";

/**
 * Show the table body and handle lifecycle and events.
 *
 * @param {[][]} items The items to show.
 * @param {[]} fields The definition of fields that are shown as columns.
 * @param {function(id: int, action: string)} handleOnClickActions The handler for the row actions.
 * @param {boolean} isLoading True if the table is still loading, false otherwise.
 * @param {?string} error An error message to show, or null if there is no error.
 * @param {string default:"id"} error Column value that is sent to preview page
 * @param {boolean} showAddButtonTableRow Add a button "add row" to the table (if needed in the future).
 * @param {string} tooltipAddButtonTableRow Add title to tooltip (if needed in the future).
 * @param {Object{type: {handler:function, icon: ""}}} customActions To display icons.
 *
 * @return {JSX.Element}
 * @constructor
 */
const ListTableBody = ({
    items,
    fields,
    handleOnClickActions,
    isLoading = false,
    error = null,
    previewColumn = "id",
    showAddButtonTableRow = false,
    tooltipAddButtonTableRow,
    customActions,
    onClickFieldBehavior,
    tableCellActions,
}) => {
    const [clickTimeout, setClickTimeout] = useState(null);
    const [data, setData] = useState(null);
    const actionButtons = () => {
        let buttons = {};

        buttons.edit = {
            type: "edit",
            display: true,
            icon: "edit",
            title: "Izmeni",
            position: 1,
        };

        buttons.delete = {
            type: "delete",
            display: true,
            icon: "delete",
            title: "Obriši",
            position: 1000,
        };

        buttons.preview = {
            type: "preview",
            display: false,
            icon: "preview",
            title: "Pregledaj",
            position: 2,
        };
        if (typeof customActions === "object") {
            Object.keys(customActions).map((key) => {
                switch (true) {
                    case key == "edit":
                    case key == "delete":
                    case key == "preview":
                        buttons[key] = Object.assign({}, buttons[key], { ...customActions[key] });
                        break;
                    default:
                        buttons[key] = customActions[key];
                        break;
                }
            });
        }

        return buttons;
    };

    const [selected, setSelected] = useState({
        row: null,
        column: null,
        action: "",
    });

    const tableCellEvents = () => {
        let events = {};
        if (typeof tableCellActions?.actions === "object") {
            Object.keys(tableCellActions?.actions).map((key) => {
                switch (true) {
                    default:
                        events[key] = tableCellActions?.actions[key];
                        break;
                }
            });
        }
        return events;
    };

    const handleCellRender = ({ selected, row, column, editable, columnCell, cell_data, ...props }) => {
        const renderCell = () => {
            if (selected?.action === "edit" || selected?.action === "active") {
                const isActive = selected?.action === "active";
                const isCellSelected = selected?.row?.id === row?.id && selected?.column === column.prop_name;
                const content = columnCell(row[column.prop_name], column.input_type, row.input_type);

                return isCellSelected && !cell_data?.system_required ? (
                    isActive ? (
                        content
                    ) : (
                        <Form
                            id={`inPlaceInput`}
                            initialData={{}}
                            formFields={props.formFields}
                            validateData={props.validateData}
                            onChange={props.onChange}
                            onSubmit={props.onSubmit}
                            submitButton={false}
                            inPlaceInput={{
                                enabled: true,
                                function: props.getTableCellFormData,
                                functionData: {
                                    cell_data: cell_data,
                                    selected: {
                                        column: column,
                                        row: row,
                                    },
                                },
                            }}
                        />
                    )
                ) : (
                    content
                );
            }
            if (column?.field_behavior) {
                return (
                    <span style={{ display: "flex", alignItems: "center" }}>
                        {columnCell(row[column.prop_name], column.input_type, column.input_type)}
                        <IconButton>
                            <Icon sx={{ fontSize: "1.1rem", opacity: "0.3" }}>edit</Icon>
                        </IconButton>
                    </span>
                );
            } else {
                return columnCell(row[column.prop_name], column.input_type, row.input_type);
            }
        };

        return editable ? renderCell() : columnCell(row[column.prop_name], column.input_type, row.input_type);
    };

    const handleInputInCellRender = ({ cell_data, ...props }) => {
        const editable = cell_data?.editable;
        const render_input = cell_data?.render_input;

        if (editable && render_input && !cell_data?.system_required) {
            return (
                <Form
                    initialData={{}}
                    formFields={props.formFields}
                    validateData={props.validateData}
                    onChange={props.onChange}
                    onSubmit={props.onSubmit}
                    submitButton={false}
                    inPlaceInput={{
                        enabled: true,
                        function: props.getTableCellFormData,
                        functionData: {
                            cell_data: cell_data,
                            selected: {
                                column: props?.column,
                                row: props?.row,
                            },
                        },
                    }}
                />
            );
        } else {
            if (props?.column?.field_behavior) {
                return (
                    <span style={{ display: "flex", alignItems: "center" }}>
                        {columnCell(props.row[props.column.prop_name], props.column.input_type, props.column.input_type)}
                        <IconButton>
                            <Icon sx={{ fontSize: "1.1rem", opacity: "0.3" }}>edit</Icon>
                        </IconButton>
                    </span>
                );
            } else {
                return props.columnCell(props.row[props.column.prop_name], props.column.input_type, props.row.input_type);
            }
        }
    };

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === "Escape") {
                setSelected({
                    row: null,
                    column: null,
                    action: "",
                });
            }
        };
        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);
    // What to show
    let content;
    switch (true) {
        case error !== null:
            content = <EmptyList span={fields.length} message={`Greška: ${error}`} />;
            break;

        case isLoading:
            content = <LoadingTableRows columns={fields.length} />;
            break;

        case (items ?? []).length === 0:
            content = <EmptyList span={fields.length} />;
            break;

        default:
            content = (items ?? []).map((row) => {
                let actionButtonsObject = actionButtons();
                let tableCellActionsObject = tableCellEvents();

                return (
                    <TableRow
                        hover
                        key={row.id}
                        sx={{
                            position: selected?.row?.id && row?.id === selected?.row?.id ? "sticky" : "relative",
                            top: 0,
                            zIndex: 1000,
                            background: "white",
                            bottom: 0,
                        }}
                    >
                        {fields?.map((column) => {
                            const cell_data = {
                                editable: column?.ui_prop?.table_cell?.cell?.editable,
                                render_input: column?.ui_prop?.table_cell?.cell?.render_input,
                                cell_fields: column?.ui_prop?.table_cell?.cell_behavior?.fields,
                                api_path: column?.ui_prop?.table_cell?.api?.api_path,
                                api_method: column?.ui_prop?.table_cell?.api?.method,
                                api_save_path: column?.ui_prop?.table_cell?.api?.save?.api_path,
                                api_save_method: column?.ui_prop?.table_cell?.api?.save?.method,
                                queryString: column?.ui_prop?.table_cell?.api?.queryString ?? row?.id,
                                system_required: row?.system_required,
                            };

                            let timer;

                            return (
                                <TableCell
                                    onBlur={(e) => {
                                        if (cell_data?.editable && cell_data?.render_input && data) {
                                            tableCellActions?.onSubmit(data, row, setSelected, cell_data?.api_save_path, cell_data?.api_save_method);
                                        }
                                    }}
                                    onClick={(event) => {
                                        if (column?.field_behavior) {
                                            const { onDoubleClick, onClick } = column.field_behavior;
                                            if (clickTimeout !== null) {
                                                clearTimeout(clickTimeout);
                                                setClickTimeout(null);
                                                onClickFieldBehavior(event, onDoubleClick, column, row);
                                            } else {
                                                setClickTimeout(
                                                    setTimeout(() => {
                                                        setClickTimeout(null);
                                                        onClickFieldBehavior(event, onClick, column, row);
                                                    }, 500)
                                                );
                                            }
                                        } else {
                                            clearTimeout(timer);
                                            if (event?.detail === 1) {
                                                timer = setTimeout(() => {
                                                    tableCellActionsObject?.click?.handler(row, column, selected, setSelected);
                                                }, 200);
                                            } else if (event?.detail === 2) {
                                                tableCellActionsObject?.doubleClick?.handler(row, column, selected, setSelected);
                                            }
                                        }
                                    }}
                                    key={`${row.id}-${column.prop_name}`}
                                    {...columnProps(column)}
                                    sx={{ cursor: cell_data?.editable && "pointer", fontSize: "0.813rem" }}
                                >
                                    {column?.prop_name === "action" ? (
                                        <ActionField
                                            fieldType={column.input_type}
                                            systemRequired={row.system_required}
                                            customActions={actionButtonsObject}
                                            handleOnClickActions={handleOnClickActions}
                                            rowData={row}
                                        />
                                    ) : column?.field_behavior ? (
                                        <span style={{ display: "flex", alignItems: "center" }}>
                                            {columnCell(row[column.prop_name], column.input_type, column.input_type)}
                                            <IconButton>
                                                <Icon sx={{ fontSize: "1.1rem", opacity: "0.3" }}>edit</Icon>
                                            </IconButton>
                                        </span>
                                    ) : cell_data?.render_input ? (
                                        handleInputInCellRender({
                                            row: row,
                                            column: column,
                                            cell_data: cell_data,
                                            formFields: tableCellActions?.cell_fields ?? cell_data?.cell_fields,
                                            getTableCellFormData: tableCellActions?.getTableCellFormData,
                                            validateData: (data) => {
                                                return data;
                                            },
                                            onChange: (data, field) => {
                                                tableCellActions?.onChange(data, row, field);
                                                setData(data);
                                            },
                                            onSubmit: (data) => {
                                                tableCellActions?.onSubmit(data, row, setSelected, cell_data?.api_save_path, cell_data?.api_save_method);
                                            },
                                        })
                                    ) : (
                                        handleCellRender({
                                            selected: selected,
                                            editable: cell_data?.editable,
                                            row: row,
                                            column: column,
                                            cell_data: cell_data,
                                            columnCell: columnCell,
                                            formFields: tableCellActions?.cell_fields ?? cell_data?.cell_fields,
                                            getTableCellFormData: tableCellActions?.getTableCellFormData,
                                            validateData: (data) => {
                                                return data;
                                            },
                                            onChange: (data, field) => {
                                                tableCellActions?.onChange(data, row, field);
                                                setData(data);
                                            },
                                            onSubmit: (data) => {
                                                tableCellActions?.onSubmit(data, row, setSelected, cell_data?.api_save_path, cell_data?.api_save_method);
                                            },
                                        })
                                    )}
                                </TableCell>
                            );
                        })}
                        {selected?.row && selected?.column && selected?.action === "edit" && (
                            <div
                                onClick={() => {
                                    setSelected({
                                        row: null,
                                        column: null,
                                        action: "",
                                    });
                                }}
                                className={`${selected?.row?.id === row?.id ? "" : classes.overlay}`}
                            />
                        )}
                    </TableRow>
                );
            });

            if (showAddButtonTableRow) {
                content.push(
                    <TableRow hover key="add">
                        <TableCell colSpan={fields.length} align="center">
                            <Tooltip title={tooltipAddButtonTableRow} placement="top" arrow>
                                <IconButton size="small">
                                    <Icon>add</Icon>
                                </IconButton>
                            </Tooltip>
                        </TableCell>
                    </TableRow>
                );
            }
    }

    return (
        <>
            <TableBody className={styles.tbody}>{content}</TableBody>
        </>
    );
};

export default ListTableBody;
