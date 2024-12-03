import { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DetailsBasic from "../../../components/shared/Layout/Details/DetailsBasic/DetailsBasic";
import AuthContext from "../../../store/auth-contex";
import { getFormData, getListFormFields, saveForm } from "../services";
import DetailsList from "./DetailsList";
import listData from "./DetailsListData.json";
import fields from "./DetailsFields.json";
import CreateForm from "../../../components/shared/Form/CreateForm";
import TwoColumnDetails from "../../../components/shared/Layout/Details/TwoColumnDetails/TwoColumnDetails";
import SetFormFields from "./SetFormFields/SetFormFields";

import Skeleton from "@mui/material/Skeleton";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";

import { isEmpty } from "lodash";
import { toast } from "react-toastify";

import styles from "./DetailsAdminForm.module.scss";


const DetailsAdminForm = () => {
  const { FormId } = useParams();
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const [selected, setSelected] = useState("info");
  const [detailsList, setDetailsList] = useState(listData);

  const init = {
    id: null,
    slug: "",
    module: "",
    submodule: "",
    method: "",
    action_url: "",
    description: "",
    order: 0,
  };

  const [data, setData] = useState(init);
  const [formFields, setFormFields] = useState([]);
  const [inputsError, setInputsError] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [main, setMain] = useState();

  const handleBackToList = () => {
    navigate(`/admin-form`);
  };

  const handleSelectInDetails = (module, slug) => {
    if (FormId !== "new") {
      setSelected(slug);
    }
  };

  const handleFormData = async () => {
    try {
      setIsLoading(true);
      let response = await getFormData(user.access_token, FormId);
      let { payload } = response.data;
      setData(payload);
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormFields = async () => {
    try {
      setIsLoading(true);
      let response = await getListFormFields(user.access_token, FormId);
      let { payload } = response.data;
      setFormFields(payload.items);
    } catch (error) {
      console.warn(error);
    } finally {
      setIsLoading(false);
    }
  };

  const formItemChangeHandler = ({ target }, type) => {
    if (type) {
      setData({ ...data, [target.name]: target.checked });
    } else {
      setData({ ...data, [target.name]: target.value });
    }
  };

  const saveData = async () => {
    try {
      let response = await saveForm(user.access_token, data);
      handleBackToList();
      toast.success("Uspešno uneta forma!");
    } catch (error) {
      console.warn(error.response);
      toast.warning("Greška ");
    }
  };

  const onSubmit = () => {
    const errors = {};
    Object.keys(data).forEach((prop_name) => {
      if (isEmpty(data[prop_name])) {
        if (
          prop_name === "slug" ||
          prop_name === "module" ||
          prop_name === "method" ||
          prop_name === "action_url"
        )
          errors[prop_name] = {
            content: "Polje je obavezno, molim vas unesite vrednost.",
          };
      }
    });
    isEmpty(errors) ? saveData() : setInputsError(errors);
  };

  useEffect(() => {
    if (FormId !== "new") {
      handleFormData();
    }
  }, []);

  useEffect(() => {
    if (selected === "fields" && FormId !== "new") {
      handleFormFields();
    }
  }, [selected]);

  const getDisplayed = () => {
    switch (selected) {
      case "info":
        return (
          <Box component="form" autoComplete="off">
            {fields &&
              fields
                .filter(({ in_details }) => in_details)
                .map((item, index) => {
                  return (
                    <CreateForm
                      data-test-id="admin-form"
                      onChangeHandler={formItemChangeHandler}
                      item={item}
                      key={index}
                      error={inputsError[item.prop_name]}
                      value={
                        Array.isArray(item) && data
                          ? data[item.prop_name]
                          : data[item.prop_name]
                      }
                    />
                  );
                })}
          </Box>
        );

      case "fields":
        return <SetFormFields formFields={formFields} formId={data.id} />;

      default:
        return <p>Došlo je do greške! Molimo pokušajte kasnije.</p>;
    }
  };

  return (
    <>
      <Box className={styles.details}>
        <DetailsBasic
          handleBackToList={handleBackToList}
          list={
            <DetailsList
              selected={selected}
              detailsList={detailsList}
              handleSelectInDetails={handleSelectInDetails}
              isLoadingList={false}
              isErrorList={false}
            />
          }
          main={
            <TwoColumnDetails
              middle={
                <>
                  {!isLoading ? (
                    getDisplayed()
                  ) : (
                    <Stack spacing={1}>
                      <Skeleton variant="text" height={60} />
                      <Skeleton variant="text" height={60} />
                      <Stack spacing={1}>
                        <Skeleton variant="text" />
                        <Skeleton variant="circular" width={40} height={40} />
                        <Skeleton
                          variant="rectangular"
                          width={210}
                          height={118}
                        />
                      </Stack>
                      <Skeleton variant="text" height={60} />
                    </Stack>
                  )}
                </>
              }
              hasButton={selected === "info"}
              onSubmit={onSubmit}
              buttonText="Sacuvaj"
            />
          }
        />
      </Box>
    </>
  );
};

export default DetailsAdminForm;
