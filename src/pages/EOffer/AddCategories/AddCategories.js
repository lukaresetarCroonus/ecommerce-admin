import SearchableListForm from "../../../components/shared/Form/SearchableListForm/SearchableListForm";
import { useMutation, useQuery } from "react-query";
import { toast } from "react-toastify";
import { useEffect, useState } from "react";
import useAPI from "../../../api/api";
import PageWrapper from "../../../components/shared/Layout/PageWrapper/PageWrapper";

const AddCategories = ({ activeTab }) => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    //reset za searchable list formu, jer ima bug :(
    //znam, znam...ne psuj. nije to sto ja volim, nego sto moram.
    const [reset, setReset] = useState(true);

    const api = useAPI();
    //LIST za moguce kategorije koje se mogu dodati u e-ponudu
    const { data: optCategories } = useQuery(
        ["export-eponuda-opt-categories", activeTab],
        async () => {
            return await api
                .list("admin/export-eponuda/add-categories/list")
                .then((res) => res?.payload)
                ?.catch((err) => console.log(err));
        },
        { refetchOnWindowFocus: false }
    );

    //POST za dodavanje kategorija u e-ponudu
    const {
        mutate: addCategories,
        isLoading: isAddingCategories,
        isSuccess,
    } = useMutation(
        ["export-eponuda-add-categories", activeTab],
        async (data) => {
            return await api
                .post("admin/export-eponuda/add-categories", { id_categories: data })
                .then((res) => {
                    setReset(false);
                    setSelectedCategories([]);
                    toast.success(`Uspešno dodate kategorije u e-ponudu!`);
                    return res?.payload;
                })
                .catch((err) => {
                    toast.error(`Došlo je do greške prilikom dodavanja kategorija u e-ponudu!`);
                    console.log(err);
                });
        },
        {}
    );

    useEffect(() => {
        setReset(true);
    }, [isSuccess]);

    return (
        <PageWrapper title={`Dostupne kategorije za dodavanje u e-ponudu`}>
            {reset && (
                <SearchableListForm
                    available={optCategories?.items ?? []}
                    selected={selectedCategories}
                    onSubmit={addCategories}
                    isLoading={isAddingCategories}
                    onChange={(data) => {
                        setSelectedCategories(data);
                    }}
                />
            )}
        </PageWrapper>
    );
};

export default AddCategories;
