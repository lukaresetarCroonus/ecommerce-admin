export const useFileSize = (file) => {
    let base64;
    if (file) {
        base64 = file?.base_64;
    }
    let type;
    if (base64) {
        type = base64?.split(";")[0]?.split(":")[1];
    }
    let y;
    if (base64) {
        y = base64[base64?.length - 2] === "=" ? 2 : 1;
    }
    let size;
    if (base64) {
        size = base64?.length * (3 / 4) - y;
    }
    let sizeInMB;
    if (base64) {
        sizeInMB = size / (1024 * 1024);
    }
    return { size: size, sizeInMB: sizeInMB , type: type };
};

export const useImageSize = (file) => {
    let base64 = file?.image;
    const type = base64?.split(";")[0]?.split(":")[1];
    let y = base64[base64?.length - 2] === "=" ? 2 : 1;
    const size = base64?.length * (3 / 4) - y;
    const sizeInMB = size / (1024 * 1024);
    return { size: size, sizeInMB: sizeInMB, type: type };
};
