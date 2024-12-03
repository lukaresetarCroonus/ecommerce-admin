import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import CampaignList from "../CampaignList/CampaignList";
import CampaignTable from "../CampaignTable/CampaignTable";

const SelectionModal = ({
  openDialog,
  setOpenDialog,
  selectedValues,
  component,
  opt,
  options,
  setOptions,
  onChange,
  inputType,
  isLoadingOpt
}) => {


  const ComponentToRender = () => {
    switch (component) {
      case 'list':
        return (
          <CampaignList
            data={opt}
            selected={selectedValues}
            onChange={onChange}
            inputType={inputType}
          />
        );
      case 'table':
        return (
          <CampaignTable
            data={opt?.data}
            columns={opt?.format}
            options={options}
            setOptions={setOptions}
            selected={selectedValues}
            onChange={onChange}
            inputType={inputType}
            isLoadingOpt={isLoadingOpt}
          />
        );

      default:
        return null;
    }
  };

  return (
    <Dialog open={openDialog.show ?? false}>
      <DialogContent>
        {opt && ComponentToRender()}
      </DialogContent>

      <DialogActions>
        <Button
          variant="outlined"
          onClick={() => setOpenDialog({ ...openDialog, show: false })}
          data-test-id="btn-cancel"
        >
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default SelectionModal;
