import axios from "axios";
import { template, templateSettings } from "lodash";

// TODO filterEmptyStrings move to some helpers file
const filterEmptyStrings = (filterObject) => {
    if (!filterObject) return;
    let checkedObj = { ...filterObject };
    // eslint-disable-next-line array-callback-return
    Object.keys(checkedObj).map((column) => {
        if (checkedObj[column] === undefined || checkedObj[column] === null || checkedObj[column] === "") delete checkedObj[column];
    });
    return checkedObj;
};

const instance = axios.create();

instance.interceptors.response.use(
    (res) => res,
    (err) => err
);

const baseURL = localStorage.getItem("api");

const getDefaultOptions = ({ method = "get", params = undefined, data = undefined, url = undefined, responseType = undefined, headers }) => {
    return {
        headers,
        baseURL,
        method,
        responseType,
        params,
        data,
        url,
    };
};
// pathVariables - is object that contains key value pair that will replace :key name in path (as variable)
export const insertPathVariables = (path, pathVariables) => {
    if (!pathVariables) {
        return path;
    }
    templateSettings.interpolate = /:([A-z]*)/g;
    // replacing the ':param' with param data
    return template(path)(pathVariables);
};

// params - is object with key value pairs that will be serilized to query string
export const getByPathAndParams = ({ path = "/", params, pathVariables, headers } = {}) => {
    return instance(
        getDefaultOptions({
            params: filterEmptyStrings(params),
            url: insertPathVariables(path, pathVariables),
            headers: headers,
        })
    );
};

export const postPutByPathAndData = ({ path = "/", data, pathVariables, headers, method } = {}) => {
    return instance(
        getDefaultOptions({
            url: insertPathVariables(path, pathVariables),
            headers: headers,
            data: data,
            method: method,
        })
    );
};

export const deleteByPath = ({ path = "/", pathVariables, headers } = {}) => {
    return instance(
        getDefaultOptions({
            url: insertPathVariables(path, pathVariables),
            headers: headers,
            method: "delete",
        })
    );
};

// configList - is array of path strings
export const getAllByPathList = async (configList = []) => {
    const response = [];
    configList.map((path) => {
        response.push(getByPathAndParams({ path }));
    });
    return await Promise.all(response);
};
