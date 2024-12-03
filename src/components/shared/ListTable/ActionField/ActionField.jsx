import Icon from "@mui/material/Icon";

import scss from "./ActionField.module.scss";
import Tooltip from "@mui/material/Tooltip";

/**
 * A standardized button with an optional icon.
 *
 * @param {string} fieldType Action type with all combination
 * @param {bool} systemRequired Set to true to hide "Delete" button.
 * @param {function} handlePreview The callback to invoke when the preview button is clicked.
 * @param {function} handleDelete The callback to invoke when the delete button is clicked.
 * @param {function} handleEdit The callback to invoke when the edit button is clicked.
 * @param {function} handleListGroup The callback to invoke when the edit button is clicked.
 * @param {function} handleCategoryTree The callback to invoke when the edit button is clicked.
 * @param {Object{type: {handler:function, icon: ""}}} customActions To display icons.
 * @param rowData Values ​​of row.
 *
 * @return {JSX.Element}
 * @constructor
 */
const ActionField = ({ fieldType, systemRequired, handleOnClickActions, customActions, rowData }) => {
    /**
     * Parse action into button parameters.
     *
     * @param {string} action The name of the action.
     *
     * @return {(string|function)[]|null} Tuple of "icon" and the action for the onClick listener.
     */

    // Actions are joined with '_', extract them and make sure we can parse then into button parameters
    const actions = () => {
        let default_buttons = fieldType.split("_");

        //If only shows buttons fot which key is defined in JSON, in input_type
        if (default_buttons.length) {
            if (typeof customActions === "object") {
                default_buttons.map((display_button) => {
                    Object.keys(customActions).map((key) => {
                        if (display_button == key) {
                            customActions[key].display = true;
                        }
                    });
                });
            }
        }

        if (typeof customActions === "object") {
            Object.keys(customActions).map((key) => {
                if ("delete" == key && systemRequired) {
                    customActions[key].display = false;
                }
            });
        }

        let buttons = Object.keys(customActions)
            .map((key) => customActions[key])
            .filter((item) => item.display === true)
            .sort((a, b) => a.position - b.position);

        return buttons;
    };

    return (
        <div className={scss.wrapper}>
            <div className={scss.wrapper}>
                {Object.entries(actions()).map((item) => {
                    let haveDisplayCondition = item[1].displayCondition !== undefined ? true : false;
                    if (haveDisplayCondition) {
                        let visibility = item[1]?.displayCondition.fnc(rowData);
                        if (visibility) {
                            return item[1]?.title ? (
                                <Tooltip key={item[0]} title={item[1].title} placement="top" arrow>
                                    <span key={item[0]} className={`${scss.icon}`} onClick={handleOnClickActions(rowData.id, item[1].type, rowData, item[1])}>
                                        <Icon className={item[1].icon}>{item[1].icon} </Icon>
                                    </span>
                                </Tooltip>
                            ) : (
                                <span key={item[0]} className={`${scss.icon} `} onClick={handleOnClickActions(rowData.id, item[1].type, rowData, item[1])}>
                                    <Icon className={item[1].icon}>{item[1].icon} </Icon>
                                </span>
                            );
                        }
                    } else {
                        return item[1]?.title ? (
                            <Tooltip key={item[0]} title={item[1].title} placement="top" arrow>
                                <span key={item[0]} className={`${scss.icon}`} onClick={handleOnClickActions(rowData.id, item[1].type, rowData, item[1])}>
                                    <Icon className={item[1].icon}>{item[1].icon} </Icon>
                                </span>
                            </Tooltip>
                        ) : (
                            <span key={item[0]} className={`${scss.icon} `} onClick={handleOnClickActions(rowData.id, item[1].type, rowData, item[1])}>
                                <Icon className={item[1].icon}>{item[1].icon} </Icon>
                            </span>
                        );
                    }
                })}
            </div>
        </div>
    );
};

export default ActionField;
