import { useState, useEffect, useContext } from "react";
import Box from "@mui/material/Box"
import Typography from '@mui/material/Typography';
import { InputSelect } from "../../../../../components/shared/Form/FormInputs/FormInputs";
import Button from "../../../../../components/shared/Button/Button";
import Buttons from "../../../../../components/shared/Form/Buttons/Buttons";
import AuthContext from "../../../../../store/auth-contex";


const ListItem = ({ productId, apiPath }) => {

  const [fields, setFields] = useState([]);
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const setListHandler = async () => {
    api.get(`${apiPath}/product/sets/${productId}`)
      .then((response) => {
        setFields(response?.payload);
      })
      .catch((error) => {
        console.warn(error);
      });
  };

  useEffect(() => {
    setListHandler();
  }, []);

  return (
    <>
      {
        fields.map((field) => {
          return (
            <Box key={field.id}>
              <Typography variant="subtitle1">
                {field.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <Typography variant="subtitle1">Naziv atributa</Typography>
                <InputSelect label={""} />
              </Box>
            </Box>
          )
        })
      }
      <Buttons>
        <Button label={"Sačuvaj"} variant={"contained"} />
      </Buttons>
    </>
  )
}

export default ListItem