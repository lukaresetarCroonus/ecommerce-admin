import React, { useEffect, useState, useRef } from "react";

import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";

import ListPagination from "./ListPagination/ListPagination";
import ListTableBody from "./ListTableBody";
import ListTableHead from "./ListTableHead";

import styles from "./ListTable.module.scss";

const ListTable = ({
    fields = [],
    listData = [],
    isLoading = false,
    onPageChange,
    handleOnClickActions,
    previewColumn,
    showAddButtonTableRow,
    tooltipAddButtonTableRow,
    customActions,
    onClickFieldBehavior,
    tableCellActions,
    setSort,
    sort,
}) => {
    const { items, pagination } = listData;
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");

    const tableContainerRef = useRef(null);

    const handleSort = (event, property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };

    // useEffect(() => {
    //   if (tableContainerRef.current) {
    //     const rowHeight = 48;
    //     tableContainerRef.current.scrollTop = 0;
    //   }
    // }, [pagination]);

    // Show the table
    return (
        <>
            <TableContainer ref={tableContainerRef} className={styles.wrapper}>
                <Table className={styles.table}>
                    <ListTableHead fields={fields} order={order} orderBy={orderBy} onRequestSort={handleSort} rowCount={fields.length} setSort={setSort} sort={sort} />

                    <ListTableBody
                        items={items ?? []}
                        fields={fields}
                        tableCellActions={tableCellActions}
                        isLoading={isLoading}
                        handleOnClickActions={handleOnClickActions}
                        error={null}
                        previewColumn={previewColumn}
                        showAddButtonTableRow={showAddButtonTableRow}
                        tooltipAddButtonTableRow={tooltipAddButtonTableRow}
                        customActions={customActions}
                        onClickFieldBehavior={onClickFieldBehavior}
                    />
                </Table>
            </TableContainer>

            <ListPagination pagination={pagination} onPageChange={onPageChange} />
        </>
    );
};

export default ListTable;
