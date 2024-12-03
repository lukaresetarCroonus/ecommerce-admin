import { useContext, useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import Checkbox from "@mui/material/Checkbox";
import Select from "@mui/material/Select";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import CircularProgress from "@mui/material/CircularProgress";
import AuthContext from "../../store/auth-contex";

const ModalContent = ({ apiPath = null, handleDeleteModalData }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [dialogData, setDialogData] = useState({})
  const [isLoading, setIsLoading] = useState(false);
  const [checkedMainCheckbox, setCheckedMainCheckbox] = useState(true);
  const [selectedOptions, setSelectedOptions] = useState([]);

  // Popunjava niz odabranih opcija, ukoliko nema oldId dodaje u nize, ukoliko ima menja newId
  const AddSelected = (oldId, newId) => {
    let allSelected = selectedOptions;

    let find_items = allSelected.filter((item) => {
      return item?.old_id === oldId;
    });

    if(find_items.length) {
      allSelected.map((item) => {
        if(item.old_id === oldId) {
          item.new_id = newId;
        }
        return item;
      });
    } else {
      allSelected.push({
        old_id: oldId,
        new_id: newId
      });
    }

    return allSelected;
  };

  // Provera da li su vrednosti za sve prikazane elemente odabrana zeljena akcija
  const AllOptionListFill = (allSelected) => {
    let all_fill = true;
    dialogData?.category_children_list.map((list_item) => {
      let find_items = allSelected.filter((item) => {
        return item?.old_id === list_item?.old_id;
      });
      
      if(find_items.length === 0) {
        all_fill = false;
      }
    });

    return all_fill;
  };

  const onSelectionChange = (select, input) => {    
    let oldId = input.props.oldId;
    let newId = input.props.value;

    let allSelected = AddSelected(oldId, newId);
    let allFill     = AllOptionListFill(allSelected);

    setSelectedOptions(allSelected);

    handleDeleteModalData({
      // Lista povezanih vrednosti
      connect: allSelected,
      // Mora biti sve povezano
      all_fill: allFill
    });
  };

  useEffect(() => {
    const handleData = async () => {
      setIsLoading(true);
      api.get(apiPath)
          .then((response) => {
              setDialogData(response?.payload);
              setIsLoading(false);

              // Ukoliko ima proizvoda u kategorijama za prebacivanje moraju sve kategorije da se povezu, ako nema kategorije moze da se brise
              if (response?.payload?.category_children) {
                  handleDeleteModalData({
                      // Lista povezanih vrednosti
                      connect: [],
                      // Mora biti sve povezano
                      all_fill: false,
                  });
              } else {
                  handleDeleteModalData({
                      // Lista povezanih vrednosti
                      connect: [],
                      // Mora biti sve povezano
                      all_fill: true,
                  });
              }
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
          <span key="dialogData_main_line" style={{ display: "flex", flexDirection: "column" }}>
            <Typography variant="string">
              {dialogData.main_line}
            </Typography>
            <FormControlLabel
              control={<Checkbox checked={checkedMainCheckbox} disabled />}
              label={dialogData.main_checkbox}
            />
          </span>
          {dialogData.category_children !== false && (
            <span key="dialogData_category_children" style={{ display: "flex", flexDirection: "column", marginTop: "2rem" }}>
              <Typography variant="string">
                {dialogData.category_children_line}
              </Typography>
              
              {dialogData?.category_children_list?.map( (item, index) => {
                  return (
                    <>
                      <Typography variant="string" sx={{marginTop: "1rem"}}>
                        {item?.line}
                      </Typography>
                      <Select
                        key={index + "_select"}
                        onChange={onSelectionChange}
                        sx={{
                          "& legend": { display: "none" },
                          "& fieldset": { top: 0 },
                          "& .MuiSelect-select": { padding: "0.7rem", fontSize: "0.875rem" },
                        }}
                        >
                        {(item?.options ?? []).map((option) => (
                            <MenuItem 
                              key={option.id} 
                              value={option?.id}
                              valuename={option?.name}
                              oldId={item?.old_id}
                              sx={{ fontSize: "0.875rem" }}
                              >
                                {option?.name}
                            </MenuItem>
                        ))}
                      </Select>
                    </>
                  )
              })}
            </span>
          )}
        </>
      )}
    </>
  );
};

export default ModalContent;