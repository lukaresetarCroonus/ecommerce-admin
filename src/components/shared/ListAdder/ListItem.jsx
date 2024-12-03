import { useState, useEffect } from "react";

import DeleteDialog from "../Dialogs/DeleteDialog";
import Form from "../Form/Form";
import Button from "../Button/Button";
import IconButton from "@mui/material/IconButton";

import styles from "./SetFormFields.module.scss";
import Icon from "@mui/material/Icon";
import { Box } from "@mui/material";

const ListItem = ({ data, index, onDelete = () => { }, saveData = () => { }, formFields, actions = {}, onChange = () => null, validateData }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [fieldData, setFieldData] = useState(data);
  const [fields, setFields] = useState(formFields);
  const [buttons, setButtons] = useState({});

  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    show: false,
    id: null,
    mutate: null,
  });

  const deleteHandler = () => {
    onDelete(index, fieldData.id);
    setOpenDeleteDialog({ show: false, id: null, mutate: 1 });
  };

  const onClickDelete = () => {
    setOpenDeleteDialog({ show: true, id: null, mutate: null });
  };

  const onSubmit = (data) => {
    saveData(data, index);
  };

  const handleCancel = () => {
    setOpenDeleteDialog({ show: false, id: null });
  };

  useEffect(() => {
    setFieldData(data);
  }, [data]);

  useEffect(() => {
    fields
      .filter(({ in_details }) => in_details)
      .map((item, index) => {
        if (actions.type === "any") {
          let anyButtons = {};
          actions.buttons.map((item) => {
            anyButtons = { ...anyButtons, [item.id]: item };
          });
          setButtons({ ...buttons, ...anyButtons });
        }

        if (actions[item.prop_name]) {
          let name = item.prop_name;
          let t_val = actions[item.prop_name].value;
          let button_add = false;
          if (t_val) {
            switch (typeof t_val) {
              case "array":
              case "object":
                t_val.map((t_v) => {
                  if (t_v == data[item.prop_name]) {
                    button_add = true;
                  }
                });
                break;
              default:
                if (t_val === data[item.prop_name]) {
                  button_add = true;
                }
                break;
            }
          }

          if (button_add) {
            let button = actions[item.prop_name].button;
            setButtons({ ...buttons, [name]: button });
          } else {
            setButtons((buttons) => {
              delete buttons[name];
              return buttons;
            });
          }
        }

        // This is the old way of writing code, not good for transparency, needs more functionality
        /* if (actions[item.prop_name] && actions[item.prop_name].value === data[item.prop_name]) {
            let name = item.prop_name;
            let button = actions[item.prop_name].button;
            setButtons({ ...buttons, [name]: button });
        } else if (actions[item.prop_name] && actions[item.prop_name].value !== data[item.prop_name]) {
            let name = item.prop_name;
            setButtons((buttons) => {
                delete buttons[name];
                return buttons;
            });
        } */
      });
  }, [data]);
  return (
    <div>
      <div className={styles.formFieldHeader}>
        <div
          className={styles.lessMoreContent}
          onClick={() => {
            setIsOpen(!isOpen);
          }}
        >
          {fieldData.field_display_title ?? fieldData.name ?? fieldData.field_name ?? fieldData.title ?? fieldData.slug ?? fieldData.id ?? "Novo"}
          {isOpen ? <Icon sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }}>expand_less</Icon> : <Icon sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }}>expand_more</Icon>}
        </div>
        {!fieldData.system_required &&
          <IconButton
            sx={{
              padding: "0",
              "&:hover": {
                backgroundColor: "none",
              }
            }}
            onClick={onClickDelete}>
            <Icon>delete</Icon>
          </IconButton>}
      </div>
      {isOpen && (
        <>
          <Form formFields={formFields} initialData={fieldData} onSubmit={onSubmit} cancelButton={false} onChange={onChange} validateData={validateData} />
          <div className={styles.actionButtons}>
            {Object.values(buttons).map((button) => {
              return (
                <Button
                  key={button.id}
                  onClick={() => {
                    button.action(fieldData.id);
                  }}
                  icon={button.icon}
                  label={button.text}
                />
              );
            })}
          </div>
        </>
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

export default ListItem;
