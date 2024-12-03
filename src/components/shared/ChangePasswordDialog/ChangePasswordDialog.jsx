import { useContext, useState } from "react";
import { toast } from "react-toastify";

import Form from "../Form/Form";
import styles from "./ChangePassword.module.scss";
import formFields from "./changePasswordForm.json";
import ListPageModalWrapper from "../Modal/ListPageModalWrapper";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import AuthContext from "../../../store/auth-contex";


const ChangePasswordDialog = ({ openDialog, setOpenDialog, apiUrl }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const init = {
    password: "",
    repeat_password: "",
    sent_mail: 0,
  };

  const [formData, setFormData] = useState(init);

  const changeHandler = (data) => {
    setFormData(data);
  };

  const submitHandler = (data) => {
    if (!(formData.repeat_password !== "" && formData.repeat_password !== formData.password)) {

      api.post(apiUrl, { id: openDialog.userId, ...data })
        .then((response) => {

          toast.success("Uspešno!");
          setOpenDialog({ show: false });
        })
        .catch((error) => {
            toast.warning(error.response.data.message ?? error?.response?.data?.payload?.message ?? "Greška");
        });
    } else {
      toast.warn("Lozinke se ne poklapaju!");
    }
  };



  return (
    <ListPageModalWrapper anchor="right" open={openDialog.show ?? false} onClose={() => setOpenDialog({ ...openDialog, show: false })} onCloseButtonClick={() => setOpenDialog({ ...openDialog, show: false })} styleBox={{ display: "flex", justifyContent: "center", flexDirection: "column", height: "inherit" }} >
      <Box sx={{ padding: "2rem" }}>
        <Typography variant="h6" mb={2}>
          Promena lozinke
        </Typography>
        {formData.repeat_password !== "" && formData.repeat_password !== formData.password && (
          <Typography variant="body2" className={styles.error}>
            Lozinke se ne poklapaju
          </Typography>
        )}
        <Form formFields={formFields} initialData={formData} onSubmit={submitHandler} onChange={changeHandler} />
      </Box>

    </ListPageModalWrapper>
  );
};

export default ChangePasswordDialog;
