const getImageInfo = (base64String) => {
    return new Promise((resolve, reject) => {
        // Create a new image
        const img = new Image();

        // Extract the base64 string without the prefix (if it exists)
        const base64Data = base64String.split(",")[1];

        // Calculate the file size
        const padding = (base64Data.match(/=+$/) || []).length;
        const fileSize = base64Data.length * (3 / 4) - padding;

        // Set the src to the base64 string
        img.src = base64String;

        // Once the image is loaded, get the dimensions
        img.onload = () => {
            const width = img.width;
            const height = img.height;
            resolve({
                dimensions: { width, height },
                fileSize,
            });
        };

        img.onerror = reject;
    });
};

export const gatherImageInformation = async (image) => {
    if (image.dimensions) {
        return image;
    }
    if (image.src) {
        try {
            const imageInfo = await getImageInfo(image.src);
            return {
                ...image,
                ...imageInfo,
            };
        } catch (error) {
            console.error("Error getting image information:", error);
            return image;
        }
    } else {
        return image;
    }
};
