
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import CloseIcon from "@mui/icons-material/Close";
import IconButton from "@mui/material/IconButton";

/**
 *
 * @param {string} title The title for the dialog.
 * @param {'lg'| 'md'| 'sm'| 'xl'| 'xs'| false} maxWidth Determine the max-width of the dialog. The dialog width grows with the size of the screen.
 * @param {boolean} dividers Display the top and bottom dividers.
 * @param {string} content Dialog main content.
 * @param {string} modalFooterButton Dialog footer content.
 */

const Modal = ({ open, closeModal, title, content, modalFooterButton, dividers = false, maxWidth }) => {

  return (
    <Dialog open={open} fullWidth={true} maxWidth={maxWidth}>

      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {title}
        <IconButton
          aria-label="close"
          onClick={closeModal}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers={dividers}>
        {content}
      </DialogContent>

      <DialogActions sx={{ padding: "1rem 1.5rem" }}>
        {modalFooterButton}
      </DialogActions>

    </Dialog>
  );
};

export default Modal;
