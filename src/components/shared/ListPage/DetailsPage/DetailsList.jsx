import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Unicon from "../../Unicon/Unicon";

/**
 * @param {PanelSpec[]} fields
 * @param {int} selected
 * @param (function) handleSelect
 * @param {boolean} isLoadingList
 * @param {boolean} isErrorList
 *
 * @return {JSX.Element}
 * @constructor
 */
const DetailsList = ({ fields = [], selected = 0, handleSelect, isLoadingList, isErrorList }) => {
    return (
        <>
            <Box>
                <List className="no-padding">
                    {!isLoadingList ? (
                        <>
                            {fields.map((field) => (
                                <ListItem key={field.id} disablePadding selected={field.id === selected} onClick={() => handleSelect(field)} disabled={!field.enabled}>
                                    <ListItemButton>
                                        <ListItemIcon>
                                            <Unicon icon={field.icon} />
                                        </ListItemIcon>
                                        <ListItemText primary={field.name} />
                                        <ChevronRightIcon />
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </>
                    ) : (
                        <Stack spacing={1}>
                            <Skeleton variant="text" height={50} />
                            <Skeleton variant="text" height={50} />
                            <Skeleton variant="text" height={50} />
                            <Skeleton variant="text" height={50} />
                        </Stack>
                    )}
                </List>
            </Box>
            {isErrorList && (
                <Stack sx={{ width: "100%" }}>
                    <Alert severity="error">Doslo je do greske. Molim Vas pokusajte kasnije.</Alert>
                </Stack>
            )}
        </>
    );
};

export default DetailsList;
