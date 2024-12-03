import categoryFields from "../forms/rebate-types/categories.json";
import productsFields from "../forms/rebate-types/products.json";
import brandsFields from "../forms/rebate-types/brands.json";
import opt from "../forms/opt.json";
import Box from "@mui/system/Box";
import { InputSelect } from "../../../../components/shared/Form/FormInputs/FormInputs";
import { useEffect, useState } from "react";
import useAPI from "../../../../api/api";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import { useTableCellActions } from "../../../../hooks/useTableCellActions";
import { useCellSubmit } from "../../../../hooks/useCellSubmit";
import { toast } from "react-toastify";
import SelectionModal from "./Conditions/SelectionModal/SelectionModal";
import { useMutation, useQuery } from "react-query";
import Button from "../../../../components/shared/Button/Button";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../../helpers/functions";
import DeleteModal from "../../../../components/shared/Dialogs/DeleteDialog";
import { DeleteModalContent } from "./delete-modal-content";
import ListPageModalWrapper from "../../../../components/shared/Modal/ListPageModalWrapper";
import { CopyModalContent } from "./copy-modal-content";
import Tooltip from "@mui/material/Tooltip";

export const Rebates = ({ companyId }) => {
    const api = useAPI();
    const activeType = getUrlQueryStringParam("type") ?? "products";

    const handleFieldsData = () => {
        switch (activeType) {
            case "products":
                return productsFields;
            case "categories":
                return categoryFields;
            case "brands":
                return brandsFields;
            default:
                return productsFields;
        }
    };

    const [fields, setFields] = useState({
        data: handleFieldsData(),
        id: activeType ?? "products",
        api_url: `admin/customers-b2b/rebate-company/${activeType}/${companyId}`,
    });

    const [doesRefetch, setDoesRefetch] = useState(false);

    const onRebateTypeChange = ({ target: { value } }) => {
        switch (value) {
            case "products":
                setFields({
                    data: productsFields,
                    id: value,
                    api_url: `admin/customers-b2b/rebate-company/${value}/${companyId}`,
                });
                break;
            case "categories":
                setFields({
                    data: categoryFields,
                    id: value,
                    api_url: `admin/customers-b2b/rebate-company/${value}/${companyId}`,
                });
                break;
            case "brands":
                setFields({
                    data: brandsFields,
                    id: value,
                    api_url: `admin/customers-b2b/rebate-company/${value}/${companyId}`,
                });
                break;
        }
    };

    const getTableCellFormData = async ({ cell_data, selected }) => {
        return await api.get(`admin/customers-b2b/rebate-company/${fields?.id}/${selected?.row?.id}`).then((res) => {
            return res?.payload;
        });
    };

    const { customTableCellActions } = useTableCellActions({ clickAction: "edit", click: true, doubleClick: true, doubleClickAction: "none" });

    const submitCell = useCellSubmit();

    const cellValueChange = (value, row, column) => {
        //onchange
    };

    const onCellSubmit = (value, row, setSelected, api_url, api_method) => {
        //submit logika
        let ret = { ...value };
        if (value?.discount_value?.includes("%")) {
            ret.currency = "%";
        } else {
            ret.currency = null;
        }

        submitCell(`admin/customers-b2b/rebate-company/${fields?.id}`, api_method, ret, setDoesRefetch);
        setDoesRefetch(true);
        setSelected({
            row: null,
            column: null,
        });
    };

    const [openDialog, setOpenDialog] = useState({ show: false, type: null });
    const [openModal, setOpenModal] = useState({ show: false, type: null });

    const [options, setOptions] = useState([]);

    const {
        data,
        isFetching: isLoading,
        refetch: refetchSelect,
        isSuccess: isSelectSuccess,
    } = useQuery(
        ["rebatesSelect", options, companyId, fields?.id, doesRefetch, openDialog?.show],
        async () => {
            return await api
                .post(`/admin/customers-b2b/rebate-company/${fields?.id}/select-${fields?.id}/${companyId}`, {
                    page: options?.page ?? 1,
                    search: options?.search ?? "",
                    limit: options?.limit ?? 10,
                    sort: options?.sort ?? {},
                    filters: options?.filters ?? [],
                })
                .then((res) => {
                    let ret = res?.payload;
                    if (activeType === "products") {
                        let nameField = ret.format.find((item) => item.field === "name");
                        nameField.renderCell = (cellValues) => {
                            return <a href={`/${activeType}/${cellValues.row.id}`}>{cellValues.row.name}</a>;
                        };
                    }

                    return ret;
                })
                .catch((err) => toast.error(err?.response?.data?.message ?? err?.response?.data?.payload?.message ?? "Došlo je do greške"));
        },
        { refetchOnWindowFocus: false, keepPreviousData: true }
    );

    const [selectedValues, setSelectedValues] = useState([]);

    const onTableChange = (data) => {
        setSelectedValues(data);
    };

    const { data: message, refetch } = useQuery(
        [companyId],
        async () => {
            return await api
                .get(`admin/customers-b2b/rebate-company/main/allow-use/${companyId}`)
                .then((res) => res?.payload)
                ?.catch((err) => console.warn(err));
        },
        { refetchOnWindowFocus: false }
    );

    const {
        mutate: handleSave,
        isLoading: isPending,
        isSuccess: isSaveSuccess,
    } = useMutation(["rebatesSelectSave", selectedValues], async () => {
        let ret = {};
        switch (fields?.id) {
            case "products":
                ret = {
                    company_id: companyId,
                    product_ids: selectedValues?.map(({ id }) => id),
                };
                break;
            case "categories":
                ret = {
                    company_id: companyId,
                    category_ids: selectedValues?.map(({ id }) => id),
                };
                break;
            case "brands":
                ret = {
                    company_id: companyId,
                    brand_ids: selectedValues?.map(({ id }) => id),
                };
        }
        return await api
            .post(`/admin/customers-b2b/rebate-company/${fields?.id}/save-selected-${fields?.id}`, ret)
            .then((res) => {
                toast.success("Uspešno sačuvano");
                setOpenDialog({ show: false });
                setSelectedValues([]);
                setDoesRefetch(true);
                refetch();
                refetchSelect();
                refetch_allow_clone();
            })
            .catch((err) => {
                toast.error(err?.response?.data?.payload?.message ?? "Došlo je do greške");
                setSelectedValues([]);
            });
    });

    const customActions = {
        edit: {
            type: "custom",
            display: false,
        },
    };

    const navigate = useNavigate();

    const handleRebateTypeSelect = (field) => {
        let queryString = setUrlQueryStringParam("type", fields?.id);
        navigate(`/b2b-companies/${companyId}?${queryString}`, { replace: true });
    };

    useEffect(() => {
        handleRebateTypeSelect(fields?.id);
    }, [fields?.id]);

    const [selectedFormValues, setSelectedFormValues] = useState({
        sections: ["products", "categories", "brands"],
        company: null,
        clone_type: null,
    });

    const { mutate: delete_all, isSuccess } = useMutation({
        mutationKey: [selectedFormValues, "deleteAllRebates"],
        mutationFn: async () => {
            return await api
                .delete(`admin/customers-b2b/rebate-company/main/delete-all/${companyId}?sections=${selectedFormValues?.sections?.map((i) => i)}`, {})
                .then((res) => {
                    toast.success(`Uspešno obrisano!`);
                    setSelectedFormValues({
                        ...selectedFormValues,
                        sections: ["products", "categories", "brands"],
                    });
                    setDoesRefetch(true);
                    refetch();
                    refetchSelect();
                    refetch_allow_clone();
                    setOpenModal({ show: false });
                })
                .catch((err) => {
                    setOpenModal({ show: false });
                    toast.warn("Greška!");
                });
        },
    });

    const onDeleteChange = ({ target: { name, checked } }) => {
        if (checked) {
            setSelectedFormValues({
                ...selectedFormValues,
                sections: [...selectedFormValues?.sections, name],
            });
        } else {
            setSelectedFormValues({
                ...selectedFormValues,
                sections: selectedFormValues?.sections.filter((item) => item !== name),
            });
        }
    };

    const onCopyChange = ({ target: { name, checked } }) => {
        if (checked) {
            setSelectedFormValues({
                ...selectedFormValues,
                sections: [...selectedFormValues?.sections, name],
            });
        } else {
            setSelectedFormValues({
                ...selectedFormValues,
                sections: selectedFormValues?.sections.filter((item) => item !== name),
            });
        }
    };

    const {
        mutate: copy,
        isLoading: isCopying,
        isSuccess: isCopySuccess,
    } = useMutation(["copyContent"], async () => {
        return await api
            .post(`admin/customers-b2b/rebate-company/main/clone-rebates`, {
                company_id: companyId,
                clone_source: "b2b_companies",
                b2b_company: selectedFormValues?.company,
                rebate_tier: null,
                sections: selectedFormValues?.sections?.map((i) => i),
                clone_type: "replace",
            })
            .then((res) => {
                toast.success("Uspešno kopirano");
                setDoesRefetch(true);
                setSelectedFormValues({
                    ...selectedFormValues,
                    sections: ["products", "categories", "brands"],
                });
                setOpenModal({ show: false });
                refetch();
                refetchSelect();
                refetch_allow_clone();
            })
            .catch((err) => toast.error("Došlo je do greške"));
    });

    const { data: allow_clone, refetch: refetch_allow_clone } = useQuery([companyId, "allow-clone-rebates"], async () => {
        return await api
            .get(`admin/customers-b2b/rebate-company/main/clone-rebates-allow-use/${companyId}`)
            .then((res) => res?.payload)
            ?.catch((e) => toast.error("Došlo je do greške"));
    });

    useEffect(() => {
        if (doesRefetch) {
            refetch();
            refetch_allow_clone();
            refetchSelect();
            setDoesRefetch(false);
        }
        if (openDialog?.show) {
            refetchSelect();
        }
    }, [doesRefetch, openDialog?.show]);

    return (
        <>
            {message?.status === false && <p>{message?.message}</p>}

            <Box
                sx={{
                    width: "100%",
                    marginTop: "3rem",
                }}
            >
                <ListPage
                    doesRefetch={doesRefetch}
                    setDoesRefetch={setDoesRefetch}
                    listPageId={`Rebates-${fields?.id}`}
                    customActions={customActions}
                    title={
                        <Box sx={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                            <InputSelect
                                styleFormControl={{
                                    width: "fit-content",
                                }}
                                value={fields?.id}
                                options={opt}
                                label={`Izaberite tip rabata`}
                                onChange={(e) => onRebateTypeChange(e)}
                            />
                            <Box sx={{ display: "flex", alignItems: "center", gap: "1rem" }}>
                                {allow_clone?.status ? (
                                    <Button
                                        sx={{
                                            marginBottom: "-1.7rem",
                                        }}
                                        label={`Preslikaj`}
                                        onClick={() => {
                                            setOpenModal({ show: true, type: "copy" });
                                        }}
                                        variant={`outlined`}
                                    />
                                ) : (
                                    <Button
                                        disabled={true}
                                        sx={{
                                            marginBottom: "-1.7rem",
                                            pointerEvents: "inherit",
                                        }}
                                        label={`Preslikaj`}
                                        tooltip={{
                                            enable: true,
                                            message: allow_clone?.message,
                                        }}
                                        onClick={() => {
                                            setOpenModal({ show: true, type: "copy" });
                                        }}
                                        variant={`outlined`}
                                    />
                                )}
                                <Button
                                    sx={{
                                        marginBottom: "-1.7rem",
                                    }}
                                    label={`Obriši sve`}
                                    variant={`outlined`}
                                    onClick={() => {
                                        setOpenModal({ show: true, type: "delete" });
                                    }}
                                />
                                <Button
                                    sx={{
                                        marginBottom: "-1.7rem",
                                    }}
                                    label={`Novi unos`}
                                    variant={`contained`}
                                    icon={`add`}
                                    onClick={() => setOpenDialog({ show: true })}
                                />
                            </Box>
                        </Box>
                    }
                    columnFields={fields?.data}
                    validateData={(data, field) => {
                        console.log(data, field);
                    }}
                    apiUrl={fields?.api_url}
                    deleteUrl={`admin/customers-b2b/rebate-company/${fields?.id}`}
                    showNewButton={false}
                    tableCellActions={{
                        actions: customTableCellActions,
                        onChange: cellValueChange,
                        onSubmit: onCellSubmit,
                        getTableCellFormData: getTableCellFormData,
                        cell_fields: null,
                    }}
                />
            </Box>

            <SelectionModal
                onChange={onTableChange}
                selectedValues={selectedValues}
                isLoadingOpt={isLoading}
                openDialog={openDialog}
                setOpenDialog={setOpenDialog}
                options={options}
                component={`table`}
                save={{
                    button: true,
                    fnc: handleSave,
                    isPending: isPending,
                }}
                opt={data}
                setOptions={setOptions}
            />

            {openModal?.type === "delete" && (
                <DeleteModal
                    nameOfButton={`Obriši`}
                    nameOfButtonCancel={`Odustani`}
                    title={`Brisanje`}
                    handleConfirm={delete_all}
                    setOpenDeleteDialog={setOpenModal}
                    openDeleteDialog={{ show: openModal.show, children: <DeleteModalContent onChange={onDeleteChange} selected={selectedFormValues?.sections} /> }}
                    description={`Izaberite koje stavke želite da obrišete:`}
                />
            )}

            <ListPageModalWrapper
                anchor="right"
                open={(openModal.show && openModal?.type === "copy") ?? false}
                onClose={() => setOpenModal({ ...openModal, show: false })}
                onCloseButtonClick={() => setOpenModal({ ...openModal, show: false })}
            >
                <CopyModalContent setSelected={setSelectedFormValues} companyId={companyId} selected={selectedFormValues} onChange={onCopyChange} mutate={copy} isPending={isCopying} />
            </ListPageModalWrapper>
        </>
    );
};
