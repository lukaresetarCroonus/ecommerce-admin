import React, { useState, useCallback, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import { useIsIdle } from "../hooks/isIdle";
import { useNavigate } from "react-router-dom";
import useAPI from "../api/api";

let logoutTimer;
let refreshTokenTimer;
let showModalTimer;

const AuthContext = React.createContext({
    user: [],
    userScreens: [],
    isLoggedIn: false,
    isTokenExpired: false,
    isRefreshingToken: false,
    startScreen: null,
    api: {},
    login: (user) => {},
    logout: () => {},
    getUserScreens: (userScreens) => {},
    changeTokenExpired: (tokenExpired) => {},
    setGlobalApiFile: (apiConfig) => {},
    setIsRefreshingToken: (value) => {},
});

const calculateRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();
    const remainingDuration = adjExpirationTime - currentTime;
    // const remainingDuration = 10000;
    return remainingDuration;
};

const calculateTokenRemainingTime = (expirationTime) => {
    const currentTime = new Date().getTime();
    const adjExpirationTime = new Date(expirationTime).getTime();

    const remainingDuration = adjExpirationTime - currentTime - 300000;

    return remainingDuration;
};

const retrieveStoredUser = () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedExpirationDate = localStorage.getItem("expirationTime");

    const remainingTime = calculateRemainingTime(storedExpirationDate);

    return {
        user: storedUser,
        duration: remainingTime,
    };
};

