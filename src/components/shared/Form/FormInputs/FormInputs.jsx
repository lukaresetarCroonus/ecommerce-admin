import { useContext, useEffect, useRef, useState } from "react";

import Checkbox from "@mui/material/Checkbox";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import FormLabel from "@mui/material/FormLabel";
import ListItemIcon from "@mui/material/ListItemIcon";
import MenuItem from "@mui/material/MenuItem";
import Radio from "@mui/material/Radio";
import Select from "@mui/material/Select";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Autocomplete, { createFilterOptions } from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import Input, { inputClasses } from "@mui/material/Input";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";

import HtmlEditor from "../../HtmlEditor/HtmlEditor";
import ButtonBase from "@mui/material/ButtonBase";
import { blobToData } from "../../../../helpers/data";
import { toast } from "react-toastify";
import AuthContext from "../../../../store/auth-contex";
import Box from "@mui/material/Box";
import CloseIcon from "@mui/icons-material/Close";
import { useFileSize } from "../../../../hooks/useFileSize";
import Button from "../../Button/Button";

const generateBootstrapClasses = (columns) => {
    if (columns) {
        const columnClasses = [];
        Object.keys(columns).forEach((screenSize) => {
            const columnValue = columns[screenSize];
            if (columnValue) {
                columnClasses.push(`col-${screenSize}-${columnValue}`);
            }
        });
        return columnClasses.join(" ");
    }
    return "";
};

/**
 * Wrapper for the input element
 *
 * @param {JSX.Element} children
 * @param {string} label Field label
 * @param {string} error Error message
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 *
 * @return {JSX.Element}
 */

export const InputWrapper = ({ children = null, label, required, disabled, margin = "dense", error = null, fullWidth = true, styleFormControl, inputClasses }) => {
    return (
        <FormControl fullWidth={fullWidth} margin={margin} error={error !== null} sx={{ padding: "0 0.3rem", ...styleFormControl }} className={inputClasses}>
            <FormLabel required={required} disabled={disabled}>
                {label}
            </FormLabel>
            {children}
        </FormControl>
    );
};

/**
 * Basic text input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {boolean} autoFocus True to allow this input to capture focus.
 * @param {string} type The type of the input.
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 * @param {string} placeholder Field placeholder
 * @param {boolean} readOnly If input is read only
 *
 * @return {JSX.Element}
 */

export const InputInput = ({ label, required, disabled, name, value, autoFocus, type = "text", error = null, margin = "dense", onChange = () => null, description, placeholder, readOnly, uiProp }) => {
    const existingStyles = {
        "& legend": { display: "none" },
        "& fieldset": { top: 0 },
        ".MuiInputBase-root": { overflow: "hidden" },
        ".MuiInputBase-input": { padding: "0.7rem", fontSize: "0.875rem" },
    };

    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper
            label={uiProp?.form?.input?.label === false ? null : label}
            required={required}
            disabled={disabled}
            margin={margin}
            error={error}
            styleFormControl={uiProp?.wrapper_props?.custom_sx}
            inputClasses={inputClasses}
        >
            <TextField
                type={type}
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                readOnly={readOnly}
                autoFocus={autoFocus}
                helperText={error ? error : description}
                error={error !== null}
                sx={{
                    ...existingStyles,
                    ...uiProp?.component_props?.custom_sx,
                }}
            />
        </InputWrapper>
    );
};

/**
 * Basic number input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 * @param {string} placeholder Field placeholder
 *
 * @return {JSX.Element}
 */

export const InputNumber = ({ label, required, disabled, error = null, name, value, margin = "dense", onChange = () => null, description, placeholder, autoFocus, uiProp }) => {
    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <TextField
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                helperText={error ? error : description}
                error={error !== null}
                autoFocus={autoFocus}
                type="number"
                inputProps={{ min: 0, step: "any" }}
                sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    ".MuiInputBase-input": { padding: "0.8rem", fontSize: "0.875rem" },
                }}
                onWheel={(e) => e.target.blur()}
                onFocus={(event) => {
                    event.target.select();
                }}
            />
        </InputWrapper>
    );
};

