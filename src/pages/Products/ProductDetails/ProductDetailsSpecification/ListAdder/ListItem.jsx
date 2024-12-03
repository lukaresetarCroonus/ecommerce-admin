import { useState, useEffect, useContext, useCallback, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import Box from "@mui/system/Box";
import Icon from "@mui/material/Icon";

import DeleteDialog from "../../../../../components/shared/Dialogs/DeleteDialog";
import GroupField from "./GroupField";
import IconList from "../../../../../helpers/icons";;

import styles from "./SetFormFields.module.scss";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import AuthContext from "../../../../../store/auth-contex";

const ListItem = ({ index, onDelete = () => { }, title = "", selectedSet = undefined, productId, apiPath, set, group, onChange }) => {
  const [loaded, setLoaded] = useState(false);

  //delected set
  const [selected, setSetlected] = useState(selectedSet);

  const [showEmptyMessage, setShowEmptyMessage] = useState(false);
  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [openDeleteDialog, setOpenDeleteDialog] = useState({
    show: false,
    id: null,
    mutate: null,
  });

  const formItemChangeHandler = ({ target }, type) => {
    setSetlected(target.value);
  };

  const deleteHandler = () => {
    onDelete(index, selectedSet);
    setOpenDeleteDialog({ show: false, id: null, mutate: 1 });
  };

  const onClickDelete = () => {
    setOpenDeleteDialog({ show: true, id: null, mutate: null });
  };

  const handleCancel = () => {
    setOpenDeleteDialog({ show: false, id: null });
  };

  useEffect(() => {
    setLoaded(true);
  }, []);


  const changeHandler = useCallback((data, attributes, attributeValues, field_change_id) => {
    onChange(data, attributes, attributeValues, field_change_id);
  }, [onChange]);

  return (
    <>
      <Box>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            {title}
          </Typography>
          <Tooltip title={'Obrišite specifikaciju'} placement="top" arrow>
            <Icon onClick={onClickDelete} className={styles.deleteButton}>
              {IconList.delete}
            </Icon>
          </Tooltip>
        </Box>
      </Box>
      <Box sx={{ margin: "0 0 2rem 2rem" }} key={group.id}>
        <GroupField
          name={group.name}
          groupId={group.id}
          slug={group.slug}
          setId={set?.id}
          slugSet={set?.slug}
          nameSet={set?.name}
          productId={productId}
          onChange={changeHandler}
          apiPath={apiPath}
        />
      </Box>
      <DeleteDialog
        title="Brisanje"
        description="Da li ste sigurni da želite da obrišete?"
        openDeleteDialog={openDeleteDialog}
        setOpenDeleteDialog={setOpenDeleteDialog}
        handleConfirm={deleteHandler}
        handleCancel={handleCancel}
      />
    </>
  );
};

export default ListItem;
