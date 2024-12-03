import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import ListPage from "../../../components/shared/ListPage/ListPage";

import tblFields from "./tblFields.json";

const HistoryModal = ({ openDialog, setOpenDialog, apiPath }) => {
  return (
    <Dialog fullScreen open={openDialog.show ?? false}>
      <DialogContent>
        <ListPage listPageId="HistoryModal" title="Istorijat promene statusa" apiUrl={apiPath} showNewButton={false} columnFields={tblFields} />
      </DialogContent>

      <DialogActions>
        <Button variant="outlined" onClick={() => setOpenDialog({ ...openDialog, show: false })} data-test-id="btn-cancel">
          Zatvori
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default HistoryModal;
