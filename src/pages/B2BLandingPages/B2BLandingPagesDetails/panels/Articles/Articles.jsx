import React, { useEffect, useState, useRef, useContext } from "react";

import Group from "./Group/Group";
import MainGroup from "./Group/MainGroup";
import ProductGroup from "./Group/ProductGroup";
import CustomerGroup from "./Group/CustomerGroup"
import Row from "./Row/Row";
import ProductRow from "./Row/ProductRow"
import CustomerRow from "./Row/CustomerRow"
import { v4 } from "uuid";
import DeleteDialog from "../../../../../components/shared/Dialogs/DeleteDialog";

import init_group_file from "./Group/GroupFile/init_group_file.json";
import product_group_file from "./Group/GroupFile/product_group_file.json";
import customer_group_file from "./Group/GroupFile/customer_group_file.json";

import init_row_file from "./Row/RowFile/init_row_file.json";
import product_row_file from "./Row/RowFile/product_row_file.json";
import customer_row_file from "./Row/RowFile/customer_row_file.json";

import Buttons from "../../../../../components/shared/Form/Buttons/Buttons";
import Button from "../../../../../components/shared/Button/Button";
import { toast } from "react-toastify";
import { cloneDeep } from "lodash";
import AuthContext from "../../../../../store/auth-contex";

