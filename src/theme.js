import { createTheme } from "@mui/material/styles"
import scssVariables from "./variables.scss"

/** The MUI theme to use. */
const CroonusTheme = createTheme({
    palette: {
        primary: {
            main: scssVariables.theme
        }
    },

    typography: {
        fontFamily: [ "Montserrat", "sans-serif" ].join(",")
    },
    components: {
        MuiListItem    : {
            styleOverrides: {
                root: {
                    "&.Mui-selected": {
                        backgroundColor: scssVariables.theme,
                        "span, svg"    : {
                            color: "white"
                        }
                    },
                    "&:hover"       : {
                        // backgroundColor: "var(--main-color)"
                    }
                }
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: 36
                }
            }
        }
    }
})

export default CroonusTheme
