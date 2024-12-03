import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { QueryClient, QueryClientProvider, useQuery } from "react-query";
import { ThemeProvider } from "@mui/material";
import ApplicationRouter from "./routes/ApplicationRouter";
import AuthContext from "./store/auth-contex";
import { Flip, toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SideNavigation from "./components/SideNavigation";
import Header from "./components/Header";
import Loader from "./components/shared/Loading/Loading";
import CroonusTheme from "./theme";
import useAPI from "./api/api";
import DeleteModal from "./components/shared/Dialogs/DeleteDialog";
import { useIsIdle } from "./hooks/isIdle";
import { AppContextProvider } from "./hooks/appContext";

const App = () => {
    const api = useAPI();
    const queryClient = new QueryClient();
    const authCtx = useContext(AuthContext);
    let navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [sidenav, setSidenav] = useState(true);
    const [activeTheme, setActiveTheme] = useState(localStorage.getItem("theme") === "true" ?? false);

    useEffect(() => {
        //seting global api:
        authCtx?.setGlobalApiFile(api);
    }, [authCtx?.api]);

    useEffect(() => {
        if (authCtx.isLoggedIn) {
            // Update user data after login
            api.userDataUpdate(authCtx.user);
            const setUserScreens = (userScreens) => {
                authCtx.getUserScreens(userScreens);
            };
            const userScreens = async () => {
                if (authCtx?.api?.get) {
                    setIsLoading(true);
                    await authCtx?.api
                        .get(`admin/profile/user-permissions`)
                        .then((response) => {
                            const data = response?.payload;
                            if (!data) {
                                toast.warning("Greška!");
                            }

                            setUserScreens(response?.payload);
                        })
                        .catch((error) => {
                            console.warn(error);
                        });
                    setIsLoading(false);
                }
            };

            userScreens();
        }
    }, [authCtx.isLoggedIn, authCtx?.api]);

    useEffect(() => {
        const interval = setInterval(() => {
            if (authCtx.isLoggedIn) {
                authCtx?.api?.get(`admin/profile/user-permissions`).then((response) => {
                    const setUserScreens = (userScreens) => {
                        authCtx.getUserScreens(userScreens);
                    };
                    setUserScreens(response?.payload);
                });
            }
        }, 5 * 60 * 1000);

        return () => clearInterval(interval);
    });

    let routerClass;
    if (!authCtx.isLoggedIn) {
        routerClass = "";
    } else if (sidenav) {
        routerClass = "side-open router-container";
    } else {
        routerClass = "router-container";
    }

    if (activeTheme && authCtx.isLoggedIn) {
        document.body.classList.add("theme-dark");
        document.body.classList.remove("theme-light");
    } else {
        document.body.classList.add("theme-light");
        document.body.classList.remove("theme-dark");
    }

    const isIdle = useIsIdle();
    useEffect(() => {
        //token_expires_at je unix timestamp
        let token_expires_at = authCtx?.user?.expires_in * 1000 + authCtx?.user?.loggedAt;

        let time_left = (token_expires_at - new Date().getTime()) / 1000;

        //svaki sekund oduzimamo 1 od vremena
        const interval = setInterval(() => {
            time_left--;
            //ako je time_left = 300 ( 5 minuta ), i ako je isIdle = true, onda prikazi modal
            if (time_left <= 300 && isIdle) {
                authCtx.setShowModal(true);
            }
            //ako je time_left = 300, i isIdle = false, osvezava se token
            if (time_left <= 300 && !isIdle) {
                authCtx.setShowModal(false);
                if (authCtx?.api?.get) {
                    authCtx?.api
                        .get(`admin/profile/refresh-token`)
                        .then((response) => {
                            const data = response?.payload;

                            if (!data) {
                                toast.warning("Greška!");
                            }

                            const expirationTime = new Date(new Date().getTime() + +data.expires_in * 1000);
                            authCtx.login(
                                {
                                    ...data,
                                    loggedAt: new Date().getTime(),
                                },
                                expirationTime
                            );
                            authCtx?.api?.userDataUpdate(data);
                        })
                        .catch((error) => {
                            console.warn(error);
                        });
                }
            }
        }, 1000);

        return () => clearInterval(interval);
    });

    const refreshUserToken = () => {
        if (authCtx?.api?.get) {
            authCtx?.api
                .get(`admin/profile/refresh-token`)
                .then((response) => {
                    const data = response?.payload;

                    if (!data) {
                        toast.warning("Greška!");
                    }

                    const expirationTime = new Date(new Date().getTime() + +data.expires_in * 1000);
                    authCtx.login(
                        {
                            ...data,
                            loggedAt: new Date().getTime(),
                        },
                        expirationTime
                    );
                    authCtx?.api?.userDataUpdate(data);
                    authCtx.setShowModal(false);
                    navigate(0);
                })
                .catch((error) => {
                    console.warn(error);
                });
        }
    };

    useEffect(() => {
        if (authCtx.isRefreshingToken) {
            refreshUserToken();
            authCtx.setIsRefreshingToken(false);
        }
    }, [authCtx.isRefreshingToken]);

    return (
        <QueryClientProvider client={queryClient}>
            <ThemeProvider theme={CroonusTheme}>
                <AppContextProvider>
                    <div className={routerClass}>
                        {authCtx.isLoggedIn && (
                            <>
                                <SideNavigation
                                    openSidenav={() => setSidenav(!sidenav)}
                                    activeTheme={activeTheme}
                                    userName={(authCtx.user.user.first_name ?? "") + " " + (authCtx.user.user.last_name ?? "")}
                                />
                                <Header
                                    openSidenav={() => setSidenav(!sidenav)}
                                    isSideNavOpen={sidenav}
                                    activeTheme={activeTheme}
                                    changeTheme={() => {
                                        setActiveTheme(!activeTheme);
                                        localStorage.setItem("theme", !activeTheme);
                                    }}
                                />
                            </>
                        )}

                        {/* Main content */}
                        <div className={authCtx.isLoggedIn ? "main-wrapper" : ""}>
                            <ApplicationRouter />
                        </div>

                        {/* Toast */}
                        <ToastContainer position="top-center" theme="colored" transition={Flip} autoClose={800} newestOnTop={false} draggable={false} closeOnClick hideProgressBar pauseOnHover />

                        {isLoading && <Loader size={50} />}
                    </div>

                    <DeleteModal
                        title="Obaveštenje"
                        openDeleteDialog={{ show: authCtx.modal }}
                        nameOfButtonCancel="Odjavite se"
                        nameOfButton="Nastavite rad"
                        deafultDeleteIcon={false}
                        description={`Vaša sesija ističe za 5 minuta. Da li želite da nastavite rad?`}
                        handleConfirm={() => {
                            refreshUserToken();
                        }}
                        sx={{ backgroundColor: "#28a86e", "&:hover": { backgroundColor: "rgb(28, 117, 77)" } }}
                        handleCancel={async () => {
                            authCtx.setShowModal(false);
                            await authCtx?.api
                                .post("admin/profile/logout")
                                .then((response) => {
                                    toast.success("Uspešno ste se odjavili!");
                                    navigate(`/`);
                                    authCtx.logout();
                                    authCtx?.api?.userDataUpdate(null);
                                })
                                .catch((error) => {
                                    console.warn(error);
                                });
                        }}
                        handleCancelToken={true}
                    />
                </AppContextProvider>
            </ThemeProvider>
        </QueryClientProvider>
    );
};

export default App;
