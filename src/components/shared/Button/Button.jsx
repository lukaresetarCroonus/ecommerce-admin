import { Button as MaterialButton } from "@mui/material";
import scss from "./Button.module.scss";
import Icon from "@mui/material/Icon";
import { ClassNames } from "@emotion/react";
import Tooltip from "@mui/material/Tooltip";

/**
 * A standardized button with an optional icon.
 *
 * @param {string} icon The optional icon to use, @see https://mui.com/material-ui/material-icons/.
 * @param {string} label The label on the button.
 * @param {function} onClick The callback to invoke when the button is clicked.
 * @param {"button"|"reset"|"submit"} type The HTML button type.
 * @param {"text"|"contained"|"outlined"} variant The variant of the button to use.
 * @param {boolean} disabled If button is disabled
 * @param sx Button styling
 *
 *
 * @param href
 * @param className
 * @param tooltip
 * @return {JSX.Element}
 * @constructor
 */
const Button = ({ icon, label, onClick, type = "button", variant = "outlined", disabled = false, sx = {}, href, className, tooltip = { enable: false, message: "" } }) => {
    return (
        <MaterialButton onClick={onClick} variant={variant} className={`${scss.button} ${tooltip?.enable ? scss.pointerEvents : ""}`} type={type} disabled={disabled} sx={sx} href={href}>
            {icon && <Icon className={scss.icon}>{icon}</Icon>}
            {tooltip?.enable ? (
                <Tooltip placement={`top`} title={`${tooltip?.message}`}>
                    {label}
                </Tooltip>
            ) : (
                label
            )}
        </MaterialButton>
    );
};

export default Button;
