import React, { useContext, useEffect, useState } from "react";

import Icon from "@mui/material/Icon";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";

import { InputInput, InputNumber } from "../../../../../../components/shared/Form/FormInputs/FormInputs";
import SelectionModal from "../SelectionModal/SelectionModal";
import Loading from "../../../../../../components/shared/Loading/Loading";

import scss from "./InputValue.module.scss";
import AuthContext from "../../../../../../store/auth-contex";

const InputValue = ({
  fillFromApi,
  queryString,
  selectedValues,
  usePropName,
  setOpenDialog,
  openDialog,
  name,
  component,
  inputType,
  onChange
}) => {
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [opt, setOpt] = useState([]);
  const [options, setOptions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOpt, setIsLoadingOpt] = useState(false);

  useEffect(() => {
    let isMounted = true;
    let path = usePropName
      ? `${fillFromApi}/${name}?${queryString}&input_type=${inputType}&component=${component}`
      : `${fillFromApi}?${queryString}`;
    const fillDdl = async () => {
      setIsLoading(true);
      await api
        .post(path, options)
        .then((response) => {
          if (isMounted) {
            setOpt(response?.payload);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          console.warn(error);
          setIsLoading(false);
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
    let isMounted = true;
    let path = usePropName
      ? `${fillFromApi}/${name}?${queryString}&input_type=${inputType}&component=${component}`
      : `${fillFromApi}?${queryString}`;
    const fillDdl = async () => {
      setIsLoadingOpt(true);
      await api
        .post(path, options)
        .then((response) => {
          if (isMounted) {
            setOpt(response?.payload);
          }
          setIsLoadingOpt(false);
        })
        .catch((error) => {
          console.warn(error);
          setIsLoadingOpt(false);
        });
    };

    if (fillFromApi) {
      fillDdl();
    }

    return () => {
      isMounted = false;
    };
  }, [options]);


  const InputComponent = () => {
    switch (inputType) {
      case 'text':
        return <InputInput autoFocus={true} value={selectedValues ?? ""} onChange={(e) => onChange(e.target.value)} />;
      case 'number':
        return <InputNumber autoFocus={true} value={selectedValues ?? ""} onChange={(e) => onChange(e.target.value)} />;
      default:
        return (
          <InputInput
            value={
              Array.isArray(selectedValues)
                ? selectedValues.map((item) => item.name).join(', ')
                : selectedValues ?? ""

            }
            onChange={() => { }}
            disabled={true}
          />
        );
    }
  };

  return !isLoading ? (
    <div className={scss.valueIcon}>
      {InputComponent()}

      {inputType !== 'text' && inputType !== 'number' && (
        <>
          <Tooltip
            title={
              'Ukoliko želite da vidite vrednosti, kliknite ovde.'
            }
            placement="top"
            arrow
          >
            <IconButton
              className={scss.showValues}
              onClick={() => {
                setOpenDialog({ show: true });
              }}
            >
              <Icon>list</Icon>
            </IconButton>
          </Tooltip>

          <SelectionModal
            openDialog={openDialog}
            setOpenDialog={setOpenDialog}
            selectedValues={selectedValues}
            component={component}
            fillFromApi={fillFromApi}
            opt={opt}
            options={options}
            setOptions={setOptions}
            onChange={onChange}
            inputType={inputType}
            isLoadingOpt={isLoadingOpt}
          />
        </>
      )}
    </div>
  ) : (
    <Loading size="1rem" />
  );
};

export default InputValue;