/**
 * Basic checkbox input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 *
 * @return {JSX.Element}
 */

export const InputCheckbox = ({
    label,
    required,
    disabled,
    name,
    value,
    error = null,
    margin = "dense",
    onChange = () => null,
    description,
    labelStyle,
    styleCheckbox,
    styleCheckBoxWrapp,
    uiProp,
    id,
}) => {
    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper required={required} disabled={disabled} margin={margin} error={error} styleFormControl={styleCheckBoxWrapp} inputClasses={inputClasses}>
            <FormControlLabel
                control={<Checkbox name={name} id={id} checked={value} onChange={onChange} disabled={disabled} sx={styleCheckbox} />}
                label={label}
                sx={{ ".MuiTypography-root": { fontSize: "14px" }, ...labelStyle }}
            />
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

/**
 * Basic radio input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 *
 * @return {JSX.Element}
 */

export const InputRadio = ({ label, required, disabled, name, value, error = null, margin = "dense", onChange = () => null, description, uiProp }) => {
    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <FormControlLabel sx={{ ".MuiTypography-root": { fontSize: "0.875rem" } }} control={<Radio name={name} checked={value} onChange={onChange} disabled={disabled} />} label={label} />
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

/**
 * Basic switch input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {boolean} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 *
 * @return {JSX.Element}
 */

export const InputSwitch = ({ label, required, disabled, name, value, error = null, margin = "dense", onChange = () => null, description, fullWidth = true, uiProp }) => {
    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper required={required} disabled={disabled} margin={margin} error={error} fullWidth={fullWidth} inputClasses={inputClasses}>
            <FormControlLabel
                sx={{ ".MuiTypography-root": { fontSize: "0.875rem" } }}
                control={<Switch name={name} value={value} checked={value} onChange={onChange} disabled={disabled} />}
                label={label}
            />
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

/**
 * Basic select input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 * @param {string} fillFromApi Path to get select options from
 * @param {boolean} usePropName If api call should use prop name at the end of the path
 * @param {array} options Select options if there is no api call
 * @param {string} queryString Additional queryString for api call
 *
 * @return {JSX.Element}
 */

export const InputSelect = ({
    label,
    required,
    disabled,
    error = null,
    name,
    value,
    margin = "dense",
    onChange = () => null,
    description,
    fillFromApi,
    usePropName,
    options,
    queryString = "",
    optionsIsEmpty = () => {},
    className,
    onDataReceived = () => null,
    styleFormControl,
    // defaultOption
    uiProp,
}) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [opt, setOpt] = useState(options);

    useEffect(() => {
        let isMounted = true;
        let path = usePropName ? `${fillFromApi}/${name}?${queryString}` : `${fillFromApi}?${queryString}`;
        const fillDdl = async () => {
            await api
                .get(path)
                .then((response) => {
                    if (isMounted) {
                        let res = response?.payload;
                        setOpt(res);
                        onDataReceived(res);
                    }
                })
                .catch((error) => {
                    console.warn(error);
                });
        };

        if (fillFromApi) {
            fillDdl();
        }

        return () => {
            isMounted = false;
        };
    }, [fillFromApi, queryString]);

    useEffect(() => {
        if (opt?.length === 0) {
            optionsIsEmpty(true);
        } else {
            optionsIsEmpty(false);
        }
    }, [opt]);

    useEffect(() => {
        setOpt(opt?.length > 0 ? opt : options);
    }, [options, opt]);

    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} styleFormControl={styleFormControl} inputClasses={inputClasses}>
            <Select
                className={className}
                name={name}
                value={(opt ?? []).length === 0 ? "" : value}
                onChange={onChange}
                disabled={disabled}
                sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    "& .MuiSelect-select": { padding: "0.7rem", fontSize: "0.875rem" },
                }}
            >
                {(opt ?? []).map((item) => (
                    <MenuItem sx={{ fontSize: "0.875rem" }} key={item.id} value={item?.id} selected={item.id === value} disabled={item?.disabled ?? false} props={item.props} valuename={item?.name}>
                        {item?.name}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

/**
 * Basic select input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 * @param {string} fillFromApi Path to get select options from
 * @param {boolean} usePropName If api call should use prop name at the end of the path
 * @param {array} options Select options if there is no api call
 * @param {string} queryString Additional queryString for api call
 *
 * @return {JSX.Element}
 */

export const AutocompleteInput = ({
    label,
    required,
    disabled,
    error = null,
    name,
    value,
    margin = "dense",
    onChange = () => {},
    description,
    fillFromApi,
    usePropName,
    options,
    queryString = "",
    optionsIsEmpty = () => {},
    uiProp,
}) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [opt, setOpt] = useState(options);
    const [myValue, setMyValue] = useState(null);

    useEffect(() => {
        let isMounted = true;
        let path = usePropName ? `${fillFromApi}/${name}?${queryString}` : `${fillFromApi}?${queryString}`;
        const fillDdl = async () => {
            await api
                .get(path)
                .then((response) => {
                    if (isMounted) {
                        setOpt(response?.payload?.filter((item) => item !== null));
                    }
                })
                .catch((error) => {
                    console.warn(error);
                });
        };

        if (fillFromApi) {
            fillDdl();
        }

        return () => {
            isMounted = false;
        };
    }, [fillFromApi, queryString]);

    useEffect(() => {
        if (opt?.length === 0) {
            optionsIsEmpty(true);
        } else {
            optionsIsEmpty(false);
        }
        let selectedOption = null;
        if (opt.length > 0) {
            selectedOption = opt.find((o) => o.id === value)?.name;
            if (selectedOption === undefined) {
                selectedOption = null;
            }
            setMyValue(selectedOption);
        }
    }, [opt]);

    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <Autocomplete
                value={myValue}
                onInputChange={(event, newInputValue) => {
                    let newIval = newInputValue ? newInputValue : "";
                    setMyValue(newIval);
                    if (opt.length > 0) {
                        let selectedOption = opt.find((o) => o.name === newInputValue);
                        if (selectedOption) {
                            newIval = selectedOption.id;
                        }
                    }
                    onChange(name, newIval);
                }}
                options={opt.map((option) => option?.name)}
                sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    ".MuiInputBase-root": { padding: "0.23rem !important" },
                }}
                renderInput={(params) => <TextField {...params} />}
            />
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

export const AutocompleteInputFreeSolo = ({
    label,
    required,
    disabled,
    error = null,
    name,
    value,
    margin = "dense",
    onChange = () => {},
    description,
    fillFromApi,
    usePropName,
    options,
    queryString = "",
    optionsIsEmpty = () => {},
    uiProp,
}) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [opt, setOpt] = useState([]);
    const [myValue, setMyValue] = useState(null);
    const filter = createFilterOptions();

    useEffect(() => {
        let isMounted = true;
        let path = usePropName ? `${fillFromApi}/${name}?${queryString}` : `${fillFromApi}?${queryString}`;
        const fillDdl = async () => {
            await api
                .get(path, false)
                .then((response) => {
                    if (isMounted) {
                        const { payload } = response;
                        setOpt(payload);
                    }
                })
                .catch((error) => {
                    console.warn(error);
                });
        };

        if (fillFromApi) {
            fillDdl();
        }

        return () => {
            isMounted = false;
        };
    }, [fillFromApi, queryString]);

    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <Autocomplete
                disabled={disabled}
                value={value}
                onChange={(event, newInputValue) => {
                    let newIval = newInputValue ? newInputValue : "";
                    setMyValue(newIval);
                    if (opt.length > 0) {
                        let selectedOption = opt.find((o) => o.name === newInputValue);
                        if (selectedOption) {
                            newIval = selectedOption.id;
                        }
                    }
                    onChange(name, newIval);
                }}
                options={options?.length > 0 ? options : opt}
                renderOption={(props, option) => <li {...props}>{option.name}</li>}
                filterOptions={(options, params) => {
                    const filtered = filter(options, params);
                    const { inputValue } = params;
                    // Suggest the creation of a new value
                    const isExisting = options.some((option) => inputValue === option.name);
                    if (inputValue !== "" && !isExisting) {
                        filtered.push({
                            inputValue,
                            name: `Dodaj: "${inputValue}"`,
                        });
                    }
                    return filtered;
                }}
                getOptionLabel={(option) => {
                    // Value selected with enter, right from the input
                    if (typeof option === "string") {
                        return option;
                    }
                    // Add "xxx" option created dynamically
                    if (option.inputValue) {
                        return option.inputValue;
                    }
                    // Regular option
                    return option.name;
                }}
                sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    ".MuiInputBase-root": { padding: "0 !important" },
                    ".MuiOutlinedInput-root .MuiAutocomplete-input": { padding: "0.7rem !important", fontSize: "0.875rem" },
                }}
                renderInput={(params) => <TextField {...params} />}
                freeSolo={true}
            />
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

