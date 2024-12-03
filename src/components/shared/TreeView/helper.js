export const deepRemove = (data, id) => {
    return data
        .filter(({ id }) => id !== id)
        .map((e) => {
            return { ...e, children: deepRemove(e.children || [], id) };
        });
};

export const handleExpandedElements = (storageName, treeData) => {
    let expandedElements = treeData;

    if (expandedElements.length) {
        sessionStorage.setItem(storageName, JSON.stringify(expandedElements));
    }
};
