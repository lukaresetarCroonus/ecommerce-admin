import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import formFields from "../forms/prices.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import AuthContext from "../../../../store/auth-contex";

const Prices = ({ productId }) => {

  const navigate = useNavigate();
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [formFieldsTemp, setFormFieldsTemp] = useState(formFields);

  const additionalButtons = [
    {
      label: "Cenovnik",
      action: () => {
        navigate("/products/prices-groups");
      },
    },
  ];


  const filterFields = (fields, system) => {
    let arr = formFields;

    if (system === 'b2b') {
      arr = fields?.map((item, i) => {
        const { prop_name } = item;
        if (prop_name === 'name') {
          return {
            ...item,
            in_details: false
          }
        }
        if (prop_name === 'exclude_from_rebates') {
          return {
            ...item,
            in_details: true
          }
        }
        return {
          ...item
        }
      });
    }
    setFormFieldsTemp([...arr]);
  }

  const validateData = (data, field) => {
    let ret = data;
    switch (field) {
      case "price_single_with_out_vat":
      case "price_vat_procent":
      case "price_quantity":
        ret.price_with_out_vat = Math.round(ret.price_quantity * ret.price_single_with_out_vat * 100) / 100;
        ret.price_with_vat = Math.round((ret.price_vat_procent / 100 + 1) * ret.price_with_out_vat * 100) / 100;
        return ret;
      case "price_with_out_vat":
        ret.price_with_vat = Math.round((ret.price_vat_procent / 100 + 1) * ret.price_with_out_vat * 100) / 100;
        ret.price_single_with_out_vat = Math.round((ret.price_with_out_vat / ret.price_quantity) * 100) / 100;
        return ret;
      case "price_with_vat":
        ret.price_with_out_vat = Math.round((ret.price_with_vat / (ret.price_vat_procent / 100 + 1)) * 100) / 100;
        ret.price_single_with_out_vat = Math.round((ret.price_with_out_vat / ret.price_quantity) * 100) / 100;
        return ret;
      case "id_price_structure":
        let index = formFieldsTemp.findIndex((it) => { return it.prop_name === 'id_price_structure' });
        let systemObject = formFieldsTemp[index];
        let path = `${systemObject?.fillFromApi}/${systemObject?.prop_name}?id_price_structure=${ret?.id_price_structure}`;
        api.get(path)
          .then((response) => {
            const systemArr = response?.payload;
            const selectedSystemItem = systemArr.find((systemItem) => systemItem.id === ret.id_price_structure);
            if (selectedSystemItem) {
              filterFields(formFields, selectedSystemItem.system);
            }

          })
          .catch((error) => console.log(error));
        return ret;
      default:
        return ret;
    }
  };

  const customActions = {
    edit: {
      clickHandler: {
        type: 'modal_form',
        fnc: (rowData) => {
          filterFields(formFields, rowData?.system);
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

          api.delete(`admin/product-items/prices/${rowData.id}`)
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

  return (
    <>
      <ListPage
        validateData={validateData}
        listPageId="Prices"
        apiUrl={`admin/product-items/prices/${productId}`}
        editUrl={`admin/product-items/prices`}
        title=" "
        columnFields={formFieldsTemp}
        actionNewButton="modal"
        initialData={{ id_product: productId }}
        addFieldLabel="Dodajte novu cenu"
        showAddButton={true}
        additionalButtons={additionalButtons}
        customActions={customActions}
        useColumnFields={true}

      />
    </>
  );
}

export default Prices;