const Articles = ({ pageId }) => {
  const elementRef = useRef('');
  const [data, setData] = useState([]);
  const [openDeleteDialog, setOpenDeleteDialog] = useState({ show: false });
  const [removeComponentId, setRemoveComponentId] = useState(null);

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const apiPath = 'admin/landing-pages-b2b/conditions';

  // The handleData function uses the API to retrieve data about campaign conditions.
  async function handleData() {
    await api
      .get(`${apiPath}/${pageId}`)
      .then((response) => {
        setContentData(response?.payload);
      })
      .catch((error) => console.warn(error));
  }

  // UseEffect calls the handleData function to retrieve the data on the initial render.
  useEffect(() => {
    handleData();
  }, []);

  // The setContentData function sets the data state to the campaign condition data, using the cloneDeep function for deep cloning objects.
  const setContentData = (data = []) => {
    // If there is no data, it should take the default value
    if (!data.length) {
      data = [{ ...cloneDeep(init_group_file), id: v4() }];
    }
    setData(data);
  };

  /*The function renderContent takes in an array of objects called param_data. It maps through this array and creates a JSX component for each object based on its type and type_component properties.
  If the object's type property is 'group', the function creates a rules array and sets it to an empty array if the object's rules property is null or undefined. Otherwise, it sets rules to the result of calling the renderContent function recursively on the rules property of the current object.
  The function uses a switch statement to determine which type of Group component to render based on the value of the current object's type_component property. The default option is used if type_component is not recognized.
  If the object's type property is 'row', the function uses a similar switch statement to determine which type of Row component to render.
  If the object's type property is not recognized, the function logs a message to the console and returns null.
  The function returns an array of JSX components created in the mapping process.*/
  const renderContent = (param_data) => {
    return (
      <>
        {param_data.map((t_row) => {
          if (t_row?.type) {
            if (t_row.type === 'group') {
              let rules = [];
              if (t_row.rules.length) {
                rules = renderContent(t_row.rules);
              }

              switch (t_row?.type_component) {
                case 'main':
                  return (
                    <MainGroup
                      key={t_row.id}
                      id={t_row.id}
                      data={t_row}
                      rules={rules}
                      handleAddComponent={handleAddComponent}
                      handleRemoveComponent={handleRemoveComponent}
                    />
                  );
                case 'product':
                  return (
                    <ProductGroup
                      key={t_row.id}
                      id={t_row.id}
                      data={t_row}
                      rules={rules}
                      handleAddComponent={handleAddComponent}
                      handleRemoveComponent={handleRemoveComponent}
                    />
                  );
                case 'customer':
                  return (
                    <CustomerGroup
                      key={t_row.id}
                      id={t_row.id}
                      data={t_row}
                      rules={rules}
                      handleAddComponent={handleAddComponent}
                      handleRemoveComponent={handleRemoveComponent}
                    />
                  );
                case 'default':
                default:
                  return (
                    <Group
                      key={t_row.id}
                      id={t_row.id}
                      data={t_row}
                      rules={rules}
                      handleAddComponent={handleAddComponent}
                      handleRemoveComponent={handleRemoveComponent}
                    />
                  );
              }
            } else if (t_row.type === 'row') {
              switch (t_row?.type_component) {
                case 'product':
                  return (
                    <ProductRow
                      key={t_row.id}
                      id={t_row.id}
                      data={t_row}
                      handleRemoveComponent={handleRemoveComponent}
                    />
                  );
                  break;
                case 'customer':
                  return (
                    <CustomerRow
                      key={t_row.id}
                      id={t_row.id}
                      data={t_row}
                      handleRemoveComponent={handleRemoveComponent}
                    />
                  );
                  break;
                case 'default':
                default:
                  return (
                    <Row
                      key={t_row.id}
                      id={t_row.id}
                      data={t_row}
                      handleRemoveComponent={handleRemoveComponent}
                    />
                  );
              }
            }
          } else {
            console.log('Not defined type for component.');
            return null;
          }
        })}
      </>
    );
  };

  /* The onSubmit function is triggered when the user clicks the save button. 
   It uses the api object to send a POST request to a specific endpoint with the data about the campaign's conditions as the request body. 
   If the request is successful, a success message is displayed using the toast function. If an error occurs, a warning message is displayed using toast and the error is logged to the console using console.warn.*/
  function onSubmit() {
    if (!checkIfAllSelected({ rules: data })) {
      toast.warn('Molimo Vas da selektujete sva input polja pre čuvanja podataka.');
      return;
    }
    api
      .post(apiPath, { id_landing_page: pageId, conditions: { ...data } })
      .then((response) => {
        toast.success('Uspešno!');
      })
      .catch((error) => {
          error.response.data.message ?? error?.response?.data?.payload?.message ?? "Greška"
        console.warn(error);
      });
  }

  /*The handleAddComponent function is used to add a new component (either a group or a row) to the list of campaign conditions.
  It takes two parameters: parentId which is the ID of the parent component to which the new component should be added, and componentType which specifies whether the new component should be a group or a row.
  The function calls the addComponent function to modify the data state by adding the new component to the appropriate parent. 
  The modified data state is then passed to the setContentData function to update the component state.*/
  function handleAddComponent(parentId, componentType, componentTypeComponent) {
    let temp = addComponent(data, parentId, componentType, componentTypeComponent);
    setContentData(temp);
  }

  /*The checkIfAllSelected function checks whether all input fields are selected for a given parent object. 
  It loops through the rules array of the parent object and checks if the current rule is of type "row". 
  If so, it retrieves the last valueField in the fields array and checks whether it is not selected or has an empty array as its selected value.
  If either of these conditions is met, the function returns false to indicate that not all input fields are selected.
  If the current rule is of type "group", it calls the checkIfAllSelected function recursively with the current rule as its argument. 
  If all input fields are selected, the function returns true.*/
  const checkIfAllSelected = (parent) => {

    for (const rule of parent.rules) {
      if (rule.type === "row") {
        let valueField = rule.fields[rule.fields.length - 1];
        if (valueField.selected === null || Array.isArray(valueField.selected) && valueField.selected.length === 0) {
          return false;
        }
      } else if (rule.type === "group") {
        if (!checkIfAllSelected(rule))
          return false;
      }
    }
    return true;
  }

  /*The addComponent function is used to add a new component (either a group or a row) to the list of components.
  It takes in the current data, the parentId of the parent component, and the componentType of the new component to be added.
  If not all input fields are selected (checked using the checkIfAllSelected function), a warning message is displayed using the toast function and the current data is returned. 
  If all input fields are selected, the function loops through the data array and checks if the id of the current component matches the parentId. 
  If it does, the function adds a new group or row component to the rules array of the current component, depending on the componentType argument. 
  If the current component has child components, the function is called recursively on the child components. 
  The updated data array is returned.*/
  const addComponent = (param_data, parentId, componentType, componentTypeComponent) => {
    if (!checkIfAllSelected(param_data[0])) {
      toast.warn('Selektujte sva input polja!');
      return param_data;
    }
    return param_data.map((t_row) => {
      if (t_row.id === parentId) {
        if (componentType === 'group') {
          let group_file = [];
          switch (componentTypeComponent) {
            case "product":
              group_file = product_group_file;
              break;
            case "customer":
              group_file = customer_group_file;
              break;
            default:
              group_file = init_group_file;
              break;
          }

          const newRules = [{ ...cloneDeep(group_file), id: v4() }];
          return { ...t_row, rules: [...t_row.rules, ...newRules] };
        } else if (componentType === 'row') {
          let row_file = [];
          switch (componentTypeComponent) {
            case "product":
              row_file = product_row_file;
              break;
            case "customer":
              row_file = customer_row_file;
              break;
            default:
              row_file = init_row_file;
              break;
          }

          const newRules = [{ ...cloneDeep(row_file), id: v4() }];
          return { ...t_row, rules: [...t_row.rules, ...newRules] };
        }
      } else if (t_row.rules?.length > 0) {
        return {
          ...t_row,
          rules: addComponent(t_row.rules, parentId, componentType, componentTypeComponent),
        };
      }

      return t_row;
    });
  };

  /*The handleRemoveComponentCancel function is used to cancel the deletion of a component. 
  It sets the openDeleteDialog and removeComponentId state variables to false and null, respectively.*/
  const handleRemoveComponentCancel = () => {
    setOpenDeleteDialog({ show: false });
    setRemoveComponentId(null);
  };

  const handleRemoveComponent = (id, componentType) => {
    if (id) {
      setOpenDeleteDialog({ show: true });
      setRemoveComponentId(id);
    } else {
      setRemoveComponentId(null);
    }
  };

  /*handleRemoveComponentConfirm function is called when the user confirms the removal of a component. 
  It calls removeComponent function to remove the component with the given ID from the data array and then sets the new data using setContentData function. 
  It also resets the removeComponentId and openDeleteDialog states to their initial values.*/
  const handleRemoveComponentConfirm = () => {
    let temp = removeComponent(data, removeComponentId);
    setContentData(temp);
    // Reset dialog and remove id
    setRemoveComponentId(null);
    setOpenDeleteDialog({ show: false });
  };


  /*removeComponent function recursively searches through the param_data array and its sub-arrays (in case of nested components) to find the component with the given ID and removes it from the array by returning false. 
  If the component is not found, the function returns true to keep the item in the array. 
  If the component is a group, the function calls itself on the rules array to remove any nested components.*/
  const removeComponent = (param_data, id) => {
    return param_data.filter((t_row) => {
      if (t_row.id === id) {
        // Return false to remove the item from the array
        return false;
      } else if (t_row.rules?.length > 0) {
        // Recursively call removeComponent on the "rules" array
        t_row.rules = removeComponent(t_row.rules, id);
        // Return true to keep the item in the array (since we modified it)
        return true;
      }

      // Return true to keep the item in the array
      return true;
    });
  };

  return (
    <>
      <div
        ref={elementRef}
        className="campaignConditionsBox"
        id="campaignConditionsBox"
      >
        {renderContent(data)}
      </div>
      <Buttons>
        <Button label="Sačuvaj" variant="contained" onClick={onSubmit} />
      </Buttons>

      <DeleteDialog
        title=""
        handleCancel={handleRemoveComponentCancel}
        handleConfirm={handleRemoveComponentConfirm}
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        nameOfButton="Obriši"
        deafultDeleteIcon={false}
      />
    </>
  );
};

export default Articles;
