import { useCallback, useContext, useEffect, useMemo, useState } from "react";

import Box from "@mui/system/Box";

import Form from "../../../../../components/shared/Form/Form";
import AuthContext from "../../../../../store/auth-contex";


const GroupField = ({ name = "", slug = "", groupId, setId, nameSet, slugSet, onChange = () => { }, productId, apiPath }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [attributes, setAttributes] = useState([]);
  const [attributeValues, setAttributeValues] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  const [formFiledsState, setFormFieldsState] = useState(null);

  const [data, setData] = useState({});

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  let timer = null;

  const groupFiledsHandler = async () => {
    api.get(`${apiPath}/group-attributes/${groupId}`)
      .then((response) => {
        setAttributes(response?.payload)
      })
      .catch((error) => console.warn(error));
  };

  const groupFiledsDataHandler = async () => {
    setIsLoading(true);
    api.get(`${apiPath}/product/attribute-values/${productId}/${setId}/${groupId}`)
      .then((response) => {
        let obj = {};
        obj.id = {};
        for (const attr of attributes) {
          let item = response?.payload.filter((val) => val.id_attribute === attr.id)[0];
          if (item) {
            if (attr.field_type === "multi_select") {
              obj[item.slug_attribute] = typeof item.id_attribute_value !== "object" ? [item.id_attribute_value] : item.id_attribute_value;
            } else if (attr.field_type === "select") {
              obj[item.slug_attribute] = item.id_attribute_value;
            } else {
              obj[item.slug_attribute] = item.name_attribute_value;
            }
            obj.id[item.slug_attribute] = item.id;
          }
        }
        setData(obj);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    groupFiledsHandler();
  }, []);

  useEffect(() => {
    groupFiledsDataHandler();
  }, [attributes]);


  const formFields = useMemo(() => {
    return attributes.map((item) => {
      let additional = {};
      if (item.field_type === "multi_select" || item.field_type === "select") {
        api.get(`${apiPath}/attribute-values/${item.id}`)
          .then((response) => {

            setAttributeValues((attributeValues) => {
              attributeValues[item.id] = response?.payload;
              return attributeValues;
            });
          })
          .catch((error) => {
            console.warn(error);
          });

        additional = {
          fillFromApi: `${apiPath}/attribute-values/${item.id}`,
          usePropName: false,
          options: [],
        };
      }
      return {
        field_name: item.name,
        prop_name: item.slug,
        in_main_table: true,
        in_details: true,
        editable: true,
        disabled: false,
        required: item.required,
        description: "",
        ui_prop: "xyz",
        sortable: true,
        input_type: item.field_type,
        ...additional,
      };
    });
  }, [attributes]);

  const changeHandler = (data, field_change_id) => {
    for (const attribute of attributes) {
      // lastChange
      if (attribute.slug === field_change_id) {
        switch (attribute.field_type) {
          case 'input':
          case 'textarea':
          case 'html_editor':
            clearTimeout(timer);
            timer = setTimeout(() => {
              onChange(data, attributes, attributeValues, field_change_id);
              setData(data);
            }, 500);
            break;
          default:
            onChange(data, attributes, attributeValues, field_change_id);
            setData(data);
            break;
        }
      }
    }
  };

  return (
    <Box>
      <Form formFields={formFields} initialData={data} onChange={changeHandler} submitButton={false} />
    </Box>
  );
};

export default GroupField;
