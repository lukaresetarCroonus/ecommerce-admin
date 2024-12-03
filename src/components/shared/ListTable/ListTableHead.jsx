import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TableSortLabel from "@mui/material/TableSortLabel";

import { columnProps } from "../../../helpers/table";
import { useSearchParams } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";

import styles from "./ListTable.module.scss";

const ListTableHead = ({ fields = [], onRequestSort, order, orderBy, setSort = () => {}, sort = [] }) => {
    // Sorting by column
    const createSortHandler = (column: FieldSpec) => (event) => onRequestSort && onRequestSort(event, column.prop_name);
    const sortingDirection = (column: FieldSpec) => (orderBy === column.prop_name ? order : false);
    const sortableColumn = (column: FieldSpec) => (
        <TableSortLabel active={orderBy === column.prop_name} direction={sortingDirection(column)} onClick={createSortHandler(column)}>
            {column.field_name}
        </TableSortLabel>
    );
    const [params, setParams] = useSearchParams();
    const filters_tmp = params.get("filters");
    const page_tmp = params.get("page");
    const search_tmp = params.get("search");

    const handleSort = (prop_name) => {
        let sort_tmp = [...sort];
        let index = sort_tmp.findIndex((el) => el.field === prop_name);
        if (index !== -1) {
            if (sort_tmp[index].direction === "asc") {
                sort_tmp[index].direction = "desc";
            } else {
                sort_tmp.splice(index, 1);
            }
        } else {
            sort_tmp.push({ field: prop_name, direction: "asc" });
        }

        setSort(sort_tmp);

        let sort_obj = sort_tmp
            ?.map((s) => {
                return `${s?.field}:${s?.direction}`;
            })
            .join("::");

        const newParams = Object.fromEntries(params.entries());
        if (search_tmp) {
            newParams.search = search_tmp;
        }
        if (filters_tmp) {
            newParams.filters = filters_tmp;
        }
        if (page_tmp) {
            newParams.page = page_tmp;
        }
        if (sort_obj) {
            newParams.sort = sort_obj;
        }
        setParams(newParams);
    };

    const renderPositionInSortArray = (prop_name) => {
        let index = (sort ?? [])?.findIndex((el) => el?.field === prop_name);
        if (index !== -1) {
            return (
                <Typography variant={`caption`} sx={{ paddingLeft: "0.5rem" }}>
                    {index + 1}
                </Typography>
            );
        }
        return null;
    };

    const getDirection = (sort, prop_name) => {
        let tmp = sort?.find((x) => x?.field === prop_name);
        if (tmp) {
            if (tmp?.direction === "asc") {
                return <Icon fontSize={`small`}>arrow_drop_up</Icon>;
            } else {
                return <Icon fontSize={`small`}>arrow_drop_down</Icon>;
            }
        }
    };

    return (
        <TableHead className={styles.thead}>
            <TableRow>
                {fields.map((column: FieldSpec) => {
                    return (
                        <TableCell
                            sx={{
                                cursor: column?.sortable ? "pointer" : "default",
                            }}
                            onClick={() => {
                                if (column?.sortable) {
                                    handleSort(column?.prop_name);
                                }
                            }}
                            sortDirection={sortingDirection(column)}
                            {...columnProps(column, true)}
                        >
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    "&:hover": {
                                        textDecoration: column?.sortable ? "underline" : "none",
                                    },
                                }}
                            >
                                {getDirection(sort, column?.prop_name)}
                                {column.field_name}
                                {sort?.length > 1 && renderPositionInSortArray(column?.prop_name)}
                            </Box>
                        </TableCell>
                    );
                })}
            </TableRow>
        </TableHead>
    );
};

export default ListTableHead;
