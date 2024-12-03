import { useRef, useEffect } from "react";

function useIsMounted() {
    const isMounted = useRef(false);

    useEffect(() => {
        isMounted.current = true;
        return () => {
            isMounted.current = false;
        };
    }, []);

    function setStateIfMounted(setter, value) {
        if (isMounted.current) {
            setter(value);
        }
    }

    return setStateIfMounted;
}

export default useIsMounted;
