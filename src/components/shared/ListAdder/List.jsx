import { useContext, useEffect, useState } from "react";

import AuthContext from "../../../store/auth-contex";
import ListItem from "./ListItem";

import styles from "./List.module.scss";
import Button from "../Button/Button";

const List = ({
  listFields = [],
  formFields = [],
  init = {},
  addFieldLabel = "Dodaj polje",
  required = [],
  onSave = () => { },
  onDelete = () => { },
  additionalButtons = [],
  actions = {},
  onChange,
  validateData,
}) => {
  const [fields, setFields] = useState(listFields);
  const { user } = useContext(AuthContext);

  const deleteHandler = async (id, dataId) => {
    if (dataId != null) {
      try {
        await onDelete(user.access_token, dataId);
      } catch (error) {
        console.warn(error);
      }
    }
    let newFields = [...fields.slice(0, id), ...fields.slice(id + 1)];
    setFields([...newFields]);
  };

  const addFieldHandler = () => {
    setFields([...fields, init]);
  };

  useEffect(() => {
    setFields(listFields);
  }, [listFields]);

  return (
    <div className={styles.list}>
      <div className={styles.buttonsHolder}>
        <Button label={addFieldLabel} onClick={addFieldHandler} icon="add" variant="contained" />

        <div className={styles.additionalButtonsHolder}>
          {additionalButtons.map((button, index) => {
            return <Button key={button.text + index} icon={button.icon} label={button.text} onClick={button.action} />;
          })}
        </div>
      </div>

      {Array.isArray(fields) &&
        fields.map((field, index) => {
          return (
            <ListItem
              key={field.id != null ? field.id : `${index}new`}
              data={listFields[index] ?? init}
              index={index}
              onDelete={deleteHandler}
              saveData={onSave}
              required={required}
              formFields={formFields}
              actions={actions}
              onChange={onChange}
              validateData={validateData}
            />
          );
        })}
    </div>
  );
};

export default List;
