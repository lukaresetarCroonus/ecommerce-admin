import axios from "axios";

const api = () => {
  return localStorage.getItem("api");
  // return apiLocal;
};

export const getListAdminForms = async (token, search) => {
  return await axios({
    method: "LIST",
    url: `${api()}admin/form`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: { search: search },
  });
};

export const getFormData = async (token, id) => {
  return await axios({
    method: "GET",
    url: `${api()}admin/form/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const getListFormFields = async (token, id) => {
  return await axios({
    method: "LIST",
    url: `${api()}admin/form/fields/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const deleteForm = async (token, id) => {
  return await axios({
    method: "DELETE",
    url: `${api()}admin/form/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const saveForm = async (token, data = {}) => {
  const req = JSON.stringify(data);
  return await axios({
    method: "POST",
    url: `${api()}admin/form`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: req,
  });
};

export const saveFormField = async (token, data = {}) => {
  const req = JSON.stringify(data);
  return await axios({
    method: "POST",
    url: `${api()}admin/form/fields`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: req,
  });
};

export const deleteFormField = async (token, id) => {
  return await axios({
    method: "DELETE",
    url: `${api()}admin/form/fields/${id}`,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};
