import useAPI from "../api/api";
import { toast } from "react-toastify";

export const useCellSubmit = () => {
    const api = useAPI();
    return (api_path, api_method, payload, setDoesRefetch) => {
        switch (api_method) {
            case "POST":
                return api
                    .post(api_path, {
                        ...payload,
                    })
                    .then((res) => {
                        toast.success(`Uspešno sačuvano!`);
                        setDoesRefetch(true);
                        return res?.payload;
                    })
                    .catch((err) => {
                        console.log(err);
                        toast.error(err?.response?.data?.payload?.message ?? "Došlo je do greške prilikom čuvanja!");
                    });
        }
    };
};
