import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import formFields from "../forms/payments.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import AuthContext from "../../../../store/auth-contex";

const Payments = ({ data, customerId }) => {

  const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);
  const [type, setType] = useState('');
  const [idCountrySelected, setIdCountrySelected] = useState(null);
  const [showResetButton, setShowResetButton] = useState(false);

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const customActions = {
    edit: {
      clickHandler: {
        type: 'modal_form',
        fnc: (rowData) => {
          setShowResetButton(false);
          setIdCountrySelected(rowData?.id_country);
          fetchPlacesAndFilterFileds(rowData);
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
          api.delete(`admin/customers-b2c/billing-address/${rowData.id}`)
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

  const validateData = (data, field) => {
    let ret = data;
    switch (field) {
      case "customer_type":
        let tempData = { id_country: idCountrySelected };
        if (tempData?.id_country) {
          fetchPlacesAndFilterFileds(tempData);
        } else {
          setType(data?.customer_type);
        }
        return ret;
      case 'id_country':
        setIdCountrySelected(data?.id_country);
        fetchPlacesAndFilterFileds(data);
        return ret;
      default:
        return ret;
    }
  };

  const fetchPlacesAndFilterFileds = (data) => {
    let index = formFields.findIndex((it) => { return it.prop_name === 'id_town' });
    let townObject = formFields[index];
    let path = `${townObject?.fillFromApi}/${townObject?.prop_name}?id_country=${data?.id_country}`;
    api.get(path)
      .then((response) => {
        const placeArr = response?.payload;
        filterFormFieldsInitialy(type, placeArr, true);
      })
      .catch((error) => console.log(error));
  }

  const filterFormFieldsInitialy = (type, townArr, countryChange) => {
    let hasTowns = townArr?.length > 0;
    let arr = formFieldsTemp?.map((formItem, i) => {
      const { company_display, personal_display, prop_name } = formItem;
      if (type === 'company') {
        if (company_display) {
          if (countryChange) {
            if (prop_name === 'id_town') {
              if (hasTowns) {
                return {
                  ...formItem,
                  in_details: true
                }
              } else {
                return {
                  ...formItem,
                  in_details: false
                }
              }
            }
            if (prop_name === 'town_name' || prop_name === 'zip_code') {
              if (hasTowns) {
                return {
                  ...formItem,
                  in_details: false
                }
              } else {
                return {
                  ...formItem,
                  in_details: true
                }
              }
            }
          }
          if (prop_name === 'id_town' || prop_name === 'town_name' || prop_name === 'zip_code') {
            return {
              ...formItem,
              in_details: false
            }
          }
          return {
            ...formItem,
            in_details: true
          }
        } else {
          return {
            ...formItem,
            in_details: false
          }
        }
      } else {
        if (personal_display) {
          if (countryChange) {
            if (prop_name === 'id_town') {
              if (hasTowns) {
                return {
                  ...formItem,
                  in_details: true
                }
              } else {
                return {
                  ...formItem,
                  in_details: false
                }
              }
            }
            if (prop_name === 'town_name' || prop_name === 'zip_code') {
              if (hasTowns) {
                return {
                  ...formItem,
                  in_details: false
                }
              } else {
                return {
                  ...formItem,
                  in_details: true
                }
              }
            }
          }
          if (prop_name === 'id_town' || prop_name === 'town_name' || prop_name === 'zip_code') {
            return {
              ...formItem,
              in_details: false
            }
          }
          return {
            ...formItem,
            in_details: true
          }
        } else {
          return {
            ...formItem,
            in_details: false
          }
        }
      }
    });
    setFormFieldsTemp([...arr]);
  }


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
    setType(data?.customer_type);
  }, [data]);

  useEffect(() => {
    filterFormFieldsInitialy(type, [], false);
  }, [type]);

  return (
    <>
      <ListPage
        validateData={validateData}
        listPageId="B2CPayments"
        apiUrl={`admin/customers-b2c/billing-address/${customerId}`}
        title=" "
        columnFields={formFieldsTemp}
        actionNewButton="modal"
        addFieldLabel="Dodajte novu vrednost"
        showAddButton={true}
        initialData={{ id_customer: customerId }}
        customActions={customActions}
        onNewButtonPress={() => {
          setType(data?.customer_type);
          setShowResetButton(true);
        }}
        clearButton={showResetButton}
        selectableCountryTown={true}
        useColumnFields={true}
        onModalInitDataChange={(data, type) => { console.log("Aaa") }}
        onModalCancel={() => {
          setIdCountrySelected(null);
          filterFormFieldsInitialy(type, [], false);
        }}
        savePrapareDataHandler={savePrapareDataHandler}
      />
    </>
  );
};

export default Payments;
