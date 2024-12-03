import { useMutation, useQuery } from "react-query";
import useAPI from "../../../api/api";
import { useEffect, useState } from "react";
import CampaignTable from "../../B2CLandingPages/B2CLandingPagesDetails/panels/Articles/CampaignTable/CampaignTable";
import { toast } from "react-toastify";
import Button from "../../../components/shared/Button/Button";
import classes from "./styles.module.css";
import PageWrapper from "../../../components/shared/Layout/PageWrapper/PageWrapper";
import CircularProgress from "@mui/material/CircularProgress";
const AddProducts = ({ activeTab }) => {
    const api = useAPI();
    const [data, setData] = useState({
        items: [],
        pagination: {},
    });
    const [options, setOptions] = useState({
        page: null,
        search: "",
        limit: 30,
        filters: [],
    });
    const [selectedValues, setSelectedValues] = useState([]);
    //LIST za moguce proizvode koji se mogu obrisati iz e-ponude
    const {
        data: optProducts,
        isFetching,
        refetch,
    } = useQuery(
        [
            "export-eponuda-opt-remove-available",
            activeTab,
            {
                page: options?.page,
                search: options?.search,
                limit: options?.limit,
            },
        ],
        async () => {
            return await api
                .list("admin/export-eponuda/remove-products/list", {
                    page: options?.page,
                    search: options?.search,
                    limit: options?.limit,
                })
                .then((res) => {
                    setData({
                        items: res?.payload?.items,
                        pagination: res?.payload?.pagination,
                    });
                    return res?.payload;
                })
                ?.catch((err) => console.log(err));
        },
        { refetchOnWindowFocus: false }
    );

    //POST za brisanje proizvoda iz e-ponude
    const { mutate: removeProducts, isLoading } = useMutation(
        ["export-eponuda-remove-products", activeTab],
        async () => {
            return await api
                .post("admin/export-eponuda/remove-products", {
                    id_products: selectedValues?.map((item) => item?.id),
                })
                .then((res) => {
                    toast.success("Proizvodi uspešno obrisani iz e-ponude!");
                    refetch();
                    return res?.payload;
                })
                .catch((err) => {
                    toast.error("Greška pri brisanju proizvoda iz e-ponude!");
                    console.log(err);
                });
        },
        {}
    );

    const [opt, setOpt] = useState({
        format: [
            {
                field: "id",
                headerName: "ID",
                width: 100,
            },
            {
                field: "name",
                headerName: "Naziv",
                width: 150,
            },
            {
                field: "barcode",
                headerName: "Barcode",
                width: 150,
            },
            {
                field: "sku",
                headerName: "Šifra",
                width: 150,
            },
        ],
    });

    //onChange za selektovane vrednosti
    const onChange = (selected) => {
        setSelectedValues(selected);
    };

    //ako je options.filters.length > 0 onda je selected vrednost options.filters[0].value, pa filtriramo po tome
    useEffect(() => {
        if (options?.filters?.length > 0 && selectedValues?.length > 0) {
            const handleFilter = (data) => {
                const items = data?.items;
                const values = options?.filters[0]?.value;

                let new_items = [];
                values?.map((id) => {
                    const item = items?.find((item) => item?.id === id);
                    new_items.push(item);
                });

                setData({ ...data, items: new_items });
            };
            handleFilter(data);
        } else {
            refetch();
        }
    }, [options?.filters]);

    return (
        <PageWrapper title={`Dostupni proizvodi za brisanje iz e-ponude`}>
            <CampaignTable data={data} columns={opt?.format} options={options} setOptions={setOptions} selected={selectedValues} onChange={onChange} inputType={`multi`} isLoadingOpt={isFetching} />
            <div className={classes.button}>
                <Button
                    disabled={isLoading}
                    onClick={() => {
                        removeProducts();
                        setData({
                            items: optProducts?.items,
                            pagination: optProducts?.pagination,
                        });
                    }}
                    label={isLoading ? <CircularProgress size="1.5rem" /> : "Sačuvaj"}
                    variant={`contained`}
                    className={classes.button}
                ></Button>
            </div>
        </PageWrapper>
    );
};

export default AddProducts;