/**
 * Basic select input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 * @param {string} fillFromApi Path to get select options from
 * @param {boolean} usePropName If api call should use prop name at the end of the path
 * @param {array} options Select options if there is no api call
 * @param {string} queryString Additional queryString for api call
 *
 * @return {JSX.Element}
 */
// Component that allows you to select more values, as well as add new values
export const AutocompleteTagsFilled = ({
    label,
    required,
    disabled,
    error = null,
    name,
    value,
    margin = "dense",
    onChange = () => {},
    description,
    fillFromApi,
    usePropName,
    options,
    queryString = "",
    optionsIsEmpty = () => {},
    uiProp,
}) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [opt, setOpt] = useState(options);
    const [myValue, setMyValue] = useState([]);

    useEffect(() => {
        let isMounted = true;
        let path = usePropName ? `${fillFromApi}/${name}?${queryString}` : `${fillFromApi}?${queryString}`;
        const fillDdl = async () => {
            await api
                .get(path)
                .then((response) => {
                    if (isMounted) {
                        setOpt(response?.payload);
                    }
                })
                .catch((error) => {
                    console.warn(error);
                });
        };

        if (fillFromApi) {
            fillDdl();
        }

        return () => {
            isMounted = false;
        };
    }, [fillFromApi]);

    useEffect(() => {
        if (opt?.length === 0) {
            optionsIsEmpty(true);
        } else {
            optionsIsEmpty(false);
        }

        let selectedOptions = [];
        if (opt.length > 0) {
            if (typeof value === "object") {
                value.map((item) => {
                    let selectedOption = opt.find((o) => o.id === item)?.name;
                    if (selectedOption !== undefined) {
                        selectedOptions.push(selectedOption);
                    }
                });
            }

            setMyValue(selectedOptions);
        }
    }, [opt]);

    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <Autocomplete
                multiple
                value={myValue}
                onChange={(event, newInputValue, reason) => {
                    let newIval = newInputValue.length ? newInputValue : [];
                    setMyValue(newIval);

                    let for_save = {
                        exist: [],
                        new: [],
                    };
                    if (opt.length > 0) {
                        newInputValue.map((item) => {
                            let selectedOption = opt.find((o) => o.name === item);
                            if (selectedOption) {
                                for_save.exist.push(selectedOption.id);
                            } else {
                                for_save.new.push(item);
                            }
                        });
                    } else {
                        newInputValue.map((item) => {
                            for_save.new.push(item);
                        });
                    }
                    onChange(name, for_save); // Global save data change
                }}
                options={opt.map((option) => option.name)}
                sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    "& .MuiInputBase-input": { fontSize: "0.875rem" },
                }}
                freeSolo
                renderTags={(value, getTagProps) => value.map((option, index) => <Chip variant="outlined" label={option} {...getTagProps({ index })} />)}
                renderInput={(params) => <TextField {...params} />}
            />
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

