import { useContext, useEffect, useRef, useState } from "react";
import Typography from '@mui/material/Typography';
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../../store/auth-contex";

const ModalContent = ({ apiPath = null, handleDeleteModalData }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const productAttributes = useRef();

  const [dialogData, setDialogData] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [checked, setChecked] = useState(false);
  const [checkedMainCheckbox, setCheckedMainCheckbox] = useState(true);

  const handleChange = (event) => {
    setChecked(event.target.checked);
    handleDeleteModalData({
      delete_product_attributes: event.target.checked
    });
  }

  useEffect(() => {
    const handleData = async () => {
      setIsLoading(true);
      api.get(apiPath)
        .then((response) => {
          setDialogData(response?.payload);
          setIsLoading(false);
        })
        .catch((error) => {
          console.warn(error);
          setIsLoading(false);
        });
    };
    handleData();
  }, []);

  return (

    <>
      {isLoading ? (
        <CircularProgress size="2rem" />
      ) : (
        <>
          <span style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="string">
              {dialogData.main_line}
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={checkedMainCheckbox} disabled />}
              label={dialogData.main_checkbox}
            />
          </span>
          {dialogData.product_attributes !== false && (
            <span style={{ display: "flex", flexDirection: "column", marginTop: "2rem" }}>
              <Typography variant="string">
                {dialogData.product_attributes_line}
              </Typography>
              <FormControlLabel
                control={<Checkbox checked={checked} onChange={handleChange} ref={productAttributes} />}
                label={dialogData.product_attributes_checkbox}
              />
            </span>
          )}

        </>
      )}
    </>
  );
};

export default ModalContent;