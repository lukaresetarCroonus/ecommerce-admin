import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchableListForm from "../../../../components/shared/Form/SearchableListForm/SearchableListForm";
import Loading from "../../../../components/shared/Loading/Loading";
import AuthContext from "../../../../store/auth-contex";

const DetailsSpecification = ({ gid, cid }) => {
  const [listData, setListData] = useState([]);

  const [isLoading, setIsLoading] = useState([]);

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const apiPath = "admin/category-product/specifications";

  const handleList = () => {
    setIsLoading(true);
    api.get(`${apiPath}/${cid}`)
      .then((response) => {
        setListData(response?.payload);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  };

  const handleSubmit = (data) => {
    api.post(apiPath, { id_category_product: cid, id_sets: data })
      .then((response) => {
        toast.success("Uspešno");
      })
      .catch((error) => {
        console.warn(error);
        toast.warn("Greška");
      });
  };

  useEffect(() => {
    handleList();
  }, []);

  return !isLoading ? <SearchableListForm available={listData.available} selected={listData.selected} onSubmit={handleSubmit} /> : <Loading />;
};

export default DetailsSpecification;
