import { useState, useEffect } from "react";

export const useImageFileType = (initialFileType) => {
    const [fileType, setFileType] = useState(initialFileType);
    const [sizeInMB, setSizeInMB] = useState(0);

    const getFileType = (value) => {
        if (value !== "DELETE" && value !== "" && value !== null && value !== undefined) {
            const base64Arr = (value ?? "").split(",");
            const fileType = base64Arr[0]?.match(/:(.*?);/)?.[1]?.split("/")?.[0] ?? "image";
            setFileType(fileType);
            const size = (base64Arr[1]?.length * (3 / 4) - 2) / 1000 / 1000;
            setSizeInMB(size);
        } else {
            setFileType("image");
        }
    };


    useEffect(() => {
        getFileType(initialFileType);
    }, [initialFileType]);

    return { fileType, sizeInMB };
};
