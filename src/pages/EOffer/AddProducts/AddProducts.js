import { useMutation, useQuery } from "react-query";
import useAPI from "../../../api/api";
import { useState, useEffect } from "react";
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
    //LIST za moguce proizvode koji se mogu dodati u e-ponudu
    const {
        data: optProducts,
        isFetching,
        refetch,
    } = useQuery(
        [
            "export-eponuda-opt",
            activeTab,
            {
                page: options?.page,
                search: options?.search,
                limit: options?.limit,
            },
        ],
        async () => {
            return await api
                .list("admin/export-eponuda/add-products/list", {
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

    //POST za dodavanje proizvoda u e-ponudu
    const { mutate: addProducts, isLoading } = useMutation(
        ["export-eponuda-add-products", activeTab],
        async () => {
            return await api
                .post("admin/export-eponuda/add-products", {
                    id_products: selectedValues?.map((item) => item?.id),
                })
                .then((res) => {
                    toast.success("Proizvodi uspešno dodati u e-ponudu!");
                    refetch();
                    return res?.payload;
                })
                .catch((err) => {
                    toast.error("Greška pri dodavanju proizvoda u e-ponudu!");
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
                width: 450,
            },
            {
                field: "barcode",
                headerName: "Barcode",
                width: 250,
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
        <PageWrapper title={`Dostupni proizvodi za dodavanje u e-ponudu`}>
            <CampaignTable data={data} columns={opt?.format} options={options} setOptions={setOptions} selected={selectedValues} onChange={onChange} inputType={`multi`} isLoadingOpt={isFetching} />
            <div className={classes.button}>
                <Button disabled={isLoading} onClick={() => addProducts()} label={isLoading ? <CircularProgress size="1.5rem" /> : "Sačuvaj"} variant={`contained`} className={classes.button}>
                    Dodaj proizvode
                </Button>
            </div>
        </PageWrapper>
    );
};

export default AddProducts;
