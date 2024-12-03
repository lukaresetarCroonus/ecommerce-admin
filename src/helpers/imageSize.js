export const getImageRatio = (url) => {
  return new Promise((resolve) => {
    const img = new Image();
    img.src = url;
    img.onload = async () => {
      await resolve({ width: img.width, height: img.height });
    };
  });
};
