import React, { useState, useEffect } from "react";
import DataTable from "../../../../../../components/shared/DataTable/DataTable";
import { v4 } from "uuid";
import { InputCheckbox } from "../../../../../../components/shared/Form/FormInputs/FormInputs";
import scss from "./CampaignTable.module.scss";

const campaignTableStyles = {
    height: "400px",
    width: "100%",
};

const CampaignTable = ({ data, columns, options, setOptions, selected, onChange, inputType, isLoadingOpt }) => {
    const [showSelected, setShowSelected] = useState(false);
    const [search, setSearch] = useState("");

    const changePageHandler = (data) => {
        let payload = {
            ...options,
            page: data.page + 1,
            limit: data.pageSize,
        };
        setOptions(payload);
    };

    const changeSortHandler = (data) => {
        setOptions({
            ...options,
            sort: data.map((item) => {
                return { field: item.field, direction: item.sort };
            }),
        });
    };

    const onChangeHandler = (value) => {
        let arr = [...value];

        if (inputType === "select" && selected != null) {
            let lastSelected = value.find((e) => e !== selected[0]?.id);
            arr = [lastSelected];
        }

        arr = arr.map((item) => {
            let name = data?.items.find((e) => e.id === item)?.name;
            if (name === undefined && selected != null) {
                name = selected.find((e) => e.id === item)?.name;
            }
            return { id: item, name };
        });

        onChange(arr);
    };

    const getFilters = () => {
        let filters = [];

        if (showSelected && selected && selected.length) {
            const columnFilterIndex = options.filters.findIndex((filter) => filter.column === "id");
            if (columnFilterIndex !== -1) {
                filters = [...options.filters];
                filters[columnFilterIndex].value = selected.map((item) => item.id);
            } else {
                filters.push({
                    column: "id",
                    type: "in",
                    value: selected.map((item) => item.id),
                });
            }
        }

        return filters;
    };

    useEffect(() => {
        let payload = {
            ...options,
            page: null,
            search: search,
            filters: getFilters(),
        };
        const timeOutOpt = setTimeout(() => setOptions(payload), 500);
        return () => clearTimeout(timeOutOpt);
    }, [search]);

    useEffect(() => {
        let payload = {
            ...options,
            page: null,
            search: search,
            filters: getFilters(),
        };
        setOptions(payload);
    }, [showSelected]);

    return (
        <>
            <div className={scss.showAllCheckedSearch}>
                <InputCheckbox label="Prikaži samo izabrane" value={showSelected} onChange={({ target }) => setShowSelected(target.checked)} />

                <input value={search} onChange={(event) => setSearch(event.target.value)} type="search" placeholder="Pretraži" />
            </div>

            <DataTable
                rows={data?.items ?? []}
                columns={columns ?? []}
                sx={campaignTableStyles}
                loading={isLoadingOpt}
                rowCount={data?.pagination?.total_items}
                pageSize={data?.pagination?.items_per_page}
                paginationMode="server"
                total={data?.pagination?.total_items}
                totalPages={data?.pagination?.total_pages}
                page={data?.pagination?.selected_page - 1}
                onChangePage={changePageHandler}
                getRowId={(row) => row.id || v4()}
                selected={Array.isArray(selected) && selected !== null ? selected.map((item) => item.id) : []}
                onChange={onChangeHandler}
                hideFooterPagination={false}
                sortingMode="server"
                onSortChange={changeSortHandler}
            />
        </>
    );
};

export default CampaignTable;
