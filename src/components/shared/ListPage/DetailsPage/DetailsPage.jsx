import { useState } from "react";

import Box from "@mui/material/Box";

import PageWrapper from "../../Layout/PageWrapper/PageWrapper";
import DetailsList from "./DetailsList";

import styles from "./DetailsPage.module.scss";

/**
 * Render multiple panels.
 *
 * @param {string} title The title for the page.
 * @param {PanelSpec[]} fields The panels to render.
 * @param {boolean|[]} ready The panels to render.
 * @param {[]} additionalButtons The additional buttons for the header.
 *
 * @return {JSX.Element}
 * @constructor
 */
const DetailsPage = ({ adminSettings = false, title, fields, ready, additionalButtons = [], selectedPanel, panelHandleSelect = () => {} }) => {
    // Make sure all fields have and id and the enabled flag
    fields = (fields ?? []).map((field, index) => ({ ...field, id: field?.id ?? index, enabled: field?.enabled !== undefined ? !!field?.enabled : true }));

    // Set active panel, use received else get first from fields
    let selectedPanelData = selectedPanel;
    if (!selectedPanelData) {
        selectedPanelData = fields[0]?.id ?? null;
    }

    // Set selected panel
    const [selected, setSelected] = useState(selectedPanelData);

    // Get the active panel
    const activePanel = fields.find((field) => field.id === selected);

    // Handle action after click on panel tab
    const handleSelect = (field) => {
        if (field.enabled) {
            // Do extra functions if necessary
            const handlerData = panelHandleSelect(field);

            // Check if panelHandlerSelect allow to change panel tab
            if (typeof handlerData == "object" && "doTabChange" in handlerData) {
                if (handlerData.doTabChange) {
                    setSelected(field.id);
                }
            } else {
                // Set selected panel tab
                setSelected(field.id);
            }
        }
    };

    //re-render na promenu selectedPanel
    if (!adminSettings && selectedPanel !== selected) {
        setSelected(selectedPanel);
    }

    return (
        <PageWrapper title={title} back={true} actions={additionalButtons} ready={ready}>
            <Box className={styles.details}>
                {/* Panel selector */}
                <Box className={styles.list}>
                    <DetailsList fields={fields} handleSelect={handleSelect} selected={selected} />
                </Box>

                {/* Active panel */}
                <Box className={styles.main} key={selected}>
                    {activePanel?.component ?? null}
                </Box>
            </Box>
        </PageWrapper>
    );
};

export default DetailsPage;
