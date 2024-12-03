import { useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { toast } from "react-toastify";
import ListTable from "../ListTable/ListTable";
import ListTableToolbar from "../ListTable/ListTableToolbar";
import DeleteDialog from "../Dialogs/DeleteDialog";
import PageWrapper from "../Layout/PageWrapper/PageWrapper";
import { flatten } from "lodash";
import { useQuery } from "react-query";
import ModalForm from "../Modal/ModalForm";
import ButtonRef from "../Button/ButtonRef";
import CustomTooltipRef from "../CustomTooltipRef/CustomTooltipRef";
import AuthContext from "../../../store/auth-contex";
import { queryKeys } from "../../../helpers/const";
import { connectTemplateFields } from "../../../helpers/urlTemplate";

/**
 * Show a standardized list.
 *
 * @param {string} apiUrl
 * @param {?string} deleteUrl
 * @param {?string} editUrl
 * @param {string} title
 * @param {FieldSpec[]} columnFields
 * @param {FieldSpec[]} filters
 * @param {[]} additionalButtons
 * @param {boolean} showDatePicker
 * @param {boolean} showNewButton
 * @param {function(*[]): []} modifyItems The function that accepts the items and return modified ones.
 * @param {Object} filters Additional filters for list api
 * @param {string default:"id"} error Column value that is sent to preview page
 * @param {Object{type: {handler:function, icon: ""}}} customActions
 * @param {boolean} showAddButtonTableRow Add a button "add row" to the table (if needed in the future).
 * @param {string} tooltipAddButtonTableRow Add title to tooltip (if needed in the future).
 * @param {string} addFieldLabel Name of the button.
 * @param {boolean} showAddButton By default, the button is hidden. If we pass true, button will be shown below the table.
 *
 *
 * @constructor
 */
const ListPage = ({
    apiUrl,
    tableCellActions,
    deleteUrl,
    isArray,
    accept,
    editUrl,
    editUrlQueryString = [],
    title,
    columnFields,
    showDatePicker,
    modifyItems,
    additionalButtons = [],
    showNewButton = true,
    actionNewButton,
    filters = {},
    filterFields,
    previewColumn = "id",
    customActions = {},
    showAddButtonTableRow,
    tooltipAddButtonTableRow,
    addFieldLabel = "",
    showAddButton = false,
    initialData = {},
    modalFormChildren,
    deleteNewButton,
    deleteModalChildren,
    listPageId,
    validateData,
    onNewButtonPress = () => {},
    prepareInitialData,
    withoutSetterFunction,
    submitButtonForm,
    clearButton,
    closeButtonModalForm,
    customTitleModalForm,
    cancelButton,
    modalObject,
    customTitleDataNameForEditModal,
    selectableCountryTown,
    useColumnFields = false,
    useModalGalleryInjection = false,
    savePrapareDataHandler = null,
    onModalCancel = () => {},
    onClickFieldBehavior,
    customFields = null,
    customNewButtonPath,
    onFilePicked,
    handleRemoveFile,
    selectedFile,
    openModalGlobal = {},
    onDismissModal = () => {},
    listData = false,
    labelSaveButton,
    dataFromServer,
    apiPathCrop,
    setPropName,
    doesRefetch = false,
    setDoesRefetch = () => {},
    defaultSort = [],
    isModalUploading = false,
    back,
}) => {
    // // TODO Sorting is disabled as it does not work with pagination
    // columnFields = useMemo(() => {
    //     return columnFields.map((field) => ({ ...field, sortable: false }));
    // }, [columnFields]);

    const showAddButtonRef = useRef(null);

    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const navigate = useNavigate();
    const location = useLocation();
    const { pathname, search: locationSearch } = location;
    const queryParams = new URLSearchParams(locationSearch);

    const currPage = queryParams.get(queryKeys.page);
    const currSearch = queryParams.get(queryKeys.search);
    const currSort = queryParams.get("sort");

    const convertToSortArray = (sort) => {
        const pairs = (sort || "::").split("::");

        const res = pairs?.map((pair) => {
            const [field, direction] = (pair || ":")?.split(":");
            return { field, direction };
        });

        if (res?.every((x) => x?.field !== "" && x?.direction !== "")) {
            return res;
        }
    };

    const [fieldsColumns, setFieldsColumns] = useState(columnFields);

    useEffect(() => {
        setFieldsColumns(columnFields);
    }, [columnFields]);

    const [search, setSearch] = useState(currSearch ? currSearch : "");
    // const [page, setPage] = useState(1);
    const [page, setPage] = useState(currPage ? currPage : 1);
    const [sort, setSort] = useState(convertToSortArray(currSort) ?? defaultSort);
    const [deleteModalData, setDeleteModalData] = useState({});

    const [openModal, setOpenModal] = useState({ show: false, id: null });
    // Default delete URL is the same as the main URL
    deleteUrl = deleteUrl ?? apiUrl;

    editUrl = editUrl ?? apiUrl;

    // Handle delete dialog
    const [openDeleteDialog, setOpenDeleteDialog] = useState({ show: false, id: null, mutate: null });

    const [selectedRowData, setSelectedRowData] = useState({});
    const [selectedActionsButton, setSelectedActionsButton] = useState({});

    // Load the data
    const {
        data: response,
        isLoading,
        isError,
    } = useQuery(["openDeleteDialog.mutate", openDeleteDialog.mutate, search, page, sort, openModal.show, doesRefetch, apiUrl], () => api.list(apiUrl, { page, search, sort, ...filters }));
    // Modify the data
    if (response?.payload && modifyItems) {
        response.payload.items = modifyItems(response.payload.items);
    }
    useEffect(() => {
        if (openDeleteDialog.mutate === 1) {
            setOpenDeleteDialog({ show: false, id: null, mutate: 0 });
        }
    }, [openDeleteDialog.mutate]);

    useEffect(() => {
        if (isError) {
            toast.warning("Greška");
        }
    }, [isError]);

    // Update the search term and reset to the first page
    const handleSearch = (value) => {
        // TODO This always triggers two request as we are changing two states in a row
        setPage(1);
        setSearch(value);
    };

    const handleDeleteModalData = (data) => {
        setDeleteModalData(data);

        return data;
    };
    const handleOnClickActions =
        (id, type, rowData, inputOpts = {}) =>
        () => {
            setSelectedRowData(rowData);
            setSelectedActionsButton(inputOpts);
            if (inputOpts?.clickHandler) {
                switch (inputOpts.clickHandler.type) {
                    case "navigate":
                        let navigate_path = inputOpts.clickHandler.fnc(rowData);
                        if (navigate_path) {
                            navigate(navigate_path);
                        }
                        break;
                    case "dialog_delete":
                        let dialog_delete_opt = inputOpts.clickHandler.fnc(rowData, handleDeleteModalData);
                        if (dialog_delete_opt) {
                            setOpenDeleteDialog(dialog_delete_opt);
                        }
                        break;
                    case "modal_form":
                        let modal_form_opt = inputOpts.clickHandler.fnc(rowData);
                        if (modal_form_opt) {
                            setOpenModal(modal_form_opt);
                        }
                        break;
                    default:
                        inputOpts.clickHandler.fnc(rowData);
                        break;
                }
            } else {
                switch (type) {
                    case "edit":
                        if (actionNewButton === "modal") {
                            setOpenModal({ show: true, id: id });
                        } else {
                            navigate(`${pathname}/${id}`);
                        }
                        break;
                    case "preview":
                        navigate(`${pathname}/${id}`);
                        break;
                    case "delete":
                        if (deleteNewButton === "modal") {
                            setOpenModal({ show: true, id: id });
                        } else {
                            setOpenDeleteDialog({ show: true, id: id, mutate: null });
                        }
                        break;
                }
            }
        };

    const handleDeleteConfirm = async () => {
        if (selectedActionsButton?.deleteClickHandler) {
            switch (selectedActionsButton.deleteClickHandler.type) {
                case "navigate":
                    let navigate_path = selectedActionsButton.deleteClickHandler.fnc(selectedRowData);
                    if (navigate_path) {
                        navigate(navigate_path);
                    }
                    break;
                case "dialog_delete":
                    let dialog_delete_opt = selectedActionsButton.deleteClickHandler.fnc(selectedRowData, deleteModalData);
                    if (dialog_delete_opt) {
                        setOpenDeleteDialog(dialog_delete_opt);
                    }
                    break;
                case "modal_form":
                    let modal_form_opt = selectedActionsButton.deleteClickHandler.fnc(selectedRowData);
                    if (modal_form_opt) {
                        setOpenModal(modal_form_opt);
                    }
                    break;
                default:
                    selectedActionsButton.deleteClickHandler.fnc(selectedRowData);
                    break;
            }
        } else {
            api.delete(`${deleteUrl}/${openDeleteDialog.id}`)
                .then(() => {
                    setDoesRefetch(!doesRefetch);

                    toast.success("Zapis je uspešno obrisan");
                })
                .catch((err) => toast.warning(err?.response?.data?.message ?? err?.response?.data?.payload?.message ?? "Došlo je do greške prilikom brisanja"));

            setOpenDeleteDialog({ show: false, id: null, mutate: 1 });
        }
    };

    // Buttons in the page header
    const actions = [...additionalButtons] ?? [];
    if (showNewButton) {
        actions.push({
            label: "Novi unos",
            action: () => {
                if (actionNewButton === "modal") {
                    onNewButtonPress();
                    setOpenModal({ show: true, id: "new" });
                } else if (customNewButtonPath) {
                    navigate(customNewButtonPath);
                } else {
                    navigate("new");
                }
            },
            variant: "contained",
            icon: "add",
        });
    }

    useEffect(() => {
        const handleKeyDown = (event) => {
            const keyCode = event.keyCode;
            const shiftPress = event.shiftKey ? event.shiftKey : keyCode === 16 ? true : false;
            const ctrlPress = event.ctrlKey ? event.ctrlKey : keyCode === 17 ? true : false;

            // shift + space => open model from right side
            // 32 => "Space"
            if (showAddButton && shiftPress && keyCode === 32) {
                setOpenModal({ show: true, id: "new" });
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    /**
     * form fileds for modal
     * returns array of fields (in_details)
     * based on data from ListPage!
     */

    // When useColumnFields is set to true, the component will use the value of the columnFields prop to define the table columns. This means that the column fields will be taken directly from the columnFields prop. This is useful if you want full control over the column definitions and want to manually configure how the data will be displayed in the table.
    // When useColumnFields is set to false (or not defined), the component will use fieldsColumns to define the table columns. This approach allows for dynamic changes to the table columns during runtime. This is useful when you want users to have the ability to choose which columns they want to see in the table or when you want to update columns based on some dynamic behavior or settings.
    const getFormFieldsForModal = () => {
        if (customFields) {
            return customFields.filter((field) => field.in_details);
        } else {
            if (useColumnFields) {
                return flatten(columnFields).filter((field) => field.in_details);
            } else {
                return flatten(fieldsColumns).filter((field) => field.in_details);
            }
        }
    };

    const replaceQuery = useCallback(
        (newQuery) => {
            // Create a new instance of URLSearchParams using the current location's search parameters.
            if (!newQuery[queryKeys.search]) {
                if (queryParams.has(queryKeys.search)) {
                    queryParams.delete(queryKeys.search);
                }
            }
            // Loop through the keys in the newQuery object.
            for (const key in newQuery) {
                // For each key in newQuery, set the corresponding value in URLSearchParams.
                queryParams.set(key, newQuery[key]);
            }

            // Combine the updated query parameters into a string and navigate to the updated URL.
            navigate(`${pathname}?${queryParams.toString()}`);
        },
        [navigate, pathname, locationSearch]
    );

    const onPageChange = (num) => {
        const newQuery = { [queryKeys.page]: num };
        replaceQuery(newQuery);
        setPage(num);
    };

    useEffect(() => {
        let newQuery = {};

        if (search !== "") {
            newQuery = { [queryKeys.page]: page, [queryKeys.search]: search };
        } else {
            newQuery = { [queryKeys.page]: page };
        }
        replaceQuery(newQuery);
    }, [search, page]);

    return (
        <>
            <PageWrapper title={title} actions={actions} back={back}>
                <ListTableToolbar
                    searchValue={search}
                    listPageId={listPageId}
                    onColumnsChange={setFieldsColumns}
                    fields={fieldsColumns}
                    filters={filters}
                    filterFields={filterFields}
                    onSearch={handleSearch}
                    showDatePicker={showDatePicker}
                />
                <ListTable
                    setSort={setSort}
                    sort={sort}
                    fields={flatten(fieldsColumns).filter((field) => field.in_main_table)}
                    listData={listData ? listData : response?.payload}
                    handleOnClickActions={handleOnClickActions}
                    isLoading={isLoading}
                    tableCellActions={tableCellActions}
                    page={page}
                    onPageChange={onPageChange}
                    previewColumn={previewColumn}
                    showAddButtonTableRow={showAddButtonTableRow}
                    tooltipAddButtonTableRow={tooltipAddButtonTableRow}
                    customActions={customActions}
                    onClickFieldBehavior={(event, fieldBhavior, column, row) => {
                        if (fieldBhavior?.action === "open_modal") {
                            const { prop_name } = column;
                            let key = prop_name + "_options";
                            let obj = row[key];
                            const { id, urls } = obj;
                            setOpenModal({ show: true, id: id ? id : "new", modalUrl: urls });
                            let galleryData = { urls, row };
                            onClickFieldBehavior(event, fieldBhavior, column, row, galleryData);
                        } else if (fieldBhavior?.action === "page") {
                            const { result } = connectTemplateFields(fieldBhavior.url, row);
                            navigate(result);
                            onClickFieldBehavior(event, fieldBhavior, column, row, null);
                        } else {
                            onClickFieldBehavior(event, fieldBhavior, column, row, null);
                        }
                    }}
                />

                {showAddButton && (
                    <CustomTooltipRef title="Prečica: SHIFT + SPACE" placement="top" arrow>
                        <ButtonRef
                            ref={showAddButtonRef}
                            onClick={() => {
                                onNewButtonPress();
                                setOpenModal({ show: true, id: "new" });
                            }}
                            label={addFieldLabel}
                            icon="add"
                            sx={{ display: "flex", margin: "0 auto", marginTop: "2rem", textTransform: "inherit" }}
                        />
                    </CustomTooltipRef>
                )}
            </PageWrapper>

            <ModalForm
                onDismissModal={() => {
                    onDismissModal();
                }}
                cancelButton={cancelButton}
                validateData={validateData}
                children={modalFormChildren}
                selectedRowData={selectedRowData}
                anchor="right"
                openModal={openModalGlobal?.id !== undefined ? openModalGlobal : openModal}
                setOpenModal={(modalObj) => {
                    onModalCancel();
                    setOpenModal(modalObj);
                }}
                apiPathFormModal={editUrl}
                queryString={editUrlQueryString}
                formFields={getFormFieldsForModal()}
                initialData={initialData}
                sx={{ padding: "2rem" }}
                prepareInitialData={prepareInitialData}
                withoutSetterFunction={withoutSetterFunction}
                submitButton={submitButtonForm}
                clearButton={clearButton}
                closeButtonModalForm={closeButtonModalForm}
                customTitle={customTitleModalForm}
                modalObject={modalObject}
                customTitleDataNameForEdit={customTitleDataNameForEditModal}
                selectableCountryTown={selectableCountryTown}
                useModalGalleryInjection={useModalGalleryInjection}
                savePrapareDataHandler={savePrapareDataHandler}
                onFilePicked={onFilePicked}
                handleRemoveFile={handleRemoveFile}
                selectedFile={selectedFile}
                label={labelSaveButton}
                dataFromServer={dataFromServer}
                isArray={isArray}
                allowedFileTypes={
                    accept ??
                    columnFields
                        ?.filter((field) => field?.ui_prop?.fileUpload?.allow_format)
                        ?.map((field) => field?.ui_prop?.fileUpload?.allow_format)
                        ?.flat()
                }
                apiPathCrop={apiPathCrop}
                setPropName={setPropName}
                setDoesRefetch={setDoesRefetch}
                doesRefetch={doesRefetch}
                isUploading={isModalUploading}
            />
            <DeleteDialog
                children={deleteModalChildren}
                selectedRowData={selectedRowData}
                handleConfirm={handleDeleteConfirm}
                openDeleteDialog={openDeleteDialog}
                setOpenDeleteDialog={setOpenDeleteDialog}
            />
        </>
    );
};

export default ListPage;
