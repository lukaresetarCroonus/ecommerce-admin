// check if it is a valid url
// only data 64 could be sent as image
const isValidHttpUrl = (string) => {
    let url;
    try {
        url = new URL(string);
    } catch (err) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
};

// reapck data to send to backend
export const repackToSend = (newItem, fields) => {
    Object.keys(newItem).forEach((propName) => {
        if (propName === "favicon" || propName === "logo" || propName === "missing" || propName === "image") {
            newItem[propName] = isValidHttpUrl(newItem[propName]) ? "IGNORE" : newItem[propName];
        }
    });
    return newItem;
};

export const isUrlValid = (url) => {
    let res = url.match(/(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/g);
    if (res == null) return false;
    else return true;
};
