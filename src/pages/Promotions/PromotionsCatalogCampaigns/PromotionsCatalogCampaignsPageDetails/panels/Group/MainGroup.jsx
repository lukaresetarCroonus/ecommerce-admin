import { useState, useEffect, useContext } from "react";

import Box from "@mui/material/Box";
import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import Button from "../../../../../../components/shared/Button/Button";
import Buttons from "../../../../../../components/shared/Form/Buttons/Buttons";
import buttons from "./buttons.json"
import { InputSelect } from "../../../../../../components/shared/Form/FormInputs/FormInputs";

import scss from "./Group.module.scss";
import ListPageModalWrapper from "../../../../../../components/shared/Modal/ListPageModalWrapper";
import { Typography } from "@mui/material";
import AuthContext from "../../../../../../store/auth-contex";

const Group = ({ id, data, rules, handleAddComponent, handleRemoveComponent }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [dataGroup, setDataGroup] = useState({ ...data, id });

  const [fieldCondition, setFieldCondition] = useState(null);

  const [fieldValue, setFieldValue] = useState(null);

  const [showModal, setShowModal] = useState(false);

  const apiPath = "admin/campaigns/product-catalog/conditions";

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
            label="Dodajte grupu"
            icon={<Icon>difference</Icon>}
            sx={{ width: "100%" }}
            onClick={() => {
              if (buttons.length > 1) {
                setShowModal(true);
              } else {
                handleAddComponent(id, "group", buttons[0].id);
              }
            }}
          />
        </Buttons>
      </div>

      <ListPageModalWrapper anchor="right" open={showModal} onClose={() => setShowModal(false)} onCloseButtonClick={() => setShowModal(false)} styleBox={{ display: "flex", justifyContent: "center", alignItems: "center", flexDirection: "column", height: "inherit" }}>
        <Typography variant="h5" sx={{ margin: "1.5rem 0 0 0" }}>
          Izaberite grupu za uslove
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "column", margin: "auto" }}>
          {buttons.map((button) => (
            <Button
              key={button.id}
              label={button.name}
              onClick={() => {
                handleAddComponent(id, "group", button.id);
                setShowModal(false);
              }}
              sx={{ width: "20rem", marginBottom: "1rem", padding: "0.5rem 0 0.5rem 0" }}
            />
          ))}
        </Box>

      </ListPageModalWrapper >
    </div >


  );
};

export default Group;
