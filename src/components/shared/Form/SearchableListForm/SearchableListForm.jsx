import { useEffect, useState } from "react";
import Button from "../../../../components/shared/Button/Button";
import Buttons from "../../../../components/shared/Form/Buttons/Buttons";
import NoteBox from "../../../../components/shared/NoteBox/NoteBox";
import useList from "../../../../hooks/useList";
import { InputCheckbox, InputInput } from "../FormInputs/FormInputs";

import styles from "./SearchableListForm.module.scss";
import CircularProgress from "@mui/material/CircularProgress";

/**
 * Choose from a list.
 *
 * @param {{id: string|number, name: string}[]} available The list of available items.
 * @param {(string|number)[]} selected The list of selected ids from the available list.
 * @param {function((string|number)[])} onSubmit Submit the list of selected ids from the available list.
 * @param {boolean} selectAll If select all options should be displayed.
 * @param {boolean} selectOne Select one field within the list.
 *
 * @return {JSX.Element}
 * @constructor
 */
const SearchableListForm = ({ available = [], selected = [], onSubmit, selectAll = false, toggleShowSelected = true, sx, onChange = () => null, selectOne = false, isLoading }) => {
    const { list, toggle, has, set, clear, toggleMount } = useList(selected ?? []);
    const [search, setSearch] = useState("");

    const [showSelected, setShowSelected] = useState(false);

    // Filter the available
    available = (available ?? [])?.filter((item) => search === "" || item?.name?.toLowerCase()?.includes(search?.toLowerCase()));

    const toggleSelectAll = (selected) => {
        if (!selected) {
            clear();
        } else {
            for (const item of available) {
                set(item.id);
            }
        }
    };

    if (showSelected) {
        available = available.filter((item) => list.includes(item.id));
    }

    useEffect(() => {
        onChange(list);
    }, [list]);

    return (
        <>
            {/* show only selected options */}
            {toggleShowSelected && <InputCheckbox label="Prikaži samo izabrane" value={showSelected} onChange={({ target }) => setShowSelected(target.checked)} />}
            {/* select all options */}
            {selectAll && <InputCheckbox label="Izaberi sve" value={available.length === list.length && available.length > 0} onChange={({ target }) => toggleSelectAll(target.checked)} />}

            <InputInput placeholder="Pretraga" value={search} onChange={(event) => setSearch(event.target.value)} />
            {/* The list of available items */}
            <div className={styles.optionsList}>
                {available.map((brand) => (
                    <InputCheckbox
                        key={brand.id}
                        value={has(brand.id)}
                        label={brand.name}
                        onChange={() => {
                            if (selectOne) {
                                clear();
                            }
                            toggle(brand.id);
                        }}
                    />
                ))}
            </div>

            {/* There are no available to show */}
            {available.length === 0 && <NoteBox message="Lista je prazna" className="mt" />}

            <Buttons>
                <Button sx={sx} label={isLoading ? <CircularProgress size="1.5rem" /> : "Sačuvaj"} disabled={isLoading} variant="contained" onClick={() => onSubmit(list)} />
            </Buttons>
        </>
    );
};

export default SearchableListForm;
