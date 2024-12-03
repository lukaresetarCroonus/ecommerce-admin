import { useState, useCallback, useContext } from "react";
import { toast } from "react-toastify";
import AuthContext from "../store/auth-contex";

const useHttp = () => {
    const [isLoading, setIsLoading] = useState(false);

    const { user, changeTokenExpired } = useContext(AuthContext);

    const sendRequest = useCallback(
        async (requestConfig, applyData) => {
            setIsLoading(true);
            if (requestConfig.headers && user?.access_token) {
                requestConfig.headers = { Authorization: `Bearer ${user.access_token}` };
            } else {
                if (requestConfig.body) {
                    requestConfig.body = JSON.stringify(requestConfig.body);
                }
            }

            let isWarning = false;

            try {
                const response = await fetch(requestConfig.url, {
                    method: requestConfig.method ? requestConfig.method : "GET",
                    headers: requestConfig.headers
                        ? requestConfig.headers
                        : {
                              "Content-Type": "application/json",
                              Authorization: `Bearer ${user.access_token}`,
                          },
                    body: requestConfig.body ? requestConfig.body : null,
                });

                let data;
                try {
                    data = await response.json();
                } catch (err) {
                    throw new Error(response.statusText || "Something went wrong!");
                }

                if (data.is_expired) {
                    const expirationTime = new Date(new Date().getTime());
                    localStorage.setItem("expirationTime", expirationTime);
                    changeTokenExpired(null);
                    throw new Error(data.message ?? "Request failed!");
                } else if (data.is_error) {
                    if (data.message !== undefined) {
                        throw new Error(data.message);
                    } else {
                        throw new Error("Request failed!");
                    }
                } else if (data.is_warning) {
                    if (data.message !== undefined) {
                        isWarning = true;
                        throw new Error(data.message);
                    } else {
                        throw new Error("Request failed!");
                    }
                } else if (!response.ok) {
                    throw new Error("Request failed!");
                }

                if (data.message !== undefined) {
                    toast.success(data.message);
                }
                const currentTime = new Date(new Date().getTime());
                localStorage.setItem("lastHttp", currentTime);

                applyData(data.data);
            } catch (err) {
                const currentTime = new Date(new Date().getTime());
                localStorage.setItem("lastHttp", currentTime);
                if (isWarning) {
                    toast.warning(err.message || "Something went wrong!");
                    isWarning = false;
                } else {
                    toast.error(err.message || "Something went wrong!");
                }
            }
            setIsLoading(false);
        },
        [user]
    );

    return {
        isLoading,
        sendRequest,
    };
};

export default useHttp;
