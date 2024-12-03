import { useState, useEffect, useContext } from "react";
import { toast } from "react-toastify";
import formFields from "../forms/delivery_address.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import AuthContext from "../../../../store/auth-contex";


const DeliveryAdresss = ({ companyId, data }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);

  const [dataDeliveryAdress, setDataDeliveryAdress] = useState(null);
  const customActions = {
    edit: {
      clickHandler: {
        type: 'modal_form',
        fnc: (rowData) => {
          api.get(`admin/customers-b2b/delivery-address/${rowData.id}`)
            .then((response) => {
              setDataDeliveryAdress(response?.payload);
            })
            .catch((error) => console.log(error));
          return {
            show: true,
            id: rowData.id
          };
        },
      },
    },
    delete: {
      clickHandler: {
        type: 'dialog_delete',
        fnc: (rowData) => {
          return {
            show: true,
            id: rowData.id,
            mutate: null,
          };
        },
      },
      deleteClickHandler: {
        type: 'dialog_delete',
        fnc: (rowData) => {

          api.delete(`admin/customers-b2b/delivery-address/${rowData.id}`)
            .then(() => toast.success("Zapis je uspešno obrisan"))
            .catch((err) => toast.warning(err?.response?.data?.message ?? err?.response?.data?.payload?.message ?? "Došlo je do greške prilikom brisanja"));

          return {
            show: false,
            id: rowData.id,
            mutate: 1,
          };
        }
      },
    },
  };

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
            if (item.prop_name === 'zip_code') {
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

  const savePrapareDataHandler = (options) => {

    options?.formFields?.map((item, i) => {
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

  useEffect(() => {
    if (dataDeliveryAdress?.id_country) {
      fetchPlacesFormFields(formFields, dataDeliveryAdress?.id_country);
    }
  }, [dataDeliveryAdress])


  return (
    <>
      <ListPage
        validateData={validateData}
        listPageId="DeliveryAdresss"
        apiUrl={`admin/customers-b2b/delivery-address/${companyId}`}
        editUrl={`admin/customers-b2b/delivery-address`}
        savePrapareDataHandler={savePrapareDataHandler}
        title=" "
        columnFields={formFieldsTemp}
        actionNewButton="modal"
        initialData={{ id_company: companyId }}
        addFieldLabel="Dodajte adresu dostave"
        showAddButton={true}
        customActions={customActions}
        useColumnFields={true}
        selectableCountryTown={true}
        onNewButtonPress={() => setFormFieldsTemp(formFields)}
      />
    </>
  );
}

export default DeliveryAdresss;
