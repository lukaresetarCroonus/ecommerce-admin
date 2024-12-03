import { useEffect, useState } from "react";
import SearchableListForm from "../../../components/shared/Form/SearchableListForm/SearchableListForm";
import { useQuery, useMutation } from "react-query";
import useAPI from "../../../api/api";
import { toast } from "react-toastify";
import PageWrapper from "../../../components/shared/Layout/PageWrapper/PageWrapper";

const RemoveCategories = ({ activeTab }) => {
    const [selectedRemoveCategories, setSelectedRemoveCategories] = useState([]);

    //reset za searchable list formu, jer ima bug :(
    //znam, znam...ne psuj. nije to sto ja volim, nego sto moram.
    const [reset, setReset] = useState(true);

    const api = useAPI();
    //LIST za moguce brisanje kategorija iz e-ponude
    const { data: optRemoveCategories } = useQuery(
        ["export-eponuda-opt-remove-categories", activeTab],
        async () => {
            return await api
                .list("admin/export-eponuda/remove-categories/list")
                .then((res) => res?.payload)
                ?.catch((err) => console.log(err));
        },
        { refetchOnWindowFocus: false }
    );

    //POST za brisanje kategorija iz e-ponude
    const {
        mutate: removeCategories,
        isLoading: isRemovingCategories,
        isSuccess,
    } = useMutation(
        ["export-eponuda-remove-categories", activeTab],
        async (data) => {
            return await api
                .post("admin/export-eponuda/remove-categories", { id_categories: data })
                .then((res) => {
                    setReset(false);
                    setSelectedRemoveCategories([]);
                    toast.success(`Uspešno obrisane kategorije iz e-ponude!`);
                    return res?.payload;
                })
                .catch((err) => {
                    toast.error(`Došlo je do greške prilikom brisanja kategorija iz e-ponude!`);
                    console.log(err);
                });
        },
        {}
    );

    useEffect(() => {
        setReset(true);
    }, [isSuccess]);

    return (
        <PageWrapper title={`Dostupne kategorije za brisanje iz e-ponude`}>
            {reset && (
                <SearchableListForm
                    available={optRemoveCategories?.items ?? []}
                    selected={selectedRemoveCategories}
                    onSubmit={removeCategories}
                    isLoading={isRemovingCategories}
                    onChange={(data) => {
                        setSelectedRemoveCategories(data);
                    }}
                />
            )}
        </PageWrapper>
    );
};

export default RemoveCategories;
