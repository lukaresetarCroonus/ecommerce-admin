import { useContext, useEffect, useState } from "react";
import ListPage from "../../components/shared/ListPage/ListPage";

import formFields from "./tblFields.json";
import AuthContext from "../../store/auth-contex";

const B2CCareer = () => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);
  const [dataCareer, setDataCareer] = useState(null);

  const customActions = {
    edit: {
      clickHandler: {
        type: 'modal_form',
        fnc: (rowData) => {
          api.get(`admin/career-b2c/basic-data/${rowData.id}`)
            .then((response) => {
              setDataCareer(response?.payload);
            })
            .catch((error) => console.log(error));
          return {
            show: true,
            id: rowData.id
          };
        },
      },
    },
  }


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
                in_details: true
              }
            } else {
              return {
                ...item,
                in_details: false
              }
            }
          } else {
            if (item.prop_name === 'town_name') {
              if (res.length > 0) {
                return {
                  ...item,
                  in_details: false
                }
              } else {
                return {
                  ...item,
                  in_details: true
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

  const savePrapareDataHandler = (options) => {
    options.formFields.map((item, i) => {
      if (item.prop_name === 'id_town' && item.in_details === true) {
        options.connectedData.town_name = null;

        // Set null if no selected town
        if (options.connectedData.id_town === "") {
          options.connectedData.id_town = null;
        }
      }
      if (item.prop_name === 'town_name' && item.in_details === true) {
        options.connectedData.id_town = null;
      }
    });

    return {
      'setData': true,
      'data': options.connectedData,
    };
  };

  useEffect(() => {
    if (dataCareer?.id_country) {
      fetchPlacesFormFields(formFields, dataCareer?.id_country);
    }
  }, [dataCareer])



  return (
    <ListPage
      listPageId="B2CCareer"
      apiUrl="admin/career-b2c/list"
      editUrl="admin/career-b2c/basic-data"
      deleteUrl="admin/career-b2c/list"
      validateData={validateData}
      customActions={customActions}
      savePrapareDataHandler={savePrapareDataHandler}
      title="Karijera"
      columnFields={formFieldsTemp}
      actionNewButton="modal"
      selectableCountryTown={true}
      useColumnFields={true}
      onNewButtonPress={() => { setFormFieldsTemp(formFields); }}
    />
  );
};

export default B2CCareer;
