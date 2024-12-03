import React from "react";

import Paper from "@mui/material/Paper";

import Loading from "../../Loading/Loading";
import PageTitle from "../PageTitle/PageTitle";
import scss from "./PageWrapper.module.scss";

const PageWrapper = ({ title, back, children, actions, ready = true }) => {
    let content = children;

    // Make sure the content is ready to be shown
    for (const flag of Array.isArray(ready) ? ready : [ready]) {
        if (!flag && flag !== 0) {
            content = <Loading />;
        }
    }

    return (
        <Paper elevation={0} className={`${scss.wrapper}`}>
            {/* Page title */}
            {title && <PageTitle title={title} back={back} actions={actions} />}

            {/* Page contents */}
            {content}
        </Paper>
    );
};

export default PageWrapper;
