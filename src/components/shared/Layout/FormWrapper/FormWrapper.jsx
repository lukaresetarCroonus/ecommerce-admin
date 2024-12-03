import Box from "@mui/material/Box";

import PageWrapper from "../PageWrapper/PageWrapper";
import styles from "./FormWrapper.module.scss";

const FormWrapper = ({ title, back, children, actions, ready }) => {
  return (
    <PageWrapper title={title} back={back} actions={actions} ready={ready}>
      <Box className={styles.formWrapper}>
        <Box className={styles.formContainer}>{children}</Box>
      </Box>
    </PageWrapper>
  );
};

export default FormWrapper;
