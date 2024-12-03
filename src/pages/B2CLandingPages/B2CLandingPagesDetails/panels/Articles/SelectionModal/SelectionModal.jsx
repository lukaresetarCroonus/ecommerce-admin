import CampaignList from "../CampaignList/CampaignList";
import CampaignTable from "../CampaignTable/CampaignTable";
import ListPageModalWrapper from "../../../../../../components/shared/Modal/ListPageModalWrapper";
import { Box } from "@mui/material";

const SelectionModal = ({ openDialog, setOpenDialog, selectedValues, component, opt, options, setOptions, onChange, inputType, isLoadingOpt }) => {
    const ComponentToRender = () => {
        switch (component) {
            case "list":
                return <CampaignList data={opt} selected={selectedValues} onChange={onChange} inputType={inputType} />;
            case "table":

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
        <ListPageModalWrapper
            anchor="right"
            open={openDialog.show ?? false}
            onClose={() => setOpenDialog({ ...openDialog, show: false })}
            onCloseButtonClick={() => setOpenDialog({ ...openDialog, show: false })}
        >
            <Box sx={{ padding: "2rem" }}>{opt && ComponentToRender()}</Box>
        </ListPageModalWrapper>
    );
};

export default SelectionModal;
