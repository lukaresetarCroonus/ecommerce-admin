import React from "react";

import Pagination from "@mui/material/Pagination";
import PaginationItem from "@mui/material/PaginationItem";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import scss from "./ListPagination.module.scss";

/**
 * The application-wide pagination.
 *
 * @param {APIPagination} pagination The pagination information, as received from the API.
 * @param {function(page: int)} onPageChange  The action to perform on page change.
 *
 * @return {JSX.Element}
 * @constructor
 */
const ListPagination = ({ pagination, onPageChange }) => {

  // Do not show if no multiple pages
  if (!pagination || pagination.total_pages < 2) {
    return null
  }

  // Tell user what is currently showing
  const showingFrom = pagination.items_per_page * (pagination.selected_page - 1) + 1
  const showingTo = Math.min(pagination.items_per_page * pagination.selected_page, pagination.total_items)

  return (
    <Stack className={scss.pagination}>

      <Typography className={scss.paginationLabel}>
        {`${showingFrom} - ${showingTo} od ${pagination.total_items}`}
      </Typography>

      <Pagination
        count={pagination.total_pages}
        onChange={(event, page) => onPageChange(page)}
        page={pagination.selected_page}
        color={"primary"}
        variant="outlined"
        shape="rounded"
        siblingCount={7}
      >
        <PaginationItem />
      </Pagination>
    </Stack>
  )
}

export default ListPagination
