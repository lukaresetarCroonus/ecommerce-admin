import { useEffect, useState } from "react";

export const reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    const repack = { ...removed, position: endIndex };
    result.splice(endIndex, 0, repack);

    return result;
};

export const getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    padding: "0.2rem",
    height: "auto",
    // change background colour if dragging
    background: isDragging ? "lightgreen" : "#f8fafc",
    borderRadius: "0.25rem",
    // border: "1px solid rgba(0, 0, 0, 0.12)",
    // styles we need to apply on draggables
    ...draggableStyle,
});

export const getListStyle = (isDraggingOver) => {
    const [gridTemplateColumns, setGridTemplateColumns] = useState("repeat(5, 1fr)");

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth <= 768) {
                setGridTemplateColumns("1fr");
            } else if (window.innerWidth <= 1280) {
                setGridTemplateColumns("repeat(2, 1fr)");
            } else if (window.innerWidth <= 1536) {
                setGridTemplateColumns("repeat(4, 1fr)");
            } else {
                setGridTemplateColumns("repeat(5, 1fr)");
            }
        };

        window.addEventListener("resize", handleResize);

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return {
        // ostali stilovi
        width: "100%",
        display: "grid",
        gridTemplateColumns: gridTemplateColumns,
        gap: "1rem",
        overflow: "hidden",
    };
};
