import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Button from "../../../../components/shared/Button/Button";
import Buttons from "../../../../components/shared/Form/Buttons/Buttons";
import SearchableListForm from "../../../../components/shared/Form/SearchableListForm/SearchableListForm";
import Loading from "../../../../components/shared/Loading/Loading";
import AuthContext from "../../../../store/auth-contex";

const SalesOfficers = ({ companyId }) => {
  const [listData, setListData] = useState([]);
  const [isLoading, setIsLoading] = useState([]);
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);

  const navigate = useNavigate();

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const apiPath = "admin/customers-b2b/sales-officer";

  const handleList = () => {
    setIsLoading(true);
    api.get(`${apiPath}/${companyId}`)
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
    api.post(apiPath, { id_company: companyId, id_sales_officers: data })
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

  return !isLoading ? (
    <>
      <Buttons>
        <Button label="Komercijalisti" variant="contained" onClick={() => navigate("/b2b-sales-officers")} />
      </Buttons>
      <SearchableListForm available={listData.available} selected={listData.selected} onSubmit={handleSubmit} isLoading={isLoadingOnSubmit} />
    </>
  ) : (
    <Loading />
  );
};

export default SalesOfficers;
