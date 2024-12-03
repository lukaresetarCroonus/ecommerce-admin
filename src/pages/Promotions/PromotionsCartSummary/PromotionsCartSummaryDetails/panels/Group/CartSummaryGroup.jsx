import { useState, useEffect, useContext } from "react";

import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Button from "../../../../../../components/shared/Button/Button";
import Buttons from "../../../../../../components/shared/Form/Buttons/Buttons";
import { InputSelect } from "../../../../../../components/shared/Form/FormInputs/FormInputs";

import scss from "./Group.module.scss";
import AuthContext from "../../../../../../store/auth-contex";


const Group = ({ id, data, rules, handleAddComponent, handleRemoveComponent }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [dataGroup, setDataGroup] = useState({ ...data, id });

  const [fieldCondition, setFieldCondition] = useState(null);

  const [fieldValue, setFieldValue] = useState(null);

  const apiPath = "admin/campaigns/cart-summary/conditions";

  useEffect(() => {
    setFieldCondition(getValueField("condition"));
    setFieldValue(getValueField("value"));
  }, []);

  const getValueField = (find_field) => {
    let temp = dataGroup?.fields.find((item) => {
      return item.field === find_field;
    });

    if (temp) {
      return temp.selected.id;
    } else {
      return null;
    }
  };

  const setValueField = (find_field, selected_id, selected_name) => {
    const updatedDataGroup = { ...dataGroup };
    const field = updatedDataGroup.fields.find(item => item.field === find_field);
    field.selected.id = selected_id;
    field.selected.name = selected_name;
    setDataGroup(updatedDataGroup);
  };

  let isLastSelected = true;

  return (
    <div className={scss.groupBox}>
      <Tooltip title={"Obrišite grupu"} placement="top" arrow>
        <IconButton
          className={scss.removeGroup}
          onClick={() => {
            handleRemoveComponent(id, "group");
          }}>
          <Icon>delete</Icon>
        </IconButton>
      </Tooltip>

      <div className={scss.groupHolder}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          Ako su
          <span className={scss.span}>
            <InputSelect className={scss.inputConditionValue} label="" required={false} name="" fillFromApi={`${apiPath}/group/ddl/condition`} usePropName={false} value={fieldCondition} options={[]}
              onChange={({ target }, { props }) => {
                setFieldCondition(target.value);
                setValueField("condition", target.value, props.valuename);
              }}
            />
          </span>
          navedeni uslovi
          <span className={scss.span}>
            <InputSelect className={scss.inputConditionValue} label="" required={false} name="" fillFromApi={`${apiPath}/group/ddl/value`} usePropName={false} value={fieldValue} options={[]}
              onChange={({ target }, { props }) => {
                setFieldValue(target.value);
                setValueField("value", target.value, props.valuename);
              }}
            />
          </span>
        </Box>
      </div>

      <div className={scss.rulesHolder}>{rules}</div>

      <div className={`${scss.buttonHolder}`}>
        <Buttons>
          <Button
            label="Novi uslov"
            icon={<Icon>difference</Icon>}
            sx={{ width: "100%" }}
            disabled={!isLastSelected}
            onClick={() => {
              handleAddComponent(id, "row", "cart_summary");
            }}
          />
        </Buttons>
        <Buttons>
          <Button
            label="Dodajte grupu"
            icon={<Icon>difference</Icon>}
            sx={{ width: "100%" }}
            onClick={() => {
              handleAddComponent(id, "group", "cart_summary");
            }}
          />
        </Buttons>
      </div>
    </div>
  );
};

export default Group;