/**
 * Basic select input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 * @param {string} fillFromApi Path to get select options from
 * @param {boolean} usePropName If api call should use prop name at the end of the path
 * @param {array} options Select options if there is no api call
 * @param {string} queryString Additional queryString for api call
 * @param {boolean} selectAllEnabled Determines if select and deselect all buttons are displayed or not
 *
 * @return {JSX.Element}
 */

export const InputMultiSelect = ({
    label,
    required,
    disabled,
    error = null,
    name,
    value,
    margin = "dense",
    onChange = () => null,
    description,
    fillFromApi,
    usePropName,
    options,
    queryString = "",
    optionsIsEmpty = () => {},
    styleMultiSelect,
    uiProp,
    limitTags,
    selectAllEnabled = false,
}) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [opt, setOpt] = useState(options);
    useEffect(() => {
        let isMounted = true;
        let path = usePropName ? `${fillFromApi}/${name}?${queryString}` : `${fillFromApi}?${queryString}`;
        const fillDdl = async () => {
            await api
                .get(path)
                .then((response) => {
                    if (isMounted) {
                        setOpt(response?.payload);
                    }
                })
                .catch((error) => {
                    console.warn(error);
                });
        };

        if (fillFromApi) {
            fillDdl();
        }

        return () => {
            isMounted = false;
        };
    }, [fillFromApi]);

    useEffect(() => {
        if (opt?.length === 0) {
            optionsIsEmpty(true);
        } else {
            optionsIsEmpty(false);
        }
    }, [opt]);

    useEffect(() => {
        if (options && options?.length > 0) {
            setOpt(options);
        } else {
            setOpt(opt);
        }
    }, [options, opt]);

    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} styleFormControl={styleMultiSelect} inputClasses={inputClasses}>
            <Select
                name={name}
                value={(opt ?? []).length === 0 ? [] : value}
                onChange={onChange}
                disabled={disabled}
                multiple={true}
                renderValue={(selected) => {
                    let display = [];
                    for (const option of opt) {
                        if (selected.includes(option.id)) {
                            display.push(option.name);
                        }
                    }
                    return display.join(", ");
                }}
                sx={{
                    position: "relative",
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    "& .MuiSelect-select": { padding: "0.7rem", fontSize: "0.875rem" },
                }}
            >
                {selectAllEnabled && (
                    <Box
                        sx={{ display: "flex", gap: "0.7rem", padding: "0.7rem", position: "sticky", top: 0, background: "white", opacity: 1, zIndex: 20 }}
                        onClick={(e) => {
                            e.stopPropagation();
                        }}
                    >
                        <Button
                            label="Izaberi sve"
                            variant="contained"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange({ target: { value: opt.map((item) => item.id), name } });
                            }}
                        />
                        <Button
                            label="Poništi sve"
                            variant="contained"
                            onClick={(e) => {
                                e.stopPropagation();
                                onChange({ target: { value: [], name } });
                            }}
                        />
                    </Box>
                )}
                {(opt ?? []).map((item) => (
                    <MenuItem sx={{ fontSize: "0.875rem" }} key={item.id} value={item.id} selected={item.id === value} disabled={item?.disabled ?? false}>
                        <ListItemIcon>
                            <Checkbox checked={value?.indexOf(item.id) > -1} />
                        </ListItemIcon>

                        {item.name}
                    </MenuItem>
                ))}
            </Select>
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

