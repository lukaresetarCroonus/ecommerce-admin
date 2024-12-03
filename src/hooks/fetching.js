import { useState, useEffect } from "react";

import useIsMounted from "./isMounted";

function useFetching(fetchFn, fetchOnQ = false, customCallback = undefined, withoutLoadingOnMount = false) {
    const setStateIfMounted = useIsMounted();
    const [shouldFetch, setShouldFetch] = useState(!fetchOnQ);
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(!withoutLoadingOnMount && !fetchOnQ);

    useEffect(() => {
        const asyncFetch = async () => {
            if (shouldFetch) {
                try {
                    setLoading(true);
                    const response = await fetchFn();
                    if (response?.data?.payload) {
                        setStateIfMounted(setData, response?.data?.payload);
                    }
                } catch (e) {
                    setStateIfMounted(setData, null);
                } finally {
                    setStateIfMounted(setLoading, false);
                    setStateIfMounted(setShouldFetch, false);
                }
            }
        };
        asyncFetch();
    }, [shouldFetch]);

    return [data, loading, setShouldFetch.bind(null, true), setData];
}

export default useFetching;
