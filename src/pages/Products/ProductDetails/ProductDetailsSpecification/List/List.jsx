import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box";
import Button from "../../../../../components/shared/Button/Button";
import ModalForm from "../../../../../components/shared/Modal/ModalForm";
import SearchableListForm from "../../../../../components/shared/Form/SearchableListForm/SearchableListForm";
import ListItem from "./ListItem";
import AuthContext from "../../../../../store/auth-contex";

const List = ({ productId, apiPath }) => {
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [openModal, setOpenModal] = useState({ show: false, id: null });
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    api.get(`${apiPath}/${productId}`)
      .then((response) => {
        setListData(response?.payload);
      })
      .catch((error) => console.warn(error));
  }, [])

  const handleSubmit = (data) => {
    console.log("List submit", data);
    // setOpenModal({ show: false, id: null });
  }

  return (
    <>
      <Button label={"Odaberi specifikaciju"} variant={"contained"} onClick={() => { setOpenModal({ show: true, id: productId }) }} />
      <ListItem productId={productId} apiPath={apiPath} />
      <ModalForm
        anchor="right"
        openModal={openModal}
        setOpenModal={setOpenModal}
        submitButton={false}
        children={
          <Box sx={{ padding: "1rem 2rem" }}>
            <SearchableListForm available={listData?.available} selected={listData?.selected} onSubmit={handleSubmit} isLoading={isLoading} />
          </Box>
        }
      />
    </>
  )
}

export default List