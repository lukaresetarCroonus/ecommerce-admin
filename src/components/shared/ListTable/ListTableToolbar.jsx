import { useState } from "react";

import Box from "@mui/material/Box";

import IconList from "../../../helpers/icons";
import DebouncedInput from "../DebouncedInput/DebouncedInput";
import BasicDatePicker from "../BasicDatePicker/BasicDatePicker";
import ColumnsPicker from "./ColumnsPicker/ColumnsPicker";
import Button from "../Button/Button";
import FilterForm from "./FilterForm/FilterForm";

import styles from "./ListTableToolbar.module.scss";

const ListTableToolbar = ({ fields = [], filterFields, showDatePicker, onColumnsChange, onSearch, listPageId, searchValue }) => {
  const [filterOpen, setFilterOpen] = useState(false)

  return (
    <div className="list-page-toolbar">
      <Box className={styles.toolbarButtons}>
        {/* Search by term */}
        <DebouncedInput
          autoFocus
          placeholder="Pretraga po ključnoj reči"
          ui_prop="search"
          onChange={onSearch}
          value={searchValue}
        />

        {/* Search by date range */}
        {showDatePicker && (
          <>
            <BasicDatePicker label="datum od" />
            <BasicDatePicker label="datum do" />
          </>
        )}

        {/* Filter */}
        {filterFields && (
          <Button icon={IconList.filterList} label="Filteri" onClick={() => setFilterOpen(!filterOpen)} />
        )}

        {/* Choose visible columns */}
        {fields.length >= 1 && (
          <ColumnsPicker tableFields={fields} onChange={onColumnsChange} listPageId={listPageId} />
        )}
      </Box>

      {/* Filter form */}
      {filterOpen && (
        <FilterForm filterFields={filterFields} />
      )}
    </div>
  )
}

export default ListTableToolbar
