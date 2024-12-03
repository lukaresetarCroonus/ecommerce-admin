import { useContext, useEffect, useState } from "react";
import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";
import AuthContext from "../../store/auth-contex";
import ModalContent from "./ModalContent";
import { toast } from "react-toastify";

const Manufacturers = () => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [formFieldsTemp, setFormFieldsTemp] = useState(tblFields);

    const customActions = {
        delete: {
          clickHandler: {
            type: 'dialog_delete',
            fnc: (rowData, handleDeleteModalData) => {
              return {
                show: true,
                id: rowData.id,
                mutate: null,
                children: (
                  <ModalContent apiPath={`admin/manufacturers/message/${rowData.id}`} rowData={rowData} handleDeleteModalData={handleDeleteModalData} />
                )
              };
            },
          },
          deleteClickHandler: {
            type: 'dialog_delete',
            fnc: (rowData, deleteModalData) => {
              api.delete(`admin/manufacturers/confirm/${rowData.id}`)
                .then(() => toast.success("Zapis je uspešno obrisan"))
                .catch((err) => toast.warning(err?.response?.data?.message ?? err?.response?.data?.payload?.message ?? "Došlo je do greške prilikom brisanja"));
    
              return {
                show: false,
                id: rowData.id,
                mutate: 1,
              };
            }
          },
        },
    }
      
    const handleInformationImage = () => {
        api.get(`admin/manufacturers/options/upload`)
            .then((response) => {
                formatFormFields(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const formatFormFields = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = tblFields.map((field) => {
                if (field?.prop_name === "logo") {
                    return {
                        ...field,
                        description: descripiton,
                        validate: {
                            imageUpload: data,
                        },
                        ui_prop: {
                            fileUpload: data,
                        },
                        dimensions: { width: image?.width, height: image?.height },
                    };
                } else {
                    return {
                        ...field,
                    };
                }
            });
            setFormFieldsTemp([...arr]);
        }
    };

    useEffect(() => {
        handleInformationImage();
    }, []);

    return (
        <ListPage
            listPageId="Manufacturers"
            apiUrl="admin/manufacturers"
            title="Proizvođači"
            columnFields={formFieldsTemp}
            useColumnFields={true}
            actionNewButton="modal"
            apiPathCrop={`admin/manufacturers/options/crop`}
            customActions={customActions}
        />
    );
};

export default Manufacturers;
