import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Box from "@mui/system/Box";

export const DeleteModalContent = ({ onChange, selected }) => {
    return (
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "start", marginRight: "auto", gap: "0.5rem" }}>
            <p>Izaberite koje tipove rabata želite da obrišete:</p>
            <FormControlLabel
                control={<Checkbox name={`products`} onChange={onChange} checked={selected?.includes("products")} />}
                label={`Proizvodi`}
                sx={{ ".MuiTypography-root": { fontSize: "14px" } }}
            />
            <FormControlLabel
                control={<Checkbox name={`categories`} onChange={onChange} checked={selected?.includes("categories")} />}
                label={`Kategorije`}
                sx={{ ".MuiTypography-root": { fontSize: "14px" } }}
            />
            <FormControlLabel
                control={<Checkbox name={`brands`} onChange={onChange} checked={selected?.includes("brands")} />}
                label={`Brendovi`}
                sx={{ ".MuiTypography-root": { fontSize: "14px" } }}
            />
        </Box>
    );
};
