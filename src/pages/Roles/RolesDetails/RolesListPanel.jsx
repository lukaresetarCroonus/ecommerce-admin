import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import SearchableListForm from "../../../components/shared/Form/SearchableListForm/SearchableListForm";
import Loading from "../../../components/shared/Loading/Loading";
import AuthContext from "../../../store/auth-contex";

const RolesListPanel = ({ roleId }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [listData, setListData] = useState([]);
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState([]);

  const apiPath = "admin/roles/screens";

  const handleList = () => {
    setIsLoading(true);
    api.get(`${apiPath}/${roleId}`)
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
    setIsLoadingOnSubmit(true);
    api.post(apiPath, { role_id: roleId, screen_ids: data })
      .then((response) => {
        toast.success("Uspešno");
        setIsLoadingOnSubmit(false);
      })
      .catch((error) => {
        console.warn(error);
        toast.warn("Greška");
        setIsLoadingOnSubmit(false);
      });
  };

  useEffect(() => {
    handleList();
  }, []);

  return !isLoading ? <SearchableListForm available={listData.available} selected={listData.selected} onSubmit={handleSubmit} isLoading={isLoadingOnSubmit} /> : <Loading />;
};

export default RolesListPanel;
