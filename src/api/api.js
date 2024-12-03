import axios from "axios";
import { useContext, useState } from "react";
import AuthContext from "../store/auth-contex";

class ApiService {
    /** The currently logged-in user. */
    user: ?{ access_token: string };

    /** Prepare the service. */
    constructor(user) {
        this.user = user;
    }

    /**
     * Execute the API call
     *
     * @param {"LIST","GET"|"PUT"|"POST"|"DELETE"} method The HTTP method to use.
     * @param {string} path The path to the API, without the domain and API version suffix.
     * @param {?{}} payload The payload to send in the request.
     *
     * @return {Promise<APIResponse>}
     */
    _execute(method, path, payload = null) {
        return new Promise((resolve, reject) => {
            axios({
                method: method,
                url: localStorage.getItem("api") + path.replace(/^\//, ""),
                headers: { Authorization: `Bearer ${this.user?.access_token}` },
                data: payload,
            })
                .then((response) => resolve(response.data))
                .catch((error) => reject(error));
        });
    }

    /**
     * Execute the get API call
     *
     * @param {string} path The path to the API, without the domain and API version suffix.
     *
     * @return {Promise<APIResponse>}
     */
    get(path) {
        return this._execute("GET", path);
    }

    /**
     * Execute the pet API call
     *
     * @param {string} path The path to the API, without the domain and API version suffix.
     * @param {?{}} payload The payload to send in the request.
     *
     * @return {Promise<APIResponse>}
     */
    put(path, payload = null) {
        return this._execute("PUT", path, payload);
    }

    /**
     * Execute the post API call
     *
     * @param {string} path The path to the API, without the domain and API version suffix.
     * @param {?{}} payload The payload to send in the request.
     *
     * @return {Promise<APIResponse>}
     */
    post(path, payload) {
        return this._execute("POST", path, payload);
    }

    /**
     * Execute the list API call
     *
     * @param {string} path The path to the API, without the domain and API version suffix.
     * @param {?{}} payload The payload to send in the request.
     *
     * @return {Promise<APIResponse>}
     */
    list(path, payload) {
        return this._execute("LIST", path, payload);
    }

    /**
     * Execute the put API call
     *
     * @param {string} path The path to the API, without the domain and API version suffix.
     * @param {?{}} payload The payload to send in the request.
     *
     * @return {Promise<APIResponse>}
     */
    put(path, payload) {
        return this._execute("PUT", path, payload);
    }

    /**
     * Execute the delete API call
     *
     * @param {string} path The path to the API, without the domain and API version suffix.
     * @param {?{}} payload The payload to send in the request.
     *
     * @return {Promise<APIResponse>}
     */
    delete(path, payload) {
        return this._execute("DELETE", path, payload);
    }

    /**
     * Allow to change user data
     *
     * @param {array} userData Structure recived from AuthContext.user.
     */
    userDataUpdate(userData) {
        return (this.user = userData);
    }
}

/**
 * Get the reference to the API service.
 */
const useAPI = () => {
    const { user } = useContext(AuthContext);
    return useState(new ApiService(user))[0];
};

export default useAPI;
