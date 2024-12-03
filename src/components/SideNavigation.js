import React, { useContext, useState, useEffect, Fragment } from "react";
import { NavLink } from "react-router-dom";
import { availableScreens } from "../routes/routes";
import sideNavLogoDark from "./../assets/images/croonus-sidebar-logo-dark.svg";
import sideNavLogoLight from "./../assets/images/croonus-sidebar-logo-light.svg";
import sideNavIcon from "./../assets/images/croonus-sidebar-icon.svg";
import AuthContext from "../store/auth-contex";
import Unicon from "./shared/Unicon/Unicon";
import ChevronRight from "@mui/icons-material/ChevronRight";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Badge from "@mui/material/Badge";
import Typography from "@mui/material/Typography";
import { useQuery } from "react-query";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@emotion/react";
import { filterScreens } from "../routes/utils";
import { useAppContext } from "../hooks/appContext";
import IconList from "../helpers/icons";

const SideNavigation = ({ activeTheme, userName, openSidenav }) => {
    const { system } = useAppContext();
    const { userScreens, logout } = useContext(AuthContext);
    const authCtx = useContext(AuthContext);
    const sortedScreens = userScreens?.sort((a, b) => a.order - b.order);
    const initialOpenGroups = {
        Prodaja: true,
    };
    const [openGroups, setOpenGroups] = useState(initialOpenGroups);
    const [navMenu, setNavMenu] = useState([]);
    const { api } = authCtx;

    const theme = useTheme();
    const isSmallScreen = useMediaQuery(theme.breakpoints.down("md"));
    const screens = filterScreens(availableScreens, system);

    useEffect(() => {
        if (authCtx.isLoggedIn && api?.get && api.user) {
            const updateMenu = async () => {
                await api
                    .get(`admin/profile/main-navigation-menu/${system?.toLowerCase()}`)
                    .then((response) => {
                        setNavMenu(response.payload);
                    })
                    .catch((error) => {
                        console.warn(error);
                    });
            };

            updateMenu();
        }
    }, [system, authCtx.isLoggedIn, api?.get, api.user]);

    // Populate the menu
    let menu = [];
    /* for (const allowedScreen of sortedScreens ?? []) {
        // Check for local screen definition
        const screen = screens[allowedScreen.screen_code];
        if (screen) {
            screen.name = allowedScreen.screen;
            // Init
            menu[screen.group.order] = menu[screen.group.order] ?? {
                name: screen.group.name,
                items: [],
            };

            // Add item
            menu[screen.group.order].items.push(screen);
        }
    } */
    for (const menuItem of navMenu ?? []) {
        let obj = {
            name: menuItem?.group.name,
            items: [],
        };

        for (const item of menuItem?.items ?? []) {
            const screen = availableScreens[item.code];
            if (screen) {
                obj.items.push({ icon: IconList[item.icon], name: item.name, path: screen?.path });
            }
        }
        if (obj.items.length > 0) {
            menu.push(obj);
        }
    }

    const toggleGroup = (groupName) => {
        setOpenGroups((prevOpenGroups) => ({
            // ...prevOpenGroups,
            [groupName]: !prevOpenGroups[groupName],
        }));
    };

    const { data: badgeNumberB2c } = useQuery(
        "badgeNumberB2c",
        async () => {
            if (api?.user) {
                const response = await api?.get(`admin/orders-b2c/list/badge-count`);
                return response?.payload;
            }
        },
        {
            refetchInterval: 5000,
            enabled: !!api?.user,
        }
    );

    const { data: badgeNumberB2b } = useQuery(
        "badgeNumberB2b",
        async () => {
            if (api?.user) {
                const response = await api?.get(`admin/orders-b2b/list/badge-count`);
                return response?.payload;
            }
        },
        {
            refetchInterval: 5000,
            enabled: !!api?.user,
        }
    );

    const { data: badgeNumberContactB2B } = useQuery(
        "badgeNumberContactB2B",
        async () => {
            if (api?.user) {
                const response = await api?.get(`admin/contact-form-b2b/badge-count`);
                return response?.payload;
            }
        },
        {
            refetchInterval: 5000,
            enabled: !!api?.user,
        }
    );

    const { data: badgeNumberContactB2C } = useQuery(
        "badgeNumberContactB2C",
        async () => {
            if (api?.user) {
                const response = await api?.get(`admin/contact-form-b2c/badge-count`);
                return response?.payload;
            }
        },
        {
            refetchInterval: 5000,
            enabled: !!api?.user,
        }
    );

    const badgets = [
        {
            path: "/b2c-orders",
            counts: badgeNumberB2c || [],
        },
        {
            path: "/b2b-orders",
            counts: badgeNumberB2b || [],
        },
        {
            path: "/b2b-contact",
            counts: badgeNumberContactB2B || [],
        },
        {
            path: "/b2c-contactform",
            counts: badgeNumberContactB2C || [],
        },
    ];

    useEffect(() => {
        const storedOpenGroups = JSON.parse(localStorage.getItem("openGroups")) || {};
        if (Object.keys(storedOpenGroups).length === 0) {
            setOpenGroups(initialOpenGroups);
        } else {
            setOpenGroups(storedOpenGroups);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("openGroups", JSON.stringify(openGroups));
    }, [openGroups]);

    return (
        <nav id="sidebar">
            <NavLink to="/homepage" className="logo">
                <img
                    className={"img-fluid desktop-logo" + (activeTheme ? " dark-theme-logo" : " light-theme-logo")}
                    src={activeTheme ? sideNavLogoDark : sideNavLogoLight}
                    alt={activeTheme ? sideNavLogoDark : sideNavLogoLight}
                />
                <img className={"img-fluid mobile-logo" + (activeTheme ? " dark-theme-icon" : " light-theme-icon")} src={sideNavIcon} alt={sideNavIcon} />
            </NavLink>
            <div className="sidebar-welcome">
                <Typography variant="subtitle1" sx={{ margin: "1rem 0 0", fontSize: "0.875rem" }}>
                    Dobrodošli
                </Typography>
                <Typography variant="subtitle1" sx={{ fontWeight: "500" }}>
                    {userName}
                </Typography>
            </div>
            <ul className="list-unstyled components mb-5 scroll-view">
                {menu.map((menuGroup) => {
                    if (isSmallScreen && menuGroup.name !== "Prodaja") {
                        return null;
                    }
                    return (
                        <Fragment key={menuGroup.name}>
                            <li className="sidebar-categories">
                                <p
                                    className={`group-toggle-button`}
                                    onClick={() => toggleGroup(menuGroup.name)}
                                    style={{
                                        cursor: "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "space-between",
                                        transition: "height 0.3s ease",
                                        overflow: "hidden",
                                        whiteSpace: "nowrap",
                                        height: openGroups[menuGroup.name] ? "2rem" : "1.5rem",
                                    }}
                                >
                                    {menuGroup.name}

                                    {openGroups[menuGroup.name] ? <ExpandMore sx={{ fontSize: "1rem" }} /> : <ChevronRight sx={{ fontSize: "1rem" }} />}
                                </p>
                            </li>

                            {openGroups[menuGroup.name] && (
                                <>
                                    {menuGroup.items.map((item, index) => {
                                        let renderedLink = null;
                                        if ((isSmallScreen && item.path === "/b2c-orders") || !isSmallScreen) {
                                            badgets.forEach((badget) => {
                                                if (item?.path === badget.path && badget.counts.find((item) => item.status === "new")?.count > 0) {
                                                    renderedLink = (
                                                        <Badge
                                                            badgeContent={badget.counts.find((item) => item.status === "new")?.count || 0}
                                                            showZero
                                                            sx={{
                                                                ".MuiBadge-badge": { backgroundColor: "#d32f2f", fontSize: "0.625rem", top: "50%", transform: "translateY(-50%)", right: "1rem" },
                                                                width: "100%",
                                                            }}
                                                        >
                                                            {isSmallScreen ? (
                                                                <NavLink onClick={openSidenav} to={item.path} className={(navData) => (navData.isActive ? "active" : "")} style={{ width: "100%" }}>
                                                                    <Unicon icon={item?.icon} />
                                                                    {item?.name}
                                                                </NavLink>
                                                            ) : (
                                                                <NavLink to={item.path} className={(navData) => (navData.isActive ? "active" : "")} style={{ width: "100%" }}>
                                                                    <Unicon icon={item?.icon} />
                                                                    {item?.name}
                                                                </NavLink>
                                                            )}
                                                        </Badge>
                                                    );
                                                }
                                            });

                                            if (renderedLink === null) {
                                                renderedLink = (
                                                    <NavLink to={item.path} className={(navData) => (navData.isActive ? "active" : "")}>
                                                        <Unicon icon={item.icon} />
                                                        {item.name}
                                                    </NavLink>
                                                );
                                            }

                                            return <li key={item.path}>{renderedLink}</li>;
                                        }
                                        return null;
                                    })}
                                </>
                            )}
                        </Fragment>
                    );
                })}
            </ul>
        </nav>
    );
};

export default SideNavigation;
