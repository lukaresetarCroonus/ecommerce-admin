import { MenuItem, Select } from "@mui/material";

const SystemSelect = ({ onChange, value }) => {
    return (
        <Select labelId="system-select" id="system-select" value={value} label="System" onChange={onChange}>
            <MenuItem value={"B2C"}>B2C</MenuItem>
            <MenuItem value={"B2B"}>B2B</MenuItem>
        </Select>
    );
};

export default SystemSelect;
