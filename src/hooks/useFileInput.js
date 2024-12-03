import { useLayoutEffect, useRef } from "react";
import { blobToData } from "../helpers/data";

/**
 * Capture a new file added to a new file input.
 *
 * Usage:
 * ```js
 * const input = userFileInput((name, base64) => console.log("File captured", name, base64))
 * return <input ref={input} type="file" />
 * ```
 *
 * @param {function(name: string, base64: string)} handler The handler that will capture the filename and the base64 encoded data.
 */
const useFileInput = (handler: function) => {
    // Create the reference to the file input and add listeners
    const inputElementRef = useRef();
    useLayoutEffect(() => inputElementRef.current?.addEventListener("change", (event) => handleFiles(event.target.files)), []);

    // Handle changes for each file
    const handleFiles = (files) => {
        if (files.length > 0) {
            const file = { ...files[0] };
            blobToData(files[0]).then((result) => handler(file.name, result));
            inputElementRef.current.value = null;
        }
    };

    return inputElementRef;
};

export default useFileInput;
