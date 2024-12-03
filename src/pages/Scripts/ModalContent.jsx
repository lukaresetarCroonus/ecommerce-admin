import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";

import { InputCheckbox } from "../../components/shared/Form/FormInputs/FormInputs";
import Buttons from "../../components/shared/Form/Buttons/Buttons";
import Button from "../../components/shared/Button/Button";

import Typography from '@mui/material/Typography';
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import AuthContext from "../../store/auth-contex";


const ModalContent = ({ data, rowData, labelModalContent }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [dataModalContent, setDataModalContent] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChecked, setIsChecked] = useState([]);

  const apiPathSave = `admin/scripts/execute`;

  const handleSubmit = () => {
    setIsLoading(true);

    api.post(`${apiPathSave}`, { id_admin_scripts: rowData.id, log_process: true, admin_scripts_command_slugs: isChecked })
      .then((response) => {
        toast.success(`Uspešno`);
        setIsLoading(false);
        setIsChecked(isChecked);
      })
      .catch((error) => {
        console.warn(error);
        toast.warning("Greška");
        setIsLoading(false);
      });
  };

  /*The handleCheckboxChange function is triggered when the onChange event is fired on the checkbox element.
  As a parameter, the function receives an event object (event).
  Using destructuring assignment, the name and checked properties are extracted from the event.target object. The name property represents a unique identifier for the checkbox, and the checked property indicates whether the checkbox is checked or not.
  The function checks if the checkbox is checked (checked === true).
  If the checkbox is checked, the function calls setIsChecked with a callback that spreads the previous isChecked array using the spread operator ([...prevChecked]) and adds the new name to the end of the array. This updates the isChecked state by adding the identifier of the newly checked checkbox.
  If the checkbox is unchecked, the function calls setIsChecked with a callback that filters out the unchecked name from the previous isChecked array. This updates the isChecked state by removing the identifier of the unchecked checkbox from the array.
  Updating the state triggers a re-render, and the user interface reflects the changes in the checked state of the checkboxes.*/
  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setIsChecked((prevChecked) => [...prevChecked, name]);
    } else {
      setIsChecked((prevChecked) => prevChecked.filter((item) => item !== name));
    }
  };

  useEffect(() => {
    setDataModalContent(data);
  }, [data]);

  return (
    <Box sx={{ padding: "2rem" }}>
      {isLoading ? (
        <Box sx={{ width: "100%", display: "flex", justifyContent: "center" }}>
          <CircularProgress size="2rem" sx={{ marginTop: "50vh" }} />
        </Box>
      ) : (
        <>
          <Typography variant="h5" sx={{ marginBottom: "0.8rem" }}>Skripte</Typography>
          {Array.isArray(dataModalContent) &&
            dataModalContent.map((item) => {
              const isCheckedItem = isChecked.includes(item.slug);
              return (<InputCheckbox onChange={handleCheckboxChange} key={item.name} name={item.slug} label={item.name} styleCheckbox={{ padding: "0 0.563rem 0 0.563rem" }} value={isCheckedItem} />);
            })}
          <Buttons>
            <Button onClick={handleSubmit} type="submit" label={labelModalContent ?? "Izvrši"} variant="contained" disabled={isLoading} />
          </Buttons>
        </>
      )}
    </Box>
  );
};

export default ModalContent;