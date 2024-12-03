import Typography from "@mui/material/Typography";
import { toast } from "react-toastify";
import { useContext, useEffect, useRef, useState } from "react";
import AuthContext from "../../../../../store/auth-contex";
import Box from "@mui/material/Box";
import Form from "../../../../../components/shared/Form/Form";
import formFieldsRowInfo from "../../forms/formFieldRowInfo.json"
import Slider from "../../../../../components/shared/Slider/Slider";


const Confrm = ({ onClickSubmitHandler = () => { }, infoRow, onClickUpdateData = () => { } }) => {

  const [isLoading, setIsLoading] = useState(false);
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const postInfo = {
    id: infoRow?.id,
    id_reclamations: infoRow?.id_reclamations,
    comment: null,
    status: null
  }

  const [data, setData] = useState(postInfo);

  const [getDataInfo, setGetDataInfo] = useState({});

  const submitHandlerValues = (data) => {
    setIsLoading(true);
    api.post(`/admin/reclamations-b2b/items-status`, data)
      .then((response) => {
        setIsLoading(false);
        setData(response?.payload);
        toast.success("Uspešno!");
        onClickSubmitHandler();
        onClickUpdateData();
      })
      .catch((error) => {
        setIsLoading(false);
        toast.warn("Greška");
      });
  }

  const getData = () => {
    api.get(`/admin/reclamations-b2b/items-status/${infoRow?.id}`)
      .then((response) => {
        setGetDataInfo(response?.payload)
      })
      .catch((error) => toast.warn("Greška"));
  }

  useEffect(() => {
    getData();
  }, [])


  return (
    <Box sx={{ width: "100%" }}>
      <Typography variant="h5" sx={{ marginBottom: "1rem" }}>
        Potvrda
      </Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2, auto)", gap: "1rem", marginBottom: "1rem" }}>
        <Typography variant="body1">
          <span style={{ fontWeight: "bold" }}>Račun:</span> {getDataInfo?.order_slug ?? "/"}
        </Typography>
        <Typography variant="body1">
          <span style={{ fontWeight: "bold" }}>Šifra proizvoda:</span> {getDataInfo?.product_sku ?? "/"}
        </Typography>
        <Typography variant="body1">
          <span style={{ fontWeight: "bold" }}>Naziv proizvoda:</span> {getDataInfo?.product_name ?? "/"}
        </Typography>
        <Typography variant="body1">
          <span style={{ fontWeight: "bold" }}>Prijavljeno:</span> {getDataInfo?.order_date ?? "/"}
        </Typography>
      </Box>
      <Slider
        dataFromServer={getDataInfo.file}
      />
      <Form onSubmit={submitHandlerValues} formFields={formFieldsRowInfo} initialData={data} isLoading={isLoading} />

    </Box >
  )
}

export default Confrm