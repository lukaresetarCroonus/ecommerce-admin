import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Icon from "@mui/material/Icon";

/**
 * Ask for confirmation when deleting a record.
 *
 * @param {{show: bool, i: int, mutate: *}} openDeleteDialog Additional details for the dialog..
 * @param {string} title The title for the dialog, or null for the default title.
 * @param {string} description The description to show to the user, or null for the default message.
 * @param {function} handleConfirm Callback that will handle confirmation.
 * @param {function} setOpenDeleteDialog Call to change the state of the dialog in the parent.
 * @param {string} nameOfButton If we don`t pass a prop, it uses default value (obriši).
 * @param deafultDeleteIcon The deafultDeleteIcon prop in the DeleteModal component is a boolean flag that determines whether the default delete icon should be displayed on the "obriši" (delete) button.
 * @param sx The sx prop in the DeleteModal component is used to apply custom styling to the Button component that represents the "obriši" (delete) button in the DialogActions section.
 * @param children The children prop in the DeleteModal component allows you to pass arbitrary content or components as children to the DeleteModal component.
 *
 *
 * @return {JSX.Element}
 * @constructor
 */
const DeleteModal = ({
    openDeleteDialog,
    selectedRowData,
    title,
    description,
    handleConfirm,
    setOpenDeleteDialog,
    nameOfButton,
    deafultDeleteIcon = true,
    sx = {},
    children,
    nameOfButtonCancel,
    disabledButton,
    styleButtonCancel,
    handleCancelToken = false,
    handleCancel,
}) => {
    // The childrenData function checks if the children prop is defined. If it is, it assumes that the parent component has passed a function as the children prop and calls that function with the selectedRowData as an argument. This allows the parent component to render custom content or components inside the DialogContentText component.
    const childrenData = () => {
        switch (true) {
            // If the children prop is not defined, the function checks if the openDeleteDialog.children prop is defined. This allows the parent component to directly pass content or components to the openDeleteDialog prop, which will be rendered inside the DialogContentText component.
            case children !== undefined:
                return children(selectedRowData);
            case openDeleteDialog?.children !== undefined:
                return openDeleteDialog.children;
            // If neither the children prop nor the openDeleteDialog.children prop is defined, a default message is rendered inside the DialogContentText component. The default message is "Da li ste sigurni da želite da obrišete ovaj zapis?" but can be overridden by passing a description prop to the DeleteModal component.
            default:
                return (
                    <>
                        <span>{description ?? "Da li ste sigurni da želite da obrišete ovaj zapis?"}</span>
                    </>
                );
        }
    };
    return (
        <Dialog open={openDeleteDialog.show ?? false} sx={{ "& .MuiDialog-paper": { maxWidth: "900px" } }}>
            <DialogTitle>{title ?? "Brisanje"}</DialogTitle>

            <DialogContent sx={{ margin: "0 auto" }}>
                <DialogContentText>{childrenData()}</DialogContentText>
            </DialogContent>

            <DialogActions>
                <Button
                    variant="outlined"
                    onClick={() => {
                        handleCancelToken ? handleCancel() : setOpenDeleteDialog({ ...openDeleteDialog, show: false });
                    }}
                    data-test-id="btn-cancel"
                    sx={styleButtonCancel}
                >
                    {nameOfButtonCancel ?? "odustani"}
                </Button>

                <Button
                    variant="contained"
                    color="error"
                    startIcon={deafultDeleteIcon ? <Icon>delete</Icon> : null}
                    onClick={handleConfirm}
                    data-test-id="btn-confirm"
                    sx={sx}
                    disabled={disabledButton}
                >
                    {nameOfButton ?? "obriši"}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DeleteModal;
