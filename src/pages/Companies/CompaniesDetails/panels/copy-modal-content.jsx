import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useState } from "react";
import { useQuery } from "react-query";
import useAPI from "../../../../api/api";
import Box from "@mui/system/Box";
import { InputWrapper } from "../../../../components/shared/Form/FormInputs/FormInputs";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Button from "../../../../components/shared/Button/Button";

export const CopyModalContent = ({ onChange, companyId, selected, setSelected, mutate, isPending }) => {
    const api = useAPI();
    const [value, setValue] = useState("");

    const { data: opt } = useQuery(["copyModalContent", value], async () => {
        if (value?.length >= 3) {
            return await api.get(`admin/customers-b2b/rebate-company/main/ddl/b2b_company?search=${value}&company_id=${companyId}`).then((res) => {
                return res?.payload;
            });
        }
    });

    const { data: clone_type } = useQuery(["copyModalContentCloneType"], async () => {
        return await api.get(`admin/customers-b2b/rebate-company/main/ddl/clone_type`).then((res) => {
            return res?.payload;
        });
    });

    const [selectedDDL, setSelectedDDL] = useState();

    const { data: options } = useQuery(["DDLcontent"], async () => {
        return await api
            .get(`admin/customers-b2b/rebate-company/main/ddl/sections`)
            .then((res) => res?.payload)
            ?.catch((e) => e);
    });

    return (
        <Box sx={{ p: 2 }}>
            <p>Izaberite sa koje kompanije i koje tipove rabata želite da preslikate:</p>
            <InputWrapper label={`Pretražite kompanije`}>
                <Autocomplete
                    value={value}
                    onInputChange={(event, newInputValue) => {
                        let newIval = newInputValue ? newInputValue : "";
                        setValue(newIval);
                        if (opt?.length > 0) {
                            let selectedOption = opt?.find((o) => o?.name === newInputValue);
                            if (selectedOption) {
                                newIval = selectedOption?.id;
                            }
                        }
                        setSelected({
                            ...selected,
                            company: newIval,
                        });
                    }}
                    options={(opt ?? [])?.map((option) => option?.name)}
                    sx={{
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                        ".MuiInputBase-root": { padding: "0.23rem !important" },
                    }}
                    renderInput={(params) => <TextField {...params} />}
                />
            </InputWrapper>
            <Box sx={{ marginTop: "1rem", display: "flex", flexDirection: "column" }}>
                <InputWrapper label={`Izaberite tipove rabata:`}>
                    {(options ?? [])?.map((item) => {
                        return (
                            <FormControlLabel
                                control={<Checkbox name={item?.id} onChange={onChange} checked={selected?.sections?.includes(item?.id)} />}
                                label={item?.name}
                                sx={{ ".MuiTypography-root": { fontSize: "14px" } }}
                            />
                        );
                    })}
                </InputWrapper>
            </Box>
            <Button label={`Kopiraj`} sx={{ marginTop: "1rem", float: "right" }} onClick={mutate} variant={`contained`} disabled={isPending} />
        </Box>
    );
};
