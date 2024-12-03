export const useTableCellActions = ({ click = true, doubleClick = true, clickAction = "active", doubleClickAction = "edit", ...props }) => {
    const customTableCellActions = {
        click: {
            type: "click",
            action: clickAction,
            handler: function (row, column, selected, setSelected) {
                const form = document.getElementById("inPlaceInput");
                const is_form_active = form?.classList?.contains("MuiBox-root");
                if (column?.ui_prop?.table_cell?.cell?.editable && !column?.ui_prop?.table_cell?.cell?.render_input) {
                    const isSelected = selected?.row && selected?.column && selected?.action !== "";
                    if (!is_form_active) {
                        switch (true) {
                            case !isSelected:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                                break;
                            case isSelected && selected?.row?.id === row?.id && selected?.column === column?.prop_name && selected?.action === this.action:
                                setSelected({
                                    row: null,
                                    column: null,
                                    action: null,
                                });
                                break;
                            case isSelected && selected?.row?.id === row?.id && selected?.column !== column?.prop_name && selected?.action === this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                                break;
                            case isSelected && selected?.row?.id !== row?.id && selected?.column === column?.prop_name && selected?.action === this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                                break;
                            case isSelected && selected?.row?.id !== row?.id && selected?.column !== column?.prop_name && selected?.action === this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                                break;
                            case isSelected && selected?.row?.id !== row?.id && selected?.column !== column?.prop_name && selected?.action !== this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: selected.action,
                                });
                                break;
                            case isSelected && selected?.row?.id !== row?.id && (selected?.column === column?.prop_name || selected?.column !== column?.prop_name) && selected?.action !== this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: selected.action,
                                });
                        }
                    } else {
                        if (isSelected && selected?.row?.id === row?.id && selected?.column === column?.prop_name && selected?.action !== this.action) {
                            return;
                        }
                    }
                }
            },
        },
        doubleClick: {
            type: "doubleClick",
            action: doubleClickAction,
            handler: function (row, column, selected, setSelected) {
                const form = document.getElementById("inPlaceInput");
                const is_form_active = form?.classList?.contains("MuiBox-root");

                if (column?.ui_prop?.table_cell?.cell?.editable && !column?.ui_prop?.table_cell?.cell?.render_input) {
                    const isSelected = selected?.row && selected?.column && selected?.action !== "";
                    if (!is_form_active) {
                        switch (true) {
                            case !isSelected:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                                break;
                            case isSelected && selected?.row?.id === row?.id && selected?.column === column?.prop_name && selected?.action === this.action:
                                setSelected({
                                    row: null,
                                    column: null,
                                    action: null,
                                });
                                break;
                            case isSelected && selected?.row?.id === row?.id && selected?.column !== column?.prop_name && selected?.action === this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                                break;
                            case isSelected && selected?.row?.id !== row?.id && selected?.column === column?.prop_name && selected?.action === this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                                break;
                            case isSelected && selected?.row?.id !== row?.id && selected?.column !== column?.prop_name && selected?.action === this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                                break;
                            case isSelected && selected?.row?.id === row?.id && selected?.column === column?.prop_name && selected?.action !== this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                                break;
                            case isSelected && selected?.row?.id !== row?.id && (selected?.column === column?.prop_name || selected?.column !== column?.prop_name) && selected?.action !== this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: selected.action,
                                });
                                break;
                            case isSelected && selected?.row?.id === row?.id && (selected?.column === column?.prop_name || selected?.column !== column?.prop_name) && selected?.action === this.action:
                                setSelected({
                                    row: row,
                                    column: column.prop_name,
                                    action: this.action,
                                });
                        }
                    } else {
                        if (isSelected && selected?.row?.id === row?.id && selected?.column === column?.prop_name && selected?.action !== this.action) {
                            return;
                        }
                        if (isSelected && selected?.row?.id === row?.id && selected?.column !== column?.prop_name && selected?.action === this.action) {
                            setSelected({
                                row: row,
                                column: column.prop_name,
                                action: this.action,
                            });
                        }
                        if (isSelected && selected?.row?.id !== row?.id && selected?.column === column?.prop_name && selected?.action === this.action) {
                            setSelected({
                                row: row,
                                column: column.prop_name,
                                action: this.action,
                            });
                        }
                    }
                }
            },
        },
        ...props,
    };

    if (!click) {
        delete customTableCellActions.click;
    }

    if (!doubleClick) {
        delete customTableCellActions.doubleClick;
    }

    return {
        customTableCellActions,
    };
};
