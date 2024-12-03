import { useEffect, useState } from "react";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import tblFields from "../forms/comments.json";
import { useContext } from "react";
import AuthContext from "../../../../store/auth-contex";
import { toast } from "react-toastify";

const Comments = ({ rId }) => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const [tblFieldsTemp, setTblFieldsTemp] = useState(tblFields);
  const [idReclamationItem, setIdReclamationItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState([]);
  const [uploadedFiles, setUploadedFiles] = useState([{}]);

  const [fileValidation, setFileValidation] = useState(null);

  const base64 = selectedFile.map(item => { return item?.base_64 })

  const customActions = {
    edit: {
      type: "edit",
      title: "Pregledaj",
      icon: "preview",
      clickHandler: {
        type: 'modal_form',
        fnc: (rowData) => {
          api.get(`admin/reclamations-b2b/comments/${rowData.id}`)
            .then((response) => {
              const arrayOfUploadedFiles = response?.payload?.uploaded_files;
              setUploadedFiles(arrayOfUploadedFiles)
            })
            .catch((error) => console.warn(error));

          let arr = tblFieldsTemp.map((item) => {
            if (item.prop_name === 'file') {
              return {
                ...item,
                in_details: false,
              }
            } else if (item.prop_name === 'uploaded_file') {
              return {
                ...item,
                in_details: true,
              }
            } else {
              return {
                ...item,
                disabled: true,
              }
            }
          })
          setTblFieldsTemp([...arr]);
          return {
            show: true,
            id: rowData.id,
          };
        },
      },
    },
    delete: {
      type: "delete",
      display: false,
    },
  }


  const fetchPlacesFormFields = async (tblFields, id_reclamations_items) => {
    let index = tblFields.findIndex((it) => { return it.prop_name === 'id_reclamations_items' });

    const recObject = tblFields[index];
    let path = `${recObject.fillFromApi}`;
    if (recObject?.usePropName) {
      path = `${recObject.fillFromApi}/${recObject.prop_name}?id_reclamations=${id_reclamations_items}`;
    }

    api.get(`admin/reclamations-b2b/comments/options/upload`)
      .then((response) => {
        setFileValidation(response.payload);
        const { allow_format, allow_size } = response?.payload;
        let descriptionTemp = `Veličina fajla ne sme biti veća od ${allow_size ? (allow_size / (1024 * 1024)).toFixed(2) : ""}MB. Dozvoljeni formati fajla: ${allow_format ? allow_format.map((format) => format.name).join(", ") : ""}`;
        api
          .get(path)
          .then((response) => {
            let arr = tblFields.map((item) => {
              if (item.prop_name === 'id_reclamations_items') {
                return {
                  ...item,
                  queryString: `id_reclamations=${id_reclamations_items}`,
                }
              } else if (item.prop_name === 'uploaded_file') {
                return {
                  ...item,
                  in_details: false,
                }
              } else if (item.prop_name === "file") {
                return {
                  ...item,
                  description: descriptionTemp
                }
              } else {
                return {
                  ...item
                }
              }
            });
            setTblFieldsTemp([...arr]);
          })
          .catch((error) => {
            console.warn(error);
          });
      })
      .catch((error) => console.warn(error));
  }


  const validateData = (data, field) => {
    let ret = data;
    switch (field) {
      case 'id_reclamations_items':
        setIdReclamationItem(data.id_reclamations_items)
        return ret;
      default:
        return ret;
    }
  };
  useEffect(() => {
    fetchPlacesFormFields(tblFields, rId);
  }, [])


  return (
    <>
      <ListPage
        listPageId="B2BReclamationsComments"
        apiUrl={`admin/reclamations-b2b/comments/${rId}`}
        editUrl={`admin/reclamations-b2b/comments`}
        title=" "
        columnFields={tblFieldsTemp}
        useColumnFields={true}
        actionNewButton="modal"
        initialData={{ id_reclamations: rId, id_reclamations_items: idReclamationItem, file: base64 }}
        customActions={customActions}
        showAddButton={true}
        addFieldLabel="Dodajte novi komentar"
        // submitButtonForm={false}
        onNewButtonPress={() => {
          fetchPlacesFormFields(tblFields, rId);
          setSelectedFile([]);
          // setUploadedFiles([{}]);
        }}
        validateData={validateData}
        onFilePicked={
          (fileObject) => {
            const { allow_format, allow_size } = fileValidation
            const { file } = fileObject;
            const { type, size } = file;
            const allowedFormats = allow_format.map(format => format?.mime_type.toLowerCase());
            const isFormatAllowed = allowedFormats.includes(type.toLowerCase());
            const fileSizeInB = Number(size);
            if (isFormatAllowed) {
              if (fileSizeInB < Number(allow_size)) {
                setSelectedFile([...selectedFile, fileObject]);
              } else {
                toast.error(`Veličina fila je prevelika. Maksimalna dozvoljena veličina je ${allow_size / (1024 * 1024)} MB.`);
              }
            } else {
              toast.error(`Nedozvoljeni format fila. Dozvoljeni formati su: ${allowedFormats.join(", ")}`);
            }
          }
        }
        selectedFile={selectedFile}
        handleRemoveFile={
          (file) => {
            const updatedFiles = selectedFile.filter(item => item.name !== file.name);
            setSelectedFile(updatedFiles);
          }
        }
        dataFromServer={uploadedFiles}
      />
    </>
  )
}

export default Comments