/**
 * Basic textarea input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 * @param {string} placeholder Field placeholder
 *
 * @return {JSX.Element}
 */

export const InputText = ({ label, required, disabled, error = null, name, value, margin = "dense", onChange = () => null, description, placeholder, uiProp }) => {
    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <TextField
                name={name}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                disabled={disabled}
                multiline
                minRows={3}
                helperText={error ? error : description}
                error={error !== null}
                sx={{
                    "& legend": { display: "none" },
                    "& fieldset": { top: 0 },
                    ".MuiInputBase-root": { padding: "0.7rem" },
                    ".MuiInputBase-input": { fontSize: "0.875rem" },
                }}
            />
        </InputWrapper>
    );
};

/**
 * Basic datetime input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 *
 * @return {JSX.Element}
 */

export const InputDateTime = ({ label, required, disabled, error = null, name, value, margin = "dense", onChange = () => null, description, uiProp }) => {
    const handleChange = (newValue) => {
        const ev = {
            target: {
                name: name,
                value: newValue,
            },
        };
        onChange(ev, "date_time");
    };

    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DateTimePicker
                    value={value !== "" ? value : null}
                    onChange={handleChange}
                    ampm={false}
                    showToolbar
                    disabled={disabled}
                    inputFormat="dd/MM/yyyy HH:mm"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{
                                "& legend": { display: "none" },
                                "& fieldset": { top: 0 },
                                ".MuiInputBase-input": { fontSize: "0.875rem", padding: "0.7rem" },
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

/**
 * Basic date input
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 *
 * @return {JSX.Element}
 */

export const InputDate = ({ label, required, disabled, error = null, name, value, margin = "dense", onChange = () => null, description, uiProp }) => {
    const handleChange = (newValue) => {
        const ev = {
            target: {
                name: name,
                value: newValue,
            },
        };
        onChange(ev, "date");
    };

    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                    value={value !== "" ? value : null}
                    onChange={handleChange}
                    ampm={false}
                    showToolbar
                    disabled={disabled}
                    inputFormat="dd/MM/yyyy"
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            sx={{
                                "& legend": { display: "none" },
                                "& fieldset": { top: 0 },
                                ".MuiInputBase-input": { fontSize: "0.875rem", padding: "0.7rem" },
                            }}
                        />
                    )}
                />
            </LocalizationProvider>
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

/**
 * Input that returns html
 *
 * @param {string} label Field label
 * @param {boolean} required If field is required
 * @param {boolean} disabled If field is disabled
 * @param {string} error Error message
 * @param {string} name Input field name
 * @param {string} value Field value
 * @param {"none"|"dense"|"normal"} margin The margin to use for FormControl.
 * @param {function} onChange Change handler for the field
 * @param {string} description Field description
 * @param {string} placeholder Field placeholder
 *
 * @return {JSX.Element}
 */

export const InputHtml = ({ label, required, disabled, name, value, error = null, margin = "dense", onChange = () => null, description, uiProp }) => {
    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <HtmlEditor name={name} value={value} onChange={onChange} />
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

export const ImportPicker = ({ label, required, disabled, margin, error = null, onFilePicked, description, selectedFile, uiProp }) => {
    const ref = useRef();
    const [attachment, setAttachment] = useState(null);
    // const isFileTypeAllowed = (fileExtension) => allowedFileTypes.includes(fileExtension);

    const handleChange = (event) => {
        const files = Array.from(event.target.files);
        const [file] = files;

        const fileExtension = file.name.split(".").pop().toLowerCase();

        if (fileExtension !== "csv" && fileExtension !== "xml" && fileExtension !== "json") {
            toast.error("Pogrešan tip fajla.");
            return;
        }

        blobToData(file).then((result) => {
            let obj = {
                base_64: result,
                name: file?.name,
            };
            onFilePicked(obj);
        });
        setAttachment(file);
    };

    const inputClasses = generateBootstrapClasses(uiProp?.columns);

    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <ButtonBase
                component="label"
                sx={{
                    height: "2.844rem",
                    border: "1px solid",
                    borderColor: error ? "#d32f2f" : "rgba(0, 0, 0, 0.23)",
                    borderRadius: "0.25rem",
                    justifyContent: "start",
                    paddingLeft: "0.875rem",
                }}
            >
                {selectedFile ? (
                    <span style={{ fontSize: "0.875rem", WebkitTextFillColor: disabled ? "rgba(0, 0, 0, 0.38)" : "initial" }}>Izabrani fajl: {selectedFile.name}</span>
                ) : (
                    <span style={{ fontSize: "0.875rem", WebkitTextFillColor: disabled ? "rgba(0, 0, 0, 0.38)" : "initial" }}>Kliknite ovde kako biste odabrali fajl za import.</span>
                )}
                <Input type="file" onChange={handleChange} inputRef={ref} disabled={disabled} sx={{ display: "none" }} error={error !== null} />
            </ButtonBase>
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};

export const FilePicker = ({
    label,
    required,
    disabled,
    margin,
    value,
    error = null,
    onFilePicked = () => {},
    description,
    selectedFile,
    uiProp,
    multipleFileSelection = false,
    handleRemoveFile = () => {},
}) => {
    const ref = useRef();
    const [attachment, setAttachment] = useState(null);
    const [filename, setFilename] = useState("");

    const { size, type } = useFileSize(selectedFile);

    const handleChange = (event) => {
        const files = Array.from(event.target.files);
        const [file] = files;

        const fileExtension = file.name.split(".").pop().toLowerCase();
        const supportedTypes = uiProp?.fileUpload?.allow_format?.map((format) => format?.mime_type);
        const allowedSize = uiProp?.fileUpload?.allow_size;
        if (type) {
            if (!supportedTypes?.includes(type)) {
                toast.error("Pogrešan tip fajla.");
                return;
            }
        }
        if (size) {
            if (size > allowedSize) {
                toast.error("Fajl je prevelik.");
                return;
            }
        }

        // blobToData(file).then((result) => {
        //   let obj = {
        //     base_64: result,
        //     name: file?.name,
        //     file: file
        //   }
        // });

        const reader = new FileReader();
        reader.onload = (e) => {
            const base64 = e.target.result;
            const obj = {
                base_64: base64,
                name: file?.name,
                file: file,
            };

            setFilename(file.name);
            onFilePicked(obj);
        };
        reader.readAsDataURL(file);
        setAttachment(file);
    };

    const renderSelectedFiles = () => {
        if (multipleFileSelection) {
            return (
                selectedFile && (
                    <span style={{ fontSize: "0.9rem", WebkitTextFillColor: disabled ? "rgba(0, 0, 0, 0.38)" : "initial", display: "flex", width: "100%" }}>
                        Izabrani fajlovi:
                        {selectedFile.length > 0
                            ? selectedFile.map((file, index) => {
                                  return (
                                      <Box
                                          key={file.name}
                                          sx={{
                                              marginLeft: index === 0 ? "0.3rem" : "0",
                                              whiteSpace: "wrap",
                                              overflow: "hidden",
                                              textOverflow: "ellipsis",
                                          }}
                                      >
                                          {index > 0 && ", "}
                                          {file.name}
                                      </Box>
                                  );
                              })
                            : " Kliknite ovde kako biste odabrali fajl."}
                    </span>
                )
            );
        } else {
            return filename || value ? (
                <span style={{ fontSize: "0.9rem", WebkitTextFillColor: disabled ? "rgba(0, 0, 0, 0.38)" : "initial" }}>Izabrani fajl: {filename || value}</span>
            ) : (
                <span style={{ fontSize: "0.9rem", WebkitTextFillColor: disabled ? "rgba(0, 0, 0, 0.38)" : "initial" }}>Kliknite ovde kako biste odabrali fajl.</span>
            );
        }
    };

    const renderRemoveFilesList = () => {
        if (multipleFileSelection) {
            return selectedFile?.map((item, i) => (
                <span
                    span
                    key={item?.name}
                    style={{ fontSize: "0.9rem", WebkitTextFillColor: disabled ? "rgba(0, 0, 0, 0.38)" : "initial", display: "flex", alignItems: "center", marginRight: "0.8rem" }}
                >
                    {item?.name}
                    <CloseIcon
                        sx={{ fontSize: "0.9rem", cursor: "pointer", marginLeft: "0.2rem" }}
                        onClick={() => {
                            handleRemoveFile(item);
                        }}
                    />
                </span>
            ));
        }
    };

    const inputClasses = generateBootstrapClasses(uiProp?.columns);
    return (
        <InputWrapper label={label} required={required} disabled={disabled} margin={margin} error={error} inputClasses={inputClasses}>
            <ButtonBase
                component="label"
                sx={{
                    height: "2.844rem",
                    border: "1px solid",
                    borderColor: error ? "#d32f2f" : "rgba(0, 0, 0, 0.23)",
                    borderRadius: "0.25rem",
                    justifyContent: "start",
                    paddingLeft: "0.875rem",
                }}
            >
                <Input
                    type="file"
                    onChange={handleChange}
                    inputRef={ref}
                    disabled={disabled}
                    error={error !== null}
                    sx={{ display: "none" }}
                    multiple
                    inputProps={{
                        accept: uiProp?.fileUpload?.allow_format?.map((format) => format?.mime_type),
                    }}
                />
                {renderSelectedFiles()}
            </ButtonBase>
            <Box sx={{ display: "flex" }}>{renderRemoveFilesList()}</Box>
            <FormHelperText>{error ? error : description}</FormHelperText>
        </InputWrapper>
    );
};
