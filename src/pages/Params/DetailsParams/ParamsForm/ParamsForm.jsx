import { useState, useEffect } from "react";

import Box from "@mui/material/Box";

import CreateForm from "../../../../components/shared/Form/CreateForm";
import Form from "../../../../components/shared/Form/Form";
import paramsTypeField from "../forms/paramsType.json";
import paramsCheckbox from "../forms/paramsCheckbox.json";
import basicForm from "../forms/paramBasicForm.json";
import slugName from "../forms/slugNameField.json";

const ParamsForm = ({ onSubmit = () => { }, onChange = () => { }, data = {}, subForm = [], isLoading = false }) => {
  const [paramType, setParamType] = useState(data.field_type ?? "long_text");
  const [multiParam, setMultiParam] = useState(data.field_is_multiple);

  const submitHandler = (data) => {
    const ret = {
      ...data,
      field_type: paramType,
      field_is_multiple: multiParam,
    };
    onSubmit(ret);
  };
  useEffect(() => {
    onChange({ ...data, field_type: paramType, field_is_multiple: multiParam });
  }, [multiParam, paramType]);

  useEffect(() => {
    if (!isLoading) {
      setParamType(data.field_type ?? "long_text");
      setMultiParam(data.field_is_multiple);
    }
  }, [data, isLoading]);

  return (
    <Box>
      <CreateForm onChangeHandler={({ target }) => setParamType(target.value)} item={paramsTypeField} value={paramType} />
      <CreateForm onChangeHandler={({ target }) => setMultiParam(target.checked)} item={paramsCheckbox} value={multiParam} />
      <Form formFields={[...slugName, ...subForm, ...basicForm]} initialData={data} onSubmit={submitHandler} onChange={onChange} />
    </Box>
  );
};

export default ParamsForm;
