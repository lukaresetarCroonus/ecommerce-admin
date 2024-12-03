import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";
import AuthContext from "../../store/auth-contex";
import { useQuery } from "react-query";

const B2Cbanners = ({}) => {
    const navigate = useNavigate();
    const [formFieldsTemp, setFormFieldsTemp] = useState(tblFields);
    const [idPosition, setIdPosition] = useState(null);
    const authCtx = useContext(AuthContext);
    const { api } = authCtx;

    const {} = useQuery(
        ["b2c-banners", idPosition],
        async () => {
            return await api
                .get(`admin/banners-b2c/main/options/upload?id_position=${idPosition}`)
                .then((response) => {
                    formatFormFields(response?.payload);
                })
                .catch((error) => console.warn(error));
        },
        { refetchOnWindowFocus: false }
    );

    const buttons = [
        {
            label: "Pozicije",
            action: () => {
                navigate("positions");
            },
        },
    ];

    const customActions = {
        edit: {
            clickHandler: {
                type: "modal_form",
                fnc: (rowData) => {
                    setIdPosition(rowData?.id_position);
                    filterFields(formFieldsTemp, rowData?.type);
                    // getForm();
                    return {
                        show: true,
                        id: rowData.id,
                    };
                },
            },
        },
    };

    const filterFields = (fields, type) => {
        console.log(fields, type);
        const arr = fields?.map((field) => {
            const { prop_name } = field;

            if (prop_name === "position_name") {
                return {
                    ...field,
                    in_details: false,
                };
            }

            if (type === "image" || type === "video") {
                if (prop_name === "video_url") {
                    return {
                        ...field,
                        in_details: false,
                    };
                } else {
                    if (prop_name === "image" && type === "video") {
                        return {
                            ...field,
                            field_name: "Video",
                            in_details: true,
                        };
                    } else {
                        if (prop_name === "image" && type === "image") {
                            return {
                                ...field,
                                field_name: "Slika",
                                in_details: true,
                            };
                        } else {
                            return {
                                ...field,
                                in_details: true,
                            };
                        }
                    }
                }
            }

            if (type === "video") {
                if (prop_name === "image" || prop_name === "video") {
                    return {
                        ...field,
                        in_details: false,
                    };
                }

                if (prop_name === "video_url") {
                    return {
                        ...field,
                        in_details: true,
                    };
                }
            }

            if (type === "video_link") {
                if (prop_name === "image" || prop_name === "video") {
                    return {
                        ...field,
                        in_details: false,
                    };
                }

                if (prop_name === "video_url") {
                    return {
                        ...field,
                        in_details: true,
                    };
                } else {
                    return {
                        ...field,
                        in_details: true,
                    };
                }
            }

            return {
                ...field,
            };
        });

        setFormFieldsTemp(arr || []);
    };

    const validateData = (data, field) => {
        let ret = data;
        switch (field) {
            case "id_position":
                let index = formFieldsTemp.findIndex((it) => {
                    return it.prop_name === "id_position";
                });

                let idPositionObject = formFieldsTemp[index];
                let path = `${idPositionObject?.fillFromApi}/${idPositionObject?.prop_name}?id_position=${ret?.id_position}`;

                api.get(path)
                    .then((response) => {
                        const idPositionArr = response?.payload;

                        const selectedIdPositionItem = idPositionArr.find((systemItem) => systemItem.id === ret.id_position);

                        if (selectedIdPositionItem) {
                            setIdPosition(ret?.id_position);
                        }
                    })
                    .catch((error) => {
                        console.warn(error);
                    });

                return ret;
            case "type":
                filterFields(formFieldsTemp, ret?.type);
                return ret;
            case undefined:
                setIdPosition(ret?.id_position);
                return ret;
            default:
                return ret;
        }
    };

    const formatFormFields = (data) => {
        if (data) {
            const { allow_size, allow_format, image } = data;
            const descripiton = `Veličina fajla ne sme biti veća od ${allow_size / (1024 * 1024).toFixed(2)}MB. Dozvoljeni formati fajla: ${allow_format.map((format) => format.name).join(", ")}`;
            let arr = formFieldsTemp.map((field) => {
                if (field?.prop_name === "image") {
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

    return (
        <ListPage
            validateData={validateData}
            customActions={customActions}
            listPageId="B2Cbanners"
            title={"B2C baneri"}
            apiPathCrop={`admin/banners-b2c/main/options/crop?id_position=${idPosition}`}
            apiUrl="admin/banners-b2c/main"
            columnFields={formFieldsTemp}
            actionNewButton="modal"
            additionalButtons={buttons}
            useColumnFields={true}
            onNewButtonPress={() => {
                setFormFieldsTemp(tblFields);
            }}
        />
    );
};

export default B2Cbanners;
