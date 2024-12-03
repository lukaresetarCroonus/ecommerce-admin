import { useContext, useEffect } from "react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import NoteBox from "../../../components/shared/NoteBox/NoteBox";
import { NEW } from "../../../helpers/const";
import { updateStateKey } from "../../../helpers/data";
import IconList from "../../../helpers/icons";
import DetailsPage from "../../../components/shared/ListPage/DetailsPage/DetailsPage";
import BasicPanel from "./Panels/BasicPanel";
import BrandsPanel from "./Panels/BrandsPanel";
import CategoriesPanel from "./Panels/CategoriesPanel";
import TiersPanel from "./Panels/TiersPanel";
import { getUrlQueryStringParam, setUrlQueryStringParam } from "../../../helpers/functions";
import AuthContext from "../../../store/auth-contex";

const B2BRebatesDetails = () => {
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const params = useParams();
  const [error, setError] = useState(null);
  const [data, setData] = useState({
    rebate: null,
    brands: null,
    categories: null,
    tiers: null,
  });
  const navigate = useNavigate();
  const activeTab = getUrlQueryStringParam("tab") ?? 'rebate';

  // Check if this is a new record, or we are modifying an existing one
  const isNew = params["rebateId"] === NEW;
  const rebateId = isNew ? 0 : 1 * params["rebateId"];

  // Read data
  useEffect(() => {
    // RebateScales
    api.get(`/admin/rebates/${rebateId ?? 0}`)
      .then((response) => updateStateKey(setData, "rebate", response?.payload))
      .catch(setError);

    // Categories
    api.get(`/admin/rebates/ddl/categories`)
      .then((response) => updateStateKey(setData, "categories", response?.payload))
      .catch(setError);

    // Brands
    api.get(`/admin/rebates/ddl/brands`)
      .then((response) => updateStateKey(setData, "brands", response?.payload))
      .catch(setError);

    // Tiers
    api.list(`/admin/rebates/tiers`, { limit: -1 })
      .then((response) => updateStateKey(setData, "tiers", response?.payload.items))
      .catch(setError);
  }, [rebateId]);

  // Handle errors
  if (error) {
    return <NoteBox message={`Error: ${error}`} />;
  }

  // Update from the basic table
  const updateBasic = (rebate) =>
    submit({
      ...data.rebate,
      name: rebate.name,
      description: rebate.description,
    });

  // Send to API
  const submit = (rebate) => {
    let oldId = rebate.id;
    updateStateKey(setData, "rebate", rebate);
    api.post("/admin/rebates", rebate)
      .then((response) => {
        setData((data) => ({ ...data, rebate: { ...data.rebate, id: response.payload.id } }));
        toast.success("Uspešno sačuvano");
        if (oldId === null) {
          let tId = response?.payload?.id;
          navigate(`/b2b-rebates/${tId}`, { replace: true });
        }
      })
      .catch((error) => {
        toast.warning("Došlo je do greške");
        console.warn(error);
      });
  };

  // The panels for the form
  const panels = [
    {
      id: "rebate",
      name: "Rabat",
      icon: IconList.percent,
      loading: data.rebate,
      component: <BasicPanel data={data.rebate} updateData={updateBasic} />,
    },
    {
      id: "categories",
      name: "Kategorije",
      icon: IconList.inboxCustomize,
      enabled: data.rebate?.id,
      component: <CategoriesPanel rebate={data.rebate} categories={data.categories} onUpdate={(categories) => submit({ ...data.rebate, categories })} />,
    },
    {
      id: "brands",
      name: "Brendovi",
      icon: IconList.stars,
      enabled: data.rebate?.id,
      component: <BrandsPanel rebate={data.rebate} brands={data.brands} onUpdate={(brands) => submit({ ...data.rebate, brands })} />,
    },
    {
      id: "amounts",
      name: "Iznosi",
      icon: IconList.bookmarks,
      enabled: data.rebate?.id,
      component: <TiersPanel rebate={data.rebate} tiers={data.tiers} onUpdate={(tiers) => submit({ ...data.rebate, tiers })} />,
    },
  ];

  // Handle after click on tab panel
  const panelHandleSelect = (field) => {
    let queryString = setUrlQueryStringParam("tab", field.id);
    const id = data.rebate?.id == null ? "new" : data.rebate?.id;
    navigate(`/b2b-rebates/${id}?${queryString}`, { replace: true });
  }

  // The title of the page
  const title = !isNew ? `${data.rebate?.name ? `${data.rebate?.name}` : ""}` : "Novi unos rabata";

  return <DetailsPage title={title} fields={panels} ready={[data.rebate, data.tiers, data.categories, data.categories]} selectedPanel={activeTab} panelHandleSelect={panelHandleSelect} />;
};

export default B2BRebatesDetails;
