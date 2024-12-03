import { useState } from "react";

import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { InputSelect } from "../../../../../../components/shared/Form/FormInputs/FormInputs";
import InputValue from "../InputValue/InputValue";

import scss from "./Row.module.scss";

const Row = ({ data, id, handleRemoveComponent, campaignId }) => {
    const apiPath = "admin/campaigns/promo-codes/conditions";

    const [rowData, setRowData] = useState(data);
    const [openDialog, setOpenDialog] = useState({ show: false });
    const [valueOptions, setValueOptions] = useState(
        rowData.fields.find((item) => item.field === "condition")?.selected?.props ?? {
            component: null,
            input_type: null,
            query_tbl: null,
            query_col: null,
        }
    );

    const checkIfAllFieldsSelected = () => {
        const fields = rowData.fields;

        const allSelected = fields.every((field) => {
            if (field.field !== "value") {
                return field.selected.id !== null && field.selected.id !== 0;
            }
            return true;
        });

        if (allSelected) {
            setOpenDialog({ show: true });
        }
    };

    const onDataReceived = (options, currentIndex) => {
        if (options?.length === 2) {
            setRowData((prevRowData) => {
                let hideElement = true;
                const newData = { ...prevRowData };
                newData.fields[currentIndex].selected = options[1];
                newData.fields[currentIndex].hideElement = hideElement;
                return newData;
            });
        }
    };

    return (
        <div className={scss.rowHolder}>
            {(rowData?.fields ?? []).map((item, index) => {
                if (index > 0 && (rowData?.fields[index - 1]?.selected?.id == null || rowData?.fields[index - 1]?.selected?.id == 0)) {
                    return null;
                }

                let queryString = "id_campaign=" + campaignId;
                for (let i = 0; i < rowData.fields.length; i++) {
                    const selectedId = rowData.fields[i]?.selected?.id;

                    queryString += `&${rowData.fields[i].field}=${selectedId ?? ""}`;
                }

                switch (item.field) {
                    case "entity_group":
                        return null;
                        break;
                    case "value":
                        return (
                            <InputValue
                                key={item.field + queryString}
                                selectedValues={item.selected}
                                setOpenDialog={setOpenDialog}
                                openDialog={openDialog}
                                fillFromApi={`${apiPath}/row/ddl`}
                                queryString={queryString}
                                usePropName={true}
                                name={item.field}
                                component={valueOptions.component}
                                inputType={valueOptions.input_type}
                                onChange={(selected) => {
                                    let tmp = { ...rowData };
                                    tmp.fields[index].selected = selected;
                                    setRowData(tmp);
                                }}
                            />
                        );
                        break;
                    default:
                        return (
                            <InputSelect
                                styleFormControl={{
                                    display: item?.hideElement && "none",
                                }}
                                className={scss.inputSelect}
                                key={item.field + queryString}
                                required={false}
                                name={item.field}
                                fillFromApi={`${apiPath}/row/ddl`}
                                usePropName={true}
                                queryString={queryString}
                                value={item?.selected?.id ?? 0}
                                onDataReceived={(options) => onDataReceived(options, index)}
                                onChange={({ target }, { props }) => {
                                    if (item.field === "condition" && props.props != null) {
                                        setValueOptions(props.props);
                                    }
                                    let tmp = { ...rowData };
                                    tmp.fields[index].selected.id = target.value;
                                    tmp.fields[index].selected.name = props.valuename;
                                    if (item.field === "condition" && props.props != null) {
                                        tmp.fields[index].selected.props = props.props;
                                    }
                                    for (let i = index + 1; i < tmp.fields.length; i++) {
                                        tmp.fields[i].selected = { id: null, name: null };
                                        if (tmp.fields[i].field === "value") tmp.fields[i].selected = null;
                                    }
                                    setRowData(tmp);
                                    checkIfAllFieldsSelected();
                                }}
                            />
                        );
                        break;
                }
            })}

            <Tooltip title={"Obrišite uslov za akciju"} placement="top" arrow>
                <IconButton
                    className={scss.removeRow}
                    onClick={() => {
                        handleRemoveComponent(id, "row");
                    }}
                >
                    <Icon>delete</Icon>
                </IconButton>
            </Tooltip>
        </div>
    );
};

export default Row;
