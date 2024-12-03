import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import AuthContext from "../store/auth-contex";
import { availableScreens } from "./routes";
import { filterScreens, makeRoute } from "./utils";
import { useAppContext } from "../hooks/appContext";

/**
 * The main application router that takes the configuration from routes.js.
 *
 * @return {JSX.Element}
 * @constructor
 */
const ApplicationRouter = ({}) => {
    const { system } = useAppContext();

    const authContext: { isLoggedIn: boolean, userScreens: [{ screen_code: string }], startScreen: null } = useContext(AuthContext);

    const screens = filterScreens(availableScreens, system);
    // Get the default screen for the user
    const defaultPath = screens[authContext.startScreen]?.path ?? "/homepage";

    // Unauthorized users
    const unauthorizedRoutes = (
        <>
            <Route path="/login" element={<LoginPage />} />
            <Route path="*" element={<Navigate replace to="/login" />} />
        </>
    );

    // Authorized users
    const authorizedRoutes = (
        <>
            <Route key="" path="" exact element={<Navigate replace to={defaultPath} />} />
            <Route key="/" path="/" exact element={<Navigate replace to={defaultPath} />} />
            {authContext.userScreens?.map((userScreen) => makeRoute(screens[userScreen.screen_code]))}
        </>
    );

    return <Routes>{authContext?.isLoggedIn ? authorizedRoutes : unauthorizedRoutes}</Routes>;
};

export default ApplicationRouter;
