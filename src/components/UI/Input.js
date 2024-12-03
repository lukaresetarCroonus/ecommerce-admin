import TextField from "@mui/material/TextField";

const Input = (props) => {
    const inputElement = () => {
        const inputId = props.id ? props.id.toString() : Math.random().toString();
        const errorVisible = props.inputErrorVisible !== undefined ? props.inputErrorVisible : true;
        const errorText = props.inputErrorText ? props.inputErrorText : `${props.text} nije validna!`;

        switch (props.inputType) {
            case "input":
                return (
                    <TextField
                        label={props.text && props.text}
                        autoComplete={props.offAutoComplete ? "new-password" : ""}
                        value={props.inputValue}
                        onKeyDown={props.onInputKeyDown}
                        onChange={props.onInputChange}
                        onBlur={props.onInputBlur}
                        id={inputId}
                        type={props.type ? props.type : "text"}
                        className={props.class ? props.class : ""}
                        disabled={props.disabled}
                        error={props.hasInputError}
                        helperText={props.hasInputError ? errorText : ""}
                        size="medium"
                        margin="normal"
                        InputLabelProps={{
                            shrink: true,
                        }}
                        sx={props.sx}
                    />
                );

            case "textarea":
                return (
                    <>
                        <TextField
                            label={props.text && props.text}
                            multiline
                            rows={4}
                            disabled={props.disabled}
                            value={props.inputValue}
                            onChange={props.onInputChange}
                            onBlur={props.onInputBlur}
                            id={props.id ? props.id : Math.random()}
                            className={props.class ? props.class : ""}
                            variant="outlined"
                            error={props.hasInputError}
                            helperText={props.hasInputError ? props.text + " " + errorText : ""}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />
                    </>
                );
            default:
                return <h1>No input type match!</h1>;
        }
    };

    return inputElement();
};

export default Input;
