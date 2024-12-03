import tblFields from "../forms/seo.json";
import ListPage from "../../../../components/shared/ListPage/ListPage";
import { useContext, useEffect, useState } from "react";
import AuthContext from "../../../../store/auth-contex";

const Seo = ({ categoryId }) => {
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;
    const [formFieldsTemp, setFormFieldsTemp] = useState(tblFields);

    const handleInformationImage = () => {
        api.get(`admin/news-b2c/category/seo/options/upload`)
            .then((response) => {
                formatFormFields(response?.payload);
            })
            .catch((error) => console.warn(error));
    };

    const formatFormFields = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            let arr = formFieldsTemp.map((field) => {
                if (field?.prop_name === "social_share_image") {
                    const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format
                        .map((format) => format.name)
                        .join(", ")}. ${field?.description}`;

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
            listPageId="B2CNewsCategoriesSeo"
            apiUrl={`admin/news-b2c/category/seo/${categoryId}`}
            editUrl={`admin/news-b2c/category/seo`}
            deleteUrl={`admin/news-b2c/category/seo`}
            apiPathCrop={`admin/news-b2c/category/seo/options/crop`}
            title=" "
            columnFields={formFieldsTemp}
            actionNewButton="modal"
            initialData={{ id_category_news: categoryId }}
            addFieldLabel="Dodajte novu vrednost"
            showAddButton={true}
        />
    );
};

export default Seo;
