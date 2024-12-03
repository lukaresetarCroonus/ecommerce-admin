import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import InputMultipleImages from "../../../../../components/shared/InputMultipleImages/InputMultipleImages";
import AuthContext from "../../../../../store/auth-contex";

const VariationGallery = ({ productParentId, productId }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [data, setData] = useState([]);
    const apiPath = "admin/product-items/variants/gallery";

    const handleData = () => {
        api.list(`${apiPath}/${productParentId}/${productId}`)
            .then((response) => setData(response?.payload?.items))
            .catch((error) => console.warn(error));
    };

    const handleSubmit = (data) => {
        let req = {
            id: data.new ? null : data.id,
            id_product_parent: productParentId,
            id_product: productId,
            file_base64: data.src,
            order: data.position ?? 0,
            title: null,
            subtitle: null,
            short_description: null,
            description: null,
        };
        api.post(`${apiPath}`, req)
            .then((response) => {
                toast.success("Uspešno");
                handleData();
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
            });
    };

    const handleDelete = (id) => {
        api.delete(`${apiPath}/${id}`)
            .then((response) => {
                toast.success("Uspešno");
                handleData();
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
            });
    };

    const handleReorder = (id, destination) => {
        api.put(`${apiPath}/order`, { id: id, order: destination })
            .then((response) => {
                toast.success("Uspešno");
            })
            .catch((error) => {
                toast.warn("Greška");
                console.warn(error);
            });
    };

    let list = (data ?? [])
        .filter((item) => item.file_base64 != null)
        .map((item) => {
            let base64 = item.file_base64;
            const type = base64.split(";")[0].split(":")[1];
            let y = base64[base64.length - 2] === "=" ? 2 : 1;
            const size = base64.length * (3 / 4) - y;
            return { id: item.id, name: item.file_filename, position: item.order, alt: item.file_filename, size: size, type: type, src: base64 };
        });

    useEffect(() => {
        handleData();
    }, []);

    return <InputMultipleImages list={list} name="Galerija" onChangeHandler={() => {}} uploadHandler={handleSubmit} deleteHandler={handleDelete} handleReorder={handleReorder} />;
};

export default VariationGallery;
