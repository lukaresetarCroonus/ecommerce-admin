import React, { useRef, useState } from "react";

import ImageList from "@mui/material/ImageList";
import ImageListItem from "@mui/material/ImageListItem";
import IconButton from "@mui/material/IconButton";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import Stack from "@mui/material/Stack";
import Icon from "@mui/material/Icon";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { reorder, getItemStyle, getListStyle } from "./util";
import IconList from "../../../../helpers/icons";
import Box from "@mui/system/Box";
import Typography from "@mui/material/Typography";
import Tooltip from "@mui/material/Tooltip";
import { CopyToClipboard } from "react-copy-to-clipboard";
import DownloadIcon from "@mui/icons-material/Download";

// https://github.com/atlassian/react-beautiful-dnd

const ImageListRow = ({ imageList = [], setImageList, handleModalOpen = () => {}, handleDeleteImage = () => {}, handleReorder = () => {} }) => {
    const [bttnText, setBttnText] = useState("Kopirajte link");
    const myButtonCopyRef = useRef(null);
    const onDragEnd = ({ destination, source }) => {
        // dropped outside the list
        if (!destination) return;
        const newItems = reorder(imageList, source.index, destination.index);
        setImageList(newItems);
        handleReorder(imageList[source.index].id, destination.index + 1);
    };

    return (
        <>
            <DragDropContext onDragEnd={onDragEnd}>
                <Droppable droppableId="droppable" direction="horizontal">
                    {(provided, snapshot) => (
                        <ImageList ref={provided.innerRef} style={getListStyle(snapshot.isDraggingOver)} {...provided.droppableProps}>
                            {imageList.map((item, index) => {
                                return (
                                    <Draggable key={item.id} draggableId={item.id + "drag"} index={index}>
                                        {(provided, snapshot) => (
                                            <Box sx={{ position: "relative" }}>
                                                <ImageListItem
                                                    key={item.image}
                                                    ref={provided.innerRef}
                                                    {...provided.draggableProps}
                                                    {...provided.dragHandleProps}
                                                    style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}

                                                    // TODO moze i ovako da se podesava stil na drag slika/elemenata
                                                    // className={snapshot.isDragging ? "class1" : "class2"}
                                                >
                                                    {item.src.includes("image") || item?.src?.includes("video") ? (
                                                        item?.src?.includes("image") ? (
                                                            <img
                                                                key={item.src}
                                                                src={item?.src}
                                                                srcSet={item?.src}
                                                                alt={item?.name}
                                                                loading="lazy"
                                                                style={{
                                                                    height: "10rem",
                                                                    maxWidth: "9rem",
                                                                    margin: "auto",
                                                                }}
                                                                onClick={(e) =>
                                                                    handleModalOpen(
                                                                        e,
                                                                        item.src,
                                                                        item.alt,
                                                                        item.name,
                                                                        item.size,
                                                                        item.type,
                                                                        item.id,
                                                                        item.position,
                                                                        item.path,
                                                                        item.dimensions,
                                                                        item.id_product
                                                                    )
                                                                }
                                                            />
                                                        ) : (
                                                            <video
                                                                key={item.src}
                                                                src={item?.src}
                                                                autoPlay={true}
                                                                style={{
                                                                    height: "10rem",
                                                                    maxWidth: "9rem",
                                                                    margin: "auto",
                                                                }}
                                                                onClick={(e) =>
                                                                    handleModalOpen(
                                                                        e,
                                                                        item.src,
                                                                        item.alt,
                                                                        item.name,
                                                                        item.size,
                                                                        item.type,
                                                                        item.id,
                                                                        item.position,
                                                                        item.path,
                                                                        item.dimensions,
                                                                        item.id_product
                                                                    )
                                                                }
                                                            >
                                                                <source src={item?.src} type="video/mp4" />
                                                            </video>
                                                        )
                                                    ) : (
                                                        <Box
                                                            key={item.src}
                                                            style={{
                                                                height: "10rem",
                                                                background: "white",
                                                                display: "flex",
                                                                alignItems: "center",
                                                                justifyContent: "center",
                                                            }}
                                                            onClick={(e) => handleModalOpen(e, item)}
                                                        >
                                                            {item.thumb_image ? <img src={item.thumb_image} width="100%" height="100%" /> : <Icon fontSize="large">{IconList.editDocument}</Icon>}
                                                        </Box>
                                                    )}
                                                </ImageListItem>
                                                <Stack sx={{ background: "rgba(0, 0 , 0,0.4)", borderRadius: "0 0 0.25rem 0.25rem", position: "absolute", bottom: 0, width: "100%" }}>
                                                    <Typography
                                                        variant="subtitle2"
                                                        noWrap
                                                        style={{ cursor: "pointer", color: "#ffff", fontSize: "0.75rem", padding: "0.3rem 0 0 0.3rem" }}
                                                        onClick={(e) =>
                                                            handleModalOpen(e, item.src, item.alt, item.name, item.size, item.type, item.id, item.position, item.path, item.dimensions, item.id_product)
                                                        }
                                                    >
                                                        Naziv: {item?.name}
                                                    </Typography>

                                                    <Typography
                                                        variant="subtitle2"
                                                        noWrap
                                                        style={{ cursor: "pointer", color: "#ffff", fontSize: "0.625rem", padding: "0 0 0 0.3rem" }}
                                                        onClick={(e) =>
                                                            handleModalOpen(e, item.src, item.alt, item.name, item.size, item.type, item.id, item.position, item.path, item.dimensions, item.id_product)
                                                        }
                                                    >
                                                        Veličina: {Math.round((item?.size / 1024 / 1024) * 1000) / 1000} MB
                                                    </Typography>

                                                    <Box sx={{ display: "flex" }}>
                                                        <IconButton sx={{ color: "#ffff" }}>
                                                            <CopyToClipboard
                                                                text={item?.path}
                                                                onCopy={() => {
                                                                    setBttnText("Link je kopiran");
                                                                    setTimeout(() => {
                                                                        setBttnText("Kopirajte link");
                                                                    }, 3000);
                                                                }}
                                                            >
                                                                <Tooltip title={bttnText} placement="bottom" arrow>
                                                                    <ContentCopyIcon sx={{ fontSize: "1.35rem" }} />
                                                                </Tooltip>
                                                            </CopyToClipboard>
                                                        </IconButton>

                                                        <IconButton sx={{ color: "#ffff" }}>
                                                            <Tooltip title={"Preuzmite sliku"} placement="bottom" arrow>
                                                                <DownloadIcon
                                                                    onClick={() => {
                                                                        const image = item?.path;
                                                                        window.open(`${image}`, "_blank");
                                                                    }}
                                                                />
                                                            </Tooltip>
                                                        </IconButton>

                                                        <IconButton
                                                            sx={{ color: "#ffff", marginLeft: "auto" }}
                                                            aria-label={`delete ${item.name}`}
                                                            onClick={(e) => handleDeleteImage(e, item.id, item.new, item)}
                                                        >
                                                            <DeleteOutlineIcon />
                                                        </IconButton>
                                                    </Box>
                                                </Stack>
                                            </Box>
                                        )}
                                    </Draggable>
                                );
                            })}
                            {provided.placeholder}
                        </ImageList>
                    )}
                </Droppable>
            </DragDropContext>
        </>
    );
};

export default ImageListRow;
