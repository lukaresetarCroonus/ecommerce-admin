import { useEffect, useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { toast } from "react-toastify";

import DeleteDialog from "../Dialogs/DeleteDialog";
import PageWrapper from "../Layout/PageWrapper/PageWrapper";
import Button from "../Button/Button";
import TextBoxSingle from "../TextBoxSingle/TextBoxSingle";

import Icon from "@mui/material/Icon";
import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";

import { deleteByPath, getByPathAndParams, postPutByPathAndData } from "../../../api/services";
import useFetching from "../../../hooks/fetching";
import AuthContext from "../../../store/auth-contex";

import SortableTree, { toggleExpandedForAll } from "@nosferatu500/react-sortable-tree";
import "@nosferatu500/react-sortable-tree/style.css";
// https://github.com/frontend-collective/react-sortable-tree
// https://frontend-collective.github.io/react-sortable-tree/?path=/story/basics--minimal-implementation

import scss from "./TreeView.module.scss";
import { handleExpandedElements } from "./helper";
import Box from "@mui/material/Box";
import Buttons from "../Form/Buttons/Buttons";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";

const TreeView = ({ apiUrl, deleteUrl, title, showDatePicker, modifyItems, additionalButtons = [], showNewButton = false, filters = {}, customActions = {} }) => {
    const [selectedRowData, setSelectedRowData] = useState({});
    const [selectedActionButton, setSelectedActionButton] = useState({});
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const { user } = useContext(AuthContext);
    const [treeData, setTreeData] = useState([]);
    const navigate = useNavigate();
    const { gid } = useParams();

    const [storageName, ,] = useState("categoryProductTreeData_" + gid);

    const defaultHeaders = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${user?.access_token}`,
    };

    const [treeList, isLoadingTreeList, reFetchTreeList, setTreeList] = useFetching(
        getByPathAndParams.bind(null, {
            path: apiUrl + gid,
            headers: defaultHeaders,
        }),
        false
    );

    const [searchString, setSearchString] = useState("");
    const [openTextBox, setOpenTextBox] = useState({ open: false, id: null });
    const [searchFocusIndex, setSearchFocusIndex] = useState(0);
    const [deleteModalData, setDeleteModalData] = useState({});
    const init = {
        id: null,
        id_category_product_groups: gid,
        name: "",
        parent_id: null,
        order: 1,
    };

    const [modalData, setModalData] = useState({});
    const [openDeleteDialog, setOpenDeleteDialog] = useState({ show: false, id: null, mutate: null });
    const [addParent, setAddParent] = useState(init);
    const [addChild, setAddChild] = useState(init);
    const [scrollPositionData, setScrollPositionData] = useState({});

    const handleDeleteModalData = (data) => {
        setDeleteModalData(data);
        return data;
    };

    useEffect(() => {
        if (openDeleteDialog.mutate === 1) {
            setOpenDeleteDialog({ show: false, id: null, mutate: 0 });
        }
    }, [openDeleteDialog.mutate]);

    useEffect(() => {
        const asyncFetch = () => {
            if (treeList) {
                let tempTreeList = treeList;
                let expandedTreeItems = JSON.parse(sessionStorage.getItem(storageName) || "[]");

                if (expandedTreeItems) {
                    let expendIds = getExpendsIds(expandedTreeItems);

                    tempTreeList = setExpendsIds(tempTreeList, expendIds);
                }
                setTreeData(tempTreeList);

                handleExpandedElements(storageName, tempTreeList);
            } else {
                reFetchTreeList();
            }
        };
        asyncFetch();
    }, [isLoadingTreeList, treeList]);

    // Triggered when treeList changes
    useEffect(() => {
        // Setovanje scroll pozicije za prikaz
        setScrollPosition(scrollPositionData);
        // resetovanje scroll podataka
        setScrollPositionData({});
    }, [treeList]);
    
    const handleSearch = (value) => {
        setSearchString(value);
    };

    const handleDeleteButton = (node, action) => {
        
        setSelectedRowData(node);
        defineScrollPositionData();

        // Ukoliko je definisana custom action na delete dugme
        if(action) {
            setSelectedActionButton(action);
        } else {
            // Defualt akcija ukoliko je definisano deleteUrl je da prikaze deleteDialog
            if(deleteUrl) {
                setOpenDeleteDialog({ show: true, id: node?.id, mutate: null });
            }
        }
    };

    const handlerConfirmDeleteDialog = async () => {

        // Provera da li postoji neka custom action za delete
        if (selectedActionButton?.deleteClickHandler) {
            switch (selectedActionButton.deleteClickHandler.type) {
                case "dialog_delete":
                    let dialog_delete_opt = await selectedActionButton.deleteClickHandler.fnc(selectedRowData, deleteModalData);
                    if (dialog_delete_opt) {
                        // Remove from array
                        let tmp = JSON.parse(sessionStorage.getItem(storageName));
                        let newArr = tmp ? removeTreeNode(tmp, dialog_delete_opt.id) : null;
                        sessionStorage.setItem(storageName, JSON.stringify(newArr));

                        await reFetchTreeList();
                        setOpenDeleteDialog(dialog_delete_opt);
                    }
                    break;
                default:
                    selectedActionButton.deleteClickHandler.fnc(selectedRowData);
                    break;
            }
        } else {
            // Default action ukoliko je definisan deleteUrl
            if(deleteUrl) {
                try {
                    const response = await deleteByPath({
                        path: deleteUrl + openDeleteDialog.id,
                        pathVariables: { id: openDeleteDialog.id },
                        headers: defaultHeaders,
                    });
                    // condition response or response.status === 200 for example
                    // TODO: proveriti detaljnije da li je ovo ispravno, nisam testirao
                    if (response) {
                        let tmp = JSON.parse(sessionStorage.getItem(storageName));
                        let newArr = tmp ? removeTreeNode(tmp, openDeleteDialog.id) : null;
                        sessionStorage.setItem(storageName, JSON.stringify(newArr));
                    }
                } catch (error) {
                    console.warn(error);
                    // customize message for example
                    toast.warning("Greška nastala prilikom brisanja.");
                } finally {
                    await reFetchTreeList();
                }
                
                // Zatvaranje deleteDialog
                setOpenDeleteDialog({ show: false, id: null, mutate: 1 });
            }
        }
    };

    const handlerCancelDeleteDialog = () => {
        setSelectedActionButton({});
        setSelectedRowData({});
        setOpenDeleteDialog({ show: false, id: null, mutate: null });
        setScrollPositionData({});
    };

    const handleEditButton = (id) => {
        // TODO: make a dynamic path
        navigate(`/product-categories/category/${gid}/${id}`);
    };

    // Buttons in the page header
    const actions = [...additionalButtons] ?? [];
    if (showNewButton) {
        actions.push({
            label: "Novi unos",
            action: () => navigate("new"),
            variant: "contained",
            icon: "add",
        });
    }

    const renderTreeSkeletons = () => {
        let skeletons = [];
        for (let i = 0; i < 5; i++) {
            skeletons.push(
                <Stack spacing={1} key={i}>
                    <Skeleton variant="text" height={50} width={500} key={i + "main"} />
                    <Skeleton variant="text" height={30} width={250} key={i + 1} />
                    <Skeleton variant="text" height={30} width={250} key={i + 2} />
                </Stack>
            );
        }
        return skeletons;
    };

    const getExpendsIds = (expends, expendIds = []) => {
        expends.map((item) => {
            if (item?.children) {
                if (item.expanded === true) {
                    expendIds.push(item.id);
                    // If parent is not open, then the children can not show up
                    expendIds = getExpendsIds(item.children, expendIds);
                }
            }
        });
        return expendIds;
    };

    const setExpendsIds = (tree, expendIds = []) => {
        tree.map((item) => {
            if (item?.children) {
                if (expendIds.includes(item.id)) {
                    item.expanded = true;
                    // If parent is open, then the children can show up
                    item.children = setExpendsIds(item.children, expendIds);
                }
            }
        });
        return tree;
    };

    const removeTreeNode = (tree, id) => {
        tree.map((item, index) => {
            if (item.id === id) {
                tree.splice(index, 1);
            } else {
                if (item?.children) {
                    item.children = removeTreeNode(item.children, id);
                }
            }
        });
        return tree;
    };

    // Definisanje scroll vrednosti
    const defineScrollPositionData = (position = null) => {
        const element = document.querySelector(".rst__virtualScrollOverride") ?? null;
        switch(position) {
            case 'top':
                setScrollPositionData({
                    "window": parseInt(0),
                    "holder": parseInt(0)
                });
                break;
            case 'bottom':
                setScrollPositionData({
                    "window": parseInt(window.scrollHeight),
                    "holder": parseInt(element?.scrollHeight)
                });
                break;
            default:
                setScrollPositionData({
                    "window": parseInt(window.scrollY),
                    "holder": parseInt(element?.scrollTop)
                });
                break;
        }
    }

    const setScrollPosition = (positions) => {
        
        let window_top = typeof(positions.window) !== "undefined" ? positions.window : 0;

        const element = document.querySelector(".rst__virtualScrollOverride") ?? null;
        let holder_top = typeof(positions.holder) !== "undefined" ? positions.holder : 0;

        setTimeout(() => {
            window.scrollTo({
                top: window_top, 
                behavior: "auto",
            });

            element?.scrollTo({
                top: holder_top, 
                behavior: "auto",
            });
        }, 300);
    };

    const backToCategories = () => {
        navigate(-1);
    };

    const handleChangeTreeData = (treeData) => {
        setTreeData(treeData);
        handleExpandedElements(storageName, treeData);
    };

    const handleParent = (e) => {
        setAddParent({ ...addParent, name: e.target.value, order: treeData.length + 1 });
    };

    const handleChild = (e, id) => {
        setAddChild({ ...addChild, parent_id: id, name: e.target.value });
    };

    const cancelParent = () => {
        setScrollPositionData({});
        setAddParent(init);
    };

    const cancelChild = () => {
        setScrollPositionData({});
        setOpenTextBox({ open: false, id: null });
        setAddChild(init);
    };

    const handleOpenTextBox = (id) => {
        defineScrollPositionData();
        setOpenTextBox({ open: true, id: id });
    };

    // Save child
    const saveChild = (node) => {
        if (addChild.name === "") {
            return;
        }

        let tOrder = 0;
        if (node.children) {
            tOrder = node.children.length;
        }
        addChild.order = tOrder + 1;

        saveData(addChild, "post");
        setOpenTextBox({ open: false, id: null });
        setAddChild({ ...addChild, name: "" });
    };

    //Save parent
    const saveParent = () => {
        if (addParent.name === "") {
            return;
        }
        defineScrollPositionData("bottom");
        saveData(addParent, "post");
        setAddParent({ ...addParent, name: "" });
    };

    // Save data
    const saveData = async (data, method) => {
        try {
            const response = await postPutByPathAndData({
                path: apiUrl,
                headers: defaultHeaders,
                data: data,
                method: method,
            });
            // condition response or response.status === 200 for example
            if (response) {
                // TODO instead of cleaning storage keep the state from storage and compare with existing to expand all childs

                toast.success(`Uspešno ${method === "put" ? "izmenjeni" : "dodati"} podaci`);
            }
        } catch (error) {
            console.warn(error);
            // customize message for example
            toast.warning(`Greška nastala prilikom ${method === "put" ? "izmene" : "dodavanja"} podataka`);
        } finally {
            await reFetchTreeList();
        }
    };

    const getNodeKey = ({ treeIndex }) => treeIndex;

    // Expand/collapse
    const expand = (expanded) => {
        let tempTreeData = toggleExpandedForAll({
            treeData,
            expanded,
        });

        setTreeData(tempTreeData);
        handleExpandedElements(storageName, tempTreeData);
    };

    const expandAll = () => {
        expand(true);
    };

    const collapseAll = () => {
        expand(false);
    };

    const handleDragNode = (node, nextParentNode, treeData) => {
        let tOrder = 0;
        if (nextParentNode) {
            nextParentNode.children.map((item, index) => {
                if (item.id === node.id) {
                    tOrder = index;
                }
            });
        } else {
            treeData.map((item, index) => {
                if (item.id === node.id) {
                    tOrder = index;
                }
            });
        }

        // check documentation for aditional info
        // treeData, node, nextParentNode, prevPath, prevTreeIndex, nextPath, nextTreeIndex
        let updateNode = {
            id: node.id,
            id_category_product_groups: gid,
            name: node.name,
            parent_id: nextParentNode?.id ? nextParentNode?.id : null,
            order: tOrder + 1,
        };

        defineScrollPositionData();
        saveData(updateNode, "put");
    };

    const customSearchMethod = ({ node, searchQuery }) => searchQuery && node.name.toLowerCase().indexOf(searchQuery.toLowerCase()) > -1;

    useEffect(() => {
        if (selectedRowData?.id) {
            if(customActions?.delete?.clickHandler) {
                let dialog_delete_opt = customActions.delete.clickHandler?.fnc(selectedRowData, handleDeleteModalData);
                if (dialog_delete_opt) {
                    setOpenDeleteDialog(dialog_delete_opt);
                }
            }
        }
    }, [selectedRowData]);

    return (
        <>
            <PageWrapper back={true} title={title} actions={actions}>
                {!isLoadingTreeList ? (
                    <>
                        <Box className={scss.buttonsDownUp}>
                            <TextField
                                size="small"
                                variant="outlined"
                                onChange={(event) => {
                                    setSearchString(event.target.value);
                                }}
                                value={searchString}
                                sx={{ marginRight: "1rem", ".MuiInputBase-input": { fontSize: "0.875rem" }, "&.MuiTextField-root": { width: "50%" } }}
                                placeholder="Pretraga po ključnoj reči"
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <SearchIcon sx={{ color: "#b3b3b3" }} />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextBoxSingle
                                name="parent"
                                label="Dodaj novog roditelja"
                                value={addParent.name}
                                onSaveClick={saveParent}
                                onCancelClick={cancelParent}
                                onChange={handleParent}
                                saveIcon="check_circle"
                                cancelIcon="cancel"
                            />

                            <Buttons>
                                <Button
                                    icon={"keyboard_double_arrow_down"}
                                    label="Proširi sve"
                                    onClick={expandAll}
                                    sx={{ mr: "1rem", "&.MuiButtonBase-root": { fontWeight: "normal" }, ".MuiIcon-root": { fontSize: "1.2rem" } }}
                                    variant="contained"
                                />
                                <Button
                                    icon={"keyboard_double_arrow_up"}
                                    label="Skupi sve"
                                    onClick={collapseAll}
                                    sx={{ "&.MuiButtonBase-root": { fontWeight: "normal" }, ".MuiIcon-root": { fontSize: "1.2rem" } }}
                                    variant="contained"
                                />
                            </Buttons>
                        </Box>

                        <div style={{ height: 700, padding: 0 }}>
                            <SortableTree
                                className={scss.sortableTree}
                                searchMethod={customSearchMethod}
                                searchQuery={searchString}
                                treeData={treeData}
                                onChange={(treeData) => handleChangeTreeData(treeData)}
                                searchFocusOffset={searchFocusIndex}
                                isVirtualized={false}
                                searchFinishCallback={(matches) => {
                                    setSearchFocusIndex(matches.length > 0 ? searchFocusIndex % matches.length : 0);
                                }}
                                canDrag={({ node }) => !node.dragDisabled}
                                getNodeKey={({ node }) => node.id}
                                onMoveNode={({ node, nextParentNode, treeData }) => handleDragNode(node, nextParentNode, treeData)}
                                generateNodeProps={({ node, path }) => ({
                                    buttons: [
                                        <div className={scss.wrappEditDeleteAdd}>
                                            <div className={scss.name} style={{ fontSize: "0.875rem", color: "rgba(0, 0, 0, 0.6)" }}>
                                                {node.name}
                                            </div>

                                            <span className={scss.button} onClick={() => handleEditButton(node.id)}>
                                                <Icon className={scss.button}>edit</Icon>
                                            </span>

                                            {(customActions?.delete || deleteUrl) && (
                                                <span className={scss.button} onClick={() => handleDeleteButton(node, customActions?.delete)}>
                                                    <Icon className={scss.button}>delete</Icon>
                                                </span>
                                            )}

                                            {openTextBox.open && openTextBox.id === node.id ? (
                                                <TextBoxSingle
                                                    name="child"
                                                    value={addChild.name}
                                                    onSaveClick={(event) => saveChild(node)}
                                                    onCancelClick={cancelChild}
                                                    onChange={(e) => handleChild(e, node.id)}
                                                    saveIcon="check_circle"
                                                    cancelIcon="cancel"
                                                    width="auto"
                                                    styleFormControl={{ position: "absolute", right: "-65%", fontSize: "0.875rem", top: "0" }}
                                                />
                                            ) : (
                                                <span className={scss.button} onClick={() => handleOpenTextBox(node.id)}>
                                                    <Icon className={scss.button}>add</Icon>
                                                </span>
                                            )}
                                        </div>,
                                    ],
                                })}
                            />
                        </div>
                    </>
                ) : (
                    renderTreeSkeletons()
                )}
            </PageWrapper>
            <DeleteDialog 
                handleConfirm={handlerConfirmDeleteDialog} 
                openDeleteDialog={openDeleteDialog} 
                setOpenDeleteDialog={setOpenDeleteDialog} 
                selectedRowData={selectedRowData} 
                handleCancelToken
                handleCancel={handlerCancelDeleteDialog}
            />
        </>
    );
};

export default TreeView;
