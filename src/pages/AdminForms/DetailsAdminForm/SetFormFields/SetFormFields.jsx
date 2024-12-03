
import { useContext, useState } from "react";

import Button from "@mui/material/Button";

import AuthContext from "../../../../store/auth-contex";
import { deleteFormField } from "../../services";
import SetFormField from "./SetFormField";

const SetFormFields = ({ formFields = [], formId }) => {
  const init = {
    id: null,
    admin_form_id: formId,
    field_name: "",
    prop_name: "",
    input_type: "input",
    subtitle: "",
    in_main_table: false,
    in_details: false,
    disabled: false,
    required: false,
    sortable: false,
    editable: false,
    description: "",
    ui_prop: "",
    option_prop: "",
    fillFromApi: "",
    usePropName: false,
    order: 0,
  };
  const [fields, setFields] = useState(formFields);
  const { user } = useContext(AuthContext);

  const deleteHandler = async (id, dataId) => {
    if (dataId !== null) {
      try {
        await deleteFormField(user.access_token, dataId);
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

  return (
    <div>
      <Button onClick={addFieldHandler}>Add field</Button>
      {fields.map((field, index) => {
        return (
          <SetFormField
            key={field.id}
            data={field}
            index={index}
            onDelete={deleteHandler}
          />
        );
      })}
    </div>
  );
};

export default SetFormFields;
