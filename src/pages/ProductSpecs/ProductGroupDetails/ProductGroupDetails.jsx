import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import IconList from "../../../helpers/icons";
import GroupAttributes from "./GroupAttributes/GroupAttributes";
import GroupValues from "./GroupValues/GroupValues"
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import AuthContext from "../../../store/auth-contex";

const ProductGroupDetails = () => {

  const init = {
    id: null,
    slug: null,
    name: null,
    order: null,
    status: "on",
  };

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const { groupId } = useParams();
  const [data, setData] = useState(init);
  const [isLoading, setIsLoading] = useState(false);
  const apiPath = "admin/product-item-specifications/group";
  const activeTab = getUrlQueryStringParam("tab") ?? 'attributes';
  const navigate = useNavigate();

  const getData = async () => {
    setIsLoading(true);
    await api
      .get(`${apiPath}/${groupId}`)
      .then((response) => {
        setData(response?.payload);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    getData();
  }, [groupId]);

  const fields = [
    {
      id: "attributes",
      name: "Atributi",
      icon: IconList.attribution,
      enabled: true,
      component: <GroupAttributes groupId={groupId} />,
    },
    {
      id: "attributes_values",
      name: "Vrednosti",
      icon: IconList.list,
      enabled: groupId,
      component: <GroupValues groupId={groupId} />,
    },
  ];

  // Handle after click on tab panel
  const panelHandleSelect = (field) => {
    let queryString = setUrlQueryStringParam("tab", field.id);
    navigate(`/products/product-specs/groups/${groupId}?${queryString}`, { replace: true });
  }

  return <DetailsPage title={data?.id != null && data?.name} fields={fields} ready={!isLoading} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default ProductGroupDetails;
