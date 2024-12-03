import { useContext, useState } from "react";

import Delete from "@mui/icons-material/Delete";
import Box from "@mui/system/Box";
import Icon from "@mui/material/Icon";
import Button from "@mui/material/Button";

import CreateForm from "../../../../components/shared/Form/CreateForm";
import DeleteDialog from "../../../../components/shared/Dialogs/DeleteDialog";
import { toast } from "react-toastify";
import fields from "./SetterFields.json";
import { isEmpty } from "lodash";
import { saveFormField } from "../../services";
import AuthContext from "../../../../store/auth-contex";

import styles from "./SetFormFields.module.scss";

const SetFormField = ({ data, index, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fieldData, setFieldData] = useState(data);
  const [inputsError, setInputsError] = useState({});

  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    show: false,
    id: null,
    mutate: null,
  });
  const { user } = useContext(AuthContext);

  const formItemChangeHandler = ({ target }, type) => {
    if (type) {
      setFieldData({ ...fieldData, [target.name]: target.checked });
    } else {
      if (target.name === "admin_form_id") {
        setFieldData({ ...fieldData, [target.name]: Number(target.value) });
      }
      setFieldData({ ...fieldData, [target.name]: target.value });
    }
  };

  const deleteHandler = () => {
    onDelete(index, fieldData.id);
    setOpenDeleteDialog({ show: false, id: null, mutate: 1 });
  };

  const onClickDelete = () => {
    setOpenDeleteDialog({ show: true, id: null, mutate: null });
  };

  const onSubmit = () => {
    const errors = {};
    Object.keys(fieldData).forEach((prop_name) => {
      if (typeof fieldData[prop_name] === "boolean") {
        fieldData[prop_name] = fieldData[prop_name] ? 1 : 0;
      }
      if (isEmpty(fieldData[prop_name])) {
        if (prop_name === "field_name") {
          errors[prop_name] = {
            content: "Polje je obavezno, molim vas unesite vrednost.",
          };
        }
      }
    });
    isEmpty(errors) ? saveData() : setInputsError(errors);
  };

  const saveData = async () => {
    try {
      let response = await saveFormField(user.access_token, fieldData);
      toast.success("Uspešno sačuvano!");
    } catch (error) {
      console.warn(error);
      toast.warning("Greška!");
    }
  };

  const handleCancel = () => {
    setOpenDeleteDialog({ show: false, id: null });
  };

  return (
    <div>
      <div className={styles.formFieldHeader}>
        <div
          className={styles.lessMoreContent}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {fieldData.field_name}
          {isOpen ? <Icon sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }}>expand_less</Icon> : <Icon sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }}>expand_more</Icon>}
        </div>
        <Delete className={styles.iconDelete} onClick={onClickDelete} />
      </div>
      {isOpen && (
        <Box component="form" autoComplete="off">
          {fields &&
            fields
              .filter(({ in_details }) => in_details)
              .map((item, index) => {
                return (
                  <CreateForm
                    data-test-id="admin-form"
                    onChangeHandler={formItemChangeHandler}
                    item={item}
                    key={index}
                    error={inputsError[item.prop_name]}
                    value={
                      Array.isArray(item) && data
                        ? fieldData[item.prop_name]
                        : fieldData[item.prop_name]
                    }
                  />
                );
              })}
          <Button onClick={onSubmit}>Sačuvaj</Button>
        </Box>
      )}

      <DeleteDialog
        title="Brisanje"
        description="Da li ste sigurni da želite da obrišete?"
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleConfirm={deleteHandler}
        handleCancel={handleCancel}
      />
    </div>
  );
};

export default SetFormField;
