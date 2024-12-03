import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthContext from "../store/auth-contex";
import Loader from "./shared/Loading/Loading";

import DehazeIcon from "@mui/icons-material/Dehaze";
// import KeyboardBackspaceIcon from "@mui/icons-material/KeyboardBackspace";
import EastIcon from "@mui/icons-material/East";

import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import Box from "@mui/material/Box";

import { height, styled, width } from "@mui/system";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { toast } from "react-toastify";
import sideNavIcon from "../assets/images/croonus-sidebar-icon.svg";
import logoMediaPrint from "../assets/images/croonus-sidebar-logo-dark.svg";
import { set } from "lodash";
import { Switch } from "@mui/material";
import SystemSwitch from "./shared/SystemSwitch/SystemSwitch";
import { useAppContext } from "../hooks/appContext";
import Unicon from "./shared/Unicon/Unicon";
import IconList from "../helpers/icons";
import SystemSelect from "./shared/SystemSwitch/SystemSelect";

const Header = ({ openSidenav, changeTheme, activeTheme, isSideNavOpen }) => {
    const { system, setSystem } = useAppContext();

    const apiPath = "admin/profile/logout";
    const navigate = useNavigate();

    const [isLoading, setIsLoading] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);
    const [link, setLink] = useState(null);

    const open = Boolean(anchorEl);

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    useEffect(() => {
        return () => {
            setIsLoading(false);
        };
    }, []);

    useEffect(() => {
        if (authCtx.isLoggedIn && api?.get && api.user) {
            const updateLink = async () => {
                await api
                    .get(`admin/profile/shop-url/${system?.toLowerCase()}`)
                    .then((response) => {
                        setLink(response.payload);
                    })
                    .catch((error) => {
                        console.warn(error);
                    });
            };

            updateLink();
        }
    }, [system, authCtx.isLoggedIn, api?.get, api.user]);

    const logoutHandler = async (e) => {
        //Uvek mora da izloguje korisnika bez obzira da li je api prosao ili ne
        authCtx.logout();

        setIsLoading(true);
        await api
            .post(apiPath)
            .then((response) => {
                toast.success("Uspešno ste se odjavili!");
                navigate(`/`);
                api?.userDataUpdate(null);
                setIsLoading(false);
            })
            .catch((error) => {
                console.warn(error);
                setIsLoading(false);
            });
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };
    const StyledNav = styled(Box)({
        backgroundColor: "var(--bg-color)",
        padding: "0.938rem 2rem",
        boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
        "@media print": {
            padding: "0 1rem !important",
        },
        position: "sticky",
        zIndex: "100",
        top: "0",
    });

    // const StyledToggleButton = styled(Switch)({
    //     "& .MuiSwitch-thumb": {
    //         boxShadow: "0px 0px 10px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,2,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)",
    //     },
    //     ".MuiSwitch-switchBase.Mui-checked": {
    //         color: "var(--main-color)",
    //         "&:hover": {
    //             backgroundColor: "rgba(255, 255, 255, 0.1)",
    //         },
    //     },
    // });

    return (
        <>
            <StyledNav>
                <Grid container alignItems="center" sx={{ flexWrap: "nowrap" }}>
                    <Box
                        sx={{
                            "@media (min-width: 900px)": {
                                display: "none",
                            },
                        }}
                    >
                        {/* <img src={sideNavIcon} alt="Croonus" width={60} className="sideNavIcon" /> */}
                        <img src={logoMediaPrint} alt="Croonus" width={300} className="mediaPrintLogo" />
                    </Box>

                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "inherit",
                            "@media (max-width: 899px)": {
                                justifyContent: "flex-end",
                            },
                            "@media print": {
                                display: "none",
                            },
                        }}
                    >
                        <Grid
                            item
                            xs={1}
                            sx={{
                                pr: 1,
                                // "@media (max-width: 900px)": {
                                //     order: 1,
                                // },
                                display: "flex",
                                alignItems: "center",
                                marginRight: "auto",
                            }}
                        >
                            {!isSideNavOpen && (
                                <Box>
                                    <img src={sideNavIcon} alt="Croonus" width={60} />
                                </Box>
                            )}
                            <IconButton onClick={openSidenav}>
                                {isSideNavOpen ? (
                                    <DehazeIcon
                                        sx={{
                                            color: "var(--third-color)",
                                            "@media (max-width: 899px)": {
                                                paddingLeft: "14rem",
                                            },
                                            "@media (max-width: 380px)": {
                                                paddingLeft: "10.5rem",
                                            },
                                        }}
                                    />
                                ) : (
                                    <EastIcon sx={{ color: "var(--third-color)" }} />
                                )}
                            </IconButton>
                            <Box>
                                {/* <SystemSwitch
                                    checked={system === "B2B"}
                                    onChange={({ target }) => {
                                        setSystem(target.checked ? "B2B" : "B2C");
                                    }}
                                /> */}
                                <SystemSelect
                                    onChange={(event) => {
                                        setSystem(event.target.value);
                                    }}
                                    value={system}
                                />
                            </Box>
                        </Grid>

                        <Grid container alignItems="center" width="auto">
                            {/* <Grid item>
                                <StyledToggleButton checked={activeTheme} onClick={changeTheme} name="themeSwitcher" inputProps={{ "aria-label": "toggle theme" }} />
                            </Grid> */}
                            {link && link.status && (
                                <Grid item>
                                    <Link to={link.url} target="_blank" title={link.title}>
                                        <Unicon icon={IconList[link.icon]} styleIcon={{ fontSize: 47, color: "black" }} />
                                    </Link>
                                </Grid>
                            )}
                            <Grid item>
                                <IconButton
                                    onClick={handleClick}
                                    size="small"
                                    sx={{
                                        ml: 2,
                                        background: "var(--sidebar-bg-color)",
                                        color: "var(--main-bg-color)",
                                        padding: "0.8rem",
                                        "&:hover": {
                                            backgroundColor: "var(--sidebar-bg-color)",
                                        },
                                    }}
                                    aria-controls={open ? "account-menu" : undefined}
                                    aria-haspopup="true"
                                    aria-expanded={open ? "true" : undefined}
                                >
                                    {authCtx.user?.user?.first_name?.charAt(0) + authCtx.user?.user?.last_name?.charAt(0)}
                                </IconButton>
                                <Menu
                                    anchorEl={anchorEl}
                                    id="account-menu"
                                    open={open}
                                    onClose={handleClose}
                                    onClick={handleClose}
                                    PaperProps={{
                                        elevation: 0,
                                        sx: {
                                            overflow: "visible",
                                            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                                            mt: 1.5,
                                            right: "3rem",
                                            left: "auto !important",
                                            top: "3.5rem !important",
                                            "&:before": {
                                                content: '""',
                                                display: "block",
                                                position: "absolute",
                                                top: 0,
                                                right: 14,
                                                width: 10,
                                                height: 10,
                                                bgcolor: "background.paper",
                                                transform: "translateY(-50%) rotate(45deg)",
                                                zIndex: 0,
                                            },
                                        },
                                    }}
                                >
                                    <MenuItem
                                        onClick={(e) => {
                                            logoutHandler(e);
                                        }}
                                        sx={{
                                            "&:hover": {
                                                backgroundColor: "inherit",
                                                color: "inherit",
                                            },
                                        }}
                                    >
                                        Odjavite se
                                    </MenuItem>
                                </Menu>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </StyledNav>
            {isLoading && <Loader size={50} />}
        </>
    );
};

export default Header;
