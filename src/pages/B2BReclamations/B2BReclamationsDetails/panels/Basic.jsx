import React, { useContext, useEffect, useState } from 'react'
import AuthContext from '../../../../store/auth-contex';
import basic_data from "../forms/basic_data.json";
import Form from '../../../../components/shared/Form/Form';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Basic = ({ data, onClickUpdateData = () => { } }) => {

  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const navigate = useNavigate();

  const [basicDataTemp, setBasicDataTemp] = useState(basic_data);
  const [basicData, setBasicData] = useState(data);
  const [options, setOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);

  const handleSubmit = (data) => {
    setIsLoadingOnSubmit(true);
    let oldId = data.id;
    api.post(`admin/reclamations-b2b/basic-data`, { ...data })
      .then((response) => {
        setBasicData(response?.payload);
        onClickUpdateData(response?.payload);
        toast.success("Uspešno");
        if (oldId === null) {
          let tId = response?.payload?.id;
          navigate(`/b2b-reclamations/${tId}`, { replace: true });
        }
        setIsLoadingOnSubmit(false);
      })
      .catch((error) => {
        console.warn(error);
        toast.warning("Greška");
        setIsLoadingOnSubmit(false);
      });
  };

  const updateFormFields = (newData) => {
    setBasicData(newData);
  };

  const validateData = (data, field) => {
    let ret = data;
    switch (field) {
      case "id_company":
        setSelectedOption(ret.id_company)
        return ret;
      default:
        return ret;
    }
  };

  const fetchOptions = () => {
    api.get(`admin/reclamations-b2b/basic-data/ddl/id_company`)
      .then((response) => {
        setOptions(response?.payload);
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  const fetchDataOfCompany = (selectedOption) => {
    api.get(`admin/reclamations-b2b/basic-data/customer-data/${selectedOption}`)
      .then((response) => {
        const newData = response?.payload;
        updateFormFields({ ...newData, id_company: selectedOption, id: data.id });
      })
      .catch((error) => {
        console.warn(error);
      });
  }

  useEffect(() => {
    fetchOptions();
  }, [])


  useEffect(() => {
    fetchDataOfCompany(selectedOption);
  }, [selectedOption])


  useEffect(() => {
    setBasicDataTemp((prevBasicData) =>
      prevBasicData.map((item) => {
        if (item.prop_name === "id_company") {
          if (basicData.id !== null) {
            return {
              ...item,
              disabled: true,
            };
          }
        }
        return item;
      })
    );

  }, [basicData.id])

  return (
    <Form
      formFields={basicDataTemp}
      initialData={basicData}
      isLoading={isLoadingOnSubmit}
      validateData={validateData}
      onSubmit={handleSubmit}
    />
  )
}

export default Basic