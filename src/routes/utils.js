import React, { Fragment } from "react";
import { Route } from "react-router-dom";

/** The menu MenuGroups to show menu items in. */
export const MenuGroup = {
    SALE: { order: 0, name: "Prodaja" },
    PRODUCT: { order: 1, name: "Katalog" },
    REPORTS: { order: 2, name: "Izveštaji" },
    B2B: { order: 3, name: "B2B" },
    B2C: { order: 4, name: "B2C" },
    COMPANY_SETTINGS: { order: 5, name: "Kompanija" },
    SETTINGS: { order: 6, name: "Podešavanja" },
};

/**
 * Make a screen object from the array.
 *
 * @param {[]} screen The original screen, as defined in the routes.js.
 * @param {string} parentPath The path of the parent screen.
 *
 * @return {AvailableScreen}
 */
export const makeScreen = (screen, parentPath) => {
    // Quick screen without name
    if (screen.length === 2) {
        screen = [screen[0], null, null, null, screen[1], []];
    }

    // Append the parent path
    if (parentPath) {
        screen[0] = `${parentPath}/${screen[0]}`;
    }

    return {
        path: screen[0],
        name: screen[1],
        icon: screen[2],
        group: screen[3],
        component: screen[4],
        children: (screen[5] ?? [])?.map((child) => makeScreen(child, screen[0])) ?? [],
    };
};

/**
 * Create a route for a screen.
 *
 * @param {AvailableScreen} screen The screen to create the route for
 * @return {Route}
 */
export const makeRoute = (screen) =>
    screen?.component ? (
        <Fragment key={screen.path}>
            {screen.children?.map(makeRoute)}
            <Route path={screen.path} element={React.createElement(screen.component)} />
        </Fragment>
    ) : null;

export const filterScreens = (screens, system) => {
    if (system !== "B2B" && system !== "B2C") {
        return screens;
    }

    const saleGroup = MenuGroup.SALE;
    const result = {};
    for (const key in screens) {
        const item = screens[key];
        if (item.group.name === saleGroup.name) {
            if (key.includes(system) || (!key.includes("B2B") && !key.includes("B2C"))) {
                result[key] = item;
            }
        } else {
            result[key] = item;
        }
    }

    return result;
};
