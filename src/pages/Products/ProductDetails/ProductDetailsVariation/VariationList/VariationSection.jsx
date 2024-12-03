import { useState, useEffect, useContext } from "react";

import Icon from "@mui/material/Icon";
import Box from "@mui/system/Box";

import Form from "../../../../../components/shared/Form/Form";
import List from "../../../../../components/shared/ListAdder/List";
import { toast } from "react-toastify";

import styles from "./VariationList.module.scss";
import AuthContext from "../../../../../store/auth-contex";

const VariationSection = ({
  title = "",
  type = "form",
  formFields = [],
  getUrl = "",
  postUrl = "",
  listUrl = "",
  deleteUrl = "",
  init = {},
  productParentId,
  productId,
  validateData = (data) => data,
  children,
}) => {
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [open, setOpen] = useState(false);
  const [data, setData] = useState([]);


  const listData = () => {
    api.list(listUrl)
      .then((response) => {
        setData(response?.payload?.items);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const getData = () => {
    api.get(getUrl)
      .then((response) => {
        setData(response?.payload);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    if (open) {
      if (getUrl !== "") {
        getData();
      } else if (listUrl !== "") {
        listData();
      }
    }
  }, [open]);

  const onSubmit = (data) => {
    const req = {
      id_product_parent: productParentId,
      id_product: productId,
      ...init,
      ...data,
    };
    if (postUrl !== "") {
      api.post(postUrl, req)
        .then((response) => {
          toast.success("Uspešno");
          if (getUrl !== "") {
            getData();
          } else if (listUrl !== "") {
            listData();
          }
        })
        .catch((error) => {
          console.warn(error);
          toast.warn("Greška");
        });
    }
  };

  const onDelete = (token, id) => {
    if (deleteUrl !== "") {
      api.delete(`${deleteUrl}/${id}`)
        .then((response) => {
          toast.success("Uspešno");
          if (getUrl !== "") {
            getData();
          } else if (listUrl !== "") {
            listData();
          }
        })
        .catch((error) => {
          console.warn(error);
        });
    }
  };

  const getDisplayed = () => {
    switch (type) {
      case "list":
        return <List formFields={formFields} listFields={data} init={init} onDelete={onDelete} onSave={onSubmit} validateData={validateData} />;
      case "children":
        return children;
      case "form":
      default:
        return <Form formFields={formFields} initialData={data} onSubmit={onSubmit} />;
    }
  };

  return (
    <Box>
      <Box className={styles.variationSectionTitle} onClick={() => setOpen(!open)}>
        {title}
        {open ? <Icon sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }}>expand_less</Icon> : <Icon sx={{ color: "rgba(0, 0, 0, 0.54)", fontSize: "1.3rem" }}>expand_more</Icon>}
      </Box>
      {open && <Box className={styles.variationSectionBody}>{getDisplayed()}</Box>}
    </Box>
  );
};

export default VariationSection;
