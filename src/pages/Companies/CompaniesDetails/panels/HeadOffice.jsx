import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import Form from "../../../../components/shared/Form/Form";
import formFields from "../forms/head_office_address.json";
import AuthContext from "../../../../store/auth-contex";

const HeadOffice = ({ companyId }) => {

  const init = {
    id: null,
    id_company: companyId,
    address: null,
    object_number: null,
    floor: null,
    apartment_number: null,
    id_town: null,
    town_name: null,
    zip_code: null,
    municipality_name: null,
    id_country: null,
    country_name: null,
    note: null,
  };
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const [data, setData] = useState(init);
  const apiPath = "admin/customers-b2b/head-office-address";
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
  const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);

  const handleData = () => {
    api.get(`${apiPath}/${companyId}`)
      .then((response) => setData(response?.payload))
      .catch((error) => console.warn(error));
  };
  const saveData = (data) => {
    setIsLoadingOnSubmit(true);
    let index = formFieldsTemp.findIndex(it => it.prop_name === "id_town");
    if (!formFieldsTemp[index].in_details) {
      data = { ...data, id_town: null, municipality_name: null };
    }
    api.post(`${apiPath}`, { ...data, id_company: companyId })
      .then((response) => {
        setData(response?.payload);
        toast.success("Uspešno");
        setIsLoadingOnSubmit(false);
      })
      .catch((error) => {
        console.warn(error);
        toast.warn("Greška");
        setIsLoadingOnSubmit(false);
      });
  };

  useEffect(() => {
    handleData();
  }, []);

  useEffect(() => {
    if (data.id_country) {
      fetchPlacesFormFields(formFields, data?.id_country);
    }
  }, [data]);

  const fetchPlacesFormFields = async (formFields, id_country) => {
    let index = formFields.findIndex((it) => { return it.prop_name === 'id_town' });

    const townObject = formFields[index];
    let path = `${townObject.fillFromApi}?id_country=${id_country}`;
    if (townObject?.usePropName) {
      path = `${townObject.fillFromApi}/${townObject.prop_name}?id_country=${id_country}`;
    }
    await api
      .get(path)
      .then((response) => {
        let res = response?.payload;
        let arr = formFields.map((item, i) => {
          if (item.prop_name === 'id_town') {
            if (res.length > 0) {
              return {
                ...item,
                queryString: `id_country=${id_country}`,
                in_details: true,
                required: true
              }
            } else {
              return {
                ...item,
                in_details: false,
                required: false
              }
            }
          } else {
            if (item.prop_name === 'town_name') {
              if (res.length > 0) {
                return {
                  ...item,
                  in_details: false,
                  required: false
                }
              } else {
                return {
                  ...item,
                  in_details: true,
                  required: true
                }
              }
            }
            if (item.prop_name === 'zip_code') {
              if (res.length > 0) {
                return {
                  ...item,
                  in_details: false,
                  required: false
                }
              } else {
                return {
                  ...item,
                  in_details: true,
                  required: true
                }
              }
            }
            return {
              ...item
            }
          }
        });
        setFormFieldsTemp([...arr]);
      })
      .catch((error) => {
        console.warn(error);
      });
  }



  const validateData = (data, field) => {
    let ret = data;
    switch (field) {
      case 'id_country':
        fetchPlacesFormFields(formFields, data?.id_country);
        return ret;
      default:
        return ret;
    }
  };

  return <Form formFields={formFieldsTemp} initialData={data} onSubmit={saveData} isLoading={isLoadingOnSubmit} validateData={validateData} />;
};

export default HeadOffice;
