import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import formFields from "../forms/delivery.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import AuthContext from "../../../../store/auth-contex";

const Payments = ({ data, customerId }) => {

  const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);
  const [dataDeliveryAdress, setDataDeliveryAdress] = useState(null);
  const [showResetButton, setShowResetButton] = useState(false);

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const customActions = {
    edit: {
      clickHandler: {
        type: 'modal_form',
        fnc: (rowData) => {
          api.get(`admin/customers-b2c/shipping-address/${rowData.id}`)
            .then((response) => {
              setShowResetButton(false);
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

          api.delete(`admin/customers-b2c/shipping-address/${rowData.id}`)
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
        listPageId="B2CCustomerDelivery"
        apiUrl={`admin/customers-b2c/shipping-address/${customerId}`}
        editUrl={`admin/customers-b2c/shipping-address`}
        title=" "
        validateData={validateData}
        columnFields={formFieldsTemp}
        actionNewButton="modal"
        addFieldLabel="Dodajte novu vrednost"
        showAddButton={true}
        initialData={{ id_customer: customerId }}
        useColumnFields={true}
        clearButton={showResetButton}
        customActions={customActions}
        selectableCountryTown={true}
        onNewButtonPress={() => { setFormFieldsTemp(formFields); setShowResetButton(true) }}
      />
    </>
  );
};

export default Payments;
