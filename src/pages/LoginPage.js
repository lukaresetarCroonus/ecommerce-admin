import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import singinBackground from "./../assets/images/signin-background.png";
import logo from "./../assets/images/login-logo.svg";
import useInput from "../hooks/use-input";
import AuthContext from "../store/auth-contex";
import { regax } from "../helpers/const";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Form from "../components/shared/Form/Form";
import fields from "../pages/loginFields.json";

const LoginPage = () => {
    const apiPath = "admin/sign-in/login";

    const init = {
        email: null,
        password: null,
    };

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const regex = regax;
    const [show, setShow] = useState(false);

    const [data, setData] = useState(init);
    const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
    const navigate = useNavigate();

    const setLoginData = (userData) => {
        const expirationTime = new Date(new Date().getTime() + +userData.expires_in * 1000);
        authCtx.login(
            {
                ...userData,
                loggedAt: new Date().getTime(),
            },
            expirationTime
        );
        navigate(`/`);
    };

    const submitHandler = async (data) => {
        setIsLoadingOnSubmit(true);
        await api
            .post(apiPath, data)
            .then((response) => {
                if (response?.payload?.user?.id) {
                    setLoginData(response.payload);
                }
                toast.success(`Uspešno`);
                setIsLoadingOnSubmit(false);
            })
            .catch((error) => {
                console.warn(error);
                toast.warning("Greška");
                setIsLoadingOnSubmit(false);
            });
    };

    const {
        value: emailValue,
        isValid: emailIsValid,
        hasError: emailHasError,
        valueChangeHandler: emailChangeHandler,
        inputBlurHandler: emailBlurHandler,
    } = useInput((value) => (!value && value.trim() !== "") || regex.test(value) !== false);

    const {
        value: passwordValue,
        isValid: passwordIsValid,
        hasError: passwordHasError,
        valueChangeHandler: passwordChangeHandler,
        inputBlurHandler: passwordBlurHandler,
    } = useInput((value) => value.trim() !== "");

    return (
        <Box
            sx={{
                width: "100%",
                height: "100vh",
                overflow: "auto",
            }}
        >
            <Grid container sx={{ height: "100%" }}>
                <Grid
                    item
                    md={12}
                    lg={7}
                    sx={{
                        display: { xs: "none", md: "flex" },
                        justifyContent: "center",
                        alignItems: "center",
                        backgroundColor: "var(--login-img-background)",
                        "@media (max-width: 1200px)": {
                            display: "none",
                        },
                    }}
                >
                    <img src={singinBackground} alt={singinBackground} style={{ maxHeight: "100%", width: "100%" }} />
                </Grid>
                <Grid
                    item
                    xs={12}
                    md={12}
                    lg={5}
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: { xs: "center" },
                        justifyContent: "center",
                        padding: { xs: "1.5rem", md: "0 3rem", lg: "0 5rem" },
                        "@media (max-width: 1200px)": {},
                    }}
                >
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            mb: 2,
                            "@media (max-width: 1200px)": {
                                alignItems: "center",
                            },
                        }}
                    >
                        <img src={logo} alt={logo} width="68%" />
                        <Typography
                            variant="h5"
                            sx={{
                                fontWeight: "600",
                                paddingTop: "3rem",
                                fontSize: "1.6875rem",
                                "@media (max-width: 1200px)": {
                                    fontSize: "1rem",
                                    textAlign: "center",
                                    paddingTop: "1.5rem",
                                },
                            }}
                        >
                            Dobrodošli na Croonus CMS.
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{
                                mt: 1,
                                mb: 3,
                                "@media (max-width: 1200px)": {
                                    fontSize: "0.8rem",
                                    textAlign: "center",
                                    marginTop: "0",
                                    marginBottom: "0.5rem",
                                },
                            }}
                        >
                            Molimo unesite Vaše pristupne podatke za pristup administraciji.
                        </Typography>
                        <Box sx={{ maxWidth: "28.125rem" }}>
                            <Form
                                formFields={fields}
                                initialData={data}
                                onSubmit={submitHandler}
                                isLoading={isLoadingOnSubmit}
                                label={"Prijavite se"}
                                styleButtonSubmit={{
                                    fontWeight: "400",
                                    marginTop: "0.5rem",
                                    minWidth: "15rem !important",
                                    boxShadow: "none",
                                    "&:hover": { boxShadow: "none" },
                                    "@media (max-width: 1200px)": {
                                        minWidth: "12rem !important",
                                    },
                                }}
                                styleWrapperButtons={{
                                    "@media (max-width: 1200px)": {
                                        justifyContent: "center",
                                    },
                                }}
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};

export default LoginPage;
