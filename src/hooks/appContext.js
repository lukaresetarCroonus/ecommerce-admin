import React, { createContext, useContext, useState } from "react";

const AppContext = createContext();

export const AppContextProvider = ({ children }) => {
    const [system, setSystem] = useState("B2C");
    return <AppContext.Provider value={{ system, setSystem }}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
    return useContext(AppContext);
};