export const AuthContextProvider = (props) => {
    let userData = retrieveStoredUser();
    let navigate = useNavigate();

    const [tokenExpired, setTokenExpired] = useState(false);
    const [showTokenExpiryModal, setShowTokenExpiryModal] = useState(false);
    const lastActivityTimeRef = useRef(new Date().getTime());

    if (userData.duration <= 10000 && userData.user) {
        localStorage.removeItem("user");
        localStorage.removeItem("expirationTime");
        localStorage.removeItem("lastHttp");
        setTokenExpired(true);
        userData = null;
    }

    let initialUser;
    if (userData) {
        initialUser = userData.user;
    }

    const [user, setUser] = useState(initialUser);
    const [userScreensData, setUserScreensData] = useState([]);
    const [refreshingToken, setRefreshingToken] = useState(false);
    const [startScreenData, setStartScreenData] = useState(null);
    const [globalApi, setApi] = useState({});

    const userIsLoggedIn = !!user && !!user.access_token;

    const logoutHandler = useCallback(() => {
        setUser(null);
        localStorage.removeItem("user");
        localStorage.removeItem("expirationTime");
        localStorage.removeItem("lastHttp");
        localStorage.removeItem("openGroups");

        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
        if (refreshTokenTimer) {
            clearTimeout(refreshTokenTimer);
        }

        setStartScreenData(null);
    }, []);

    const loginHandler = (user, expirationTime) => {
        setUser(user);
        setRefreshingToken(false);
        localStorage.setItem("expirationTime", expirationTime);
        localStorage.setItem("user", JSON.stringify(user));

        const remainingTime = calculateRemainingTime(expirationTime);
        if (logoutTimer) {
            clearTimeout(logoutTimer);
        }
        logoutTimer = setTimeout(logoutHandler, remainingTime);

        const remainingTokenTime = calculateTokenRemainingTime(expirationTime);

        if (refreshTokenTimer) {
            clearTimeout(refreshTokenTimer);
        }
        refreshTokenTimer = setTimeout(refreshToken, remainingTokenTime);

        setStartScreenData(user?.user?.start_screen_code ?? "");
    };

    const refreshToken = useCallback(() => {
        const storedExpirationDate = localStorage.getItem("expirationTime");
        const remainingTime = calculateRemainingTime(storedExpirationDate);
        if (remainingTime <= 5000) {
            return;
        }

        const storedLastHttp = localStorage.getItem("lastHttp");
        const storedLastHttpMs = new Date(storedLastHttp).getTime();
        const tokenExpiringTimeMs = new Date(storedExpirationDate).getTime();
        if (15 * 60 * 1000 >= remainingTime) {
            setIsRefreshingToken(true);
        } else {
            if (refreshTokenTimer) {
                clearTimeout(refreshTokenTimer);
            }
            refreshTokenTimer = setTimeout(refreshToken, 60000);
        }
    }, []);

    const updateLastActivityTime = () => {
        lastActivityTimeRef.current = new Date().getTime();
    };

    useEffect(() => {
        const events = ["mousedown", "mousemove", "keydown", "touchstart", "scroll"];
        events.forEach((event) => window.addEventListener(event, updateLastActivityTime));

        return () => {
            events.forEach((event) => window.removeEventListener(event, updateLastActivityTime));
        };
    }, []);

    useEffect(() => {
        let activityCheckTimer;
        let activityTime = 20 * 60 * 1000;
        let refreshTimer = 10 * 60 * 1000;
        const checkLastActivityTime = () => {
            const currentTime = new Date().getTime();
            if (currentTime - lastActivityTimeRef.current <= activityTime) {
                refreshToken();
            }
            activityCheckTimer = setTimeout(checkLastActivityTime, refreshTimer);
        };

        checkLastActivityTime();

        return () => {
            if (activityCheckTimer) {
                clearTimeout(activityCheckTimer);
            }
        };
    }, [refreshToken]);

    useEffect(() => {
        if (userData?.user) {
            if (logoutTimer) {
                clearTimeout(logoutTimer);
            }
            logoutTimer = setTimeout(logoutHandler, userData.duration);

            const storedExpirationDate = localStorage.getItem("expirationTime");
            const remainingTokenTime = calculateTokenRemainingTime(storedExpirationDate);

            if (refreshTokenTimer) {
                clearTimeout(refreshTokenTimer);
            }
            refreshTokenTimer = setTimeout(refreshToken, remainingTokenTime);
            let modalShowTime = remainingTokenTime - 300000;

            showModalTimer = setTimeout(() => {
                setShowTokenExpiryModal(true);
            }, modalShowTime);

            return () => {
                clearTimeout(showModalTimer);
            };
        }
    }, [userData, logoutHandler, refreshToken]);

    useEffect(() => {
        const handleStorageChange = (event) => {
            if (event.key === "user") {
                setShowTokenExpiryModal(false);
                navigate(0);
            }

            if (event.key === "expirationTime") {
            }
        };

        window.addEventListener("storage", handleStorageChange);

        return () => {
            window.removeEventListener("storage", handleStorageChange);
        };
    }, []);

    useEffect(() => {
        if (!userIsLoggedIn) {
            setShowTokenExpiryModal(false);
        }
    }, [userIsLoggedIn]);

    const userScreensHandler = (userScreens) => {
        setUserScreensData(userScreens);
    };
    const setIsTokenExpiring = (tokenExpired) => {
        setTokenExpired(tokenExpired);
    };

    const setGlobalApiFile = (apiConfig) => {
        setApi(apiConfig);
    };

    const setIsRefreshingToken = (value) => {
        setRefreshingToken(value);
    };

    const setShowModal = (value) => {
        setShowTokenExpiryModal(value);
    };

    const contextValue = {
        user: user,
        isLoggedIn: userIsLoggedIn,
        isTokenExpired: tokenExpired,
        isRefreshingToken: refreshingToken,
        setIsRefreshingToken: setIsRefreshingToken,
        userScreens: userScreensData,
        startScreen: startScreenData,
        login: loginHandler,
        logout: logoutHandler,
        getUserScreens: userScreensHandler,
        changeTokenExpired: setIsTokenExpiring,
        api: globalApi,
        setGlobalApiFile: setGlobalApiFile,
        modal: showTokenExpiryModal,
        setShowModal: setShowModal,
    };

    return (
        <>
            <AuthContext.Provider value={contextValue}>{props.children}</AuthContext.Provider>
        </>
    );
};

export default AuthContext;
