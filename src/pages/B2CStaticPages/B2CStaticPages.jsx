import ListPage from "../../components/shared/ListPage/ListPage";
import tblFields from "./tblFields.json";

import { useEffect, useState } from "react";
import ModalForm from "../../components/shared/Modal/ModalForm";

const B2CStaticPages = () => {
    const modalUrl = { save: { url: "admin/static-pages-b2c/list/clone" } };
    const [openModal, setOpenModal] = useState({ show: false, id: null, name: "", modalUrl });
    const [doesRefetch, setDoesRefetch] = useState(false);

    const customActions = {
        contentCopy: {
            type: "custom",
            display: true,
            position: 3,
            clickHandler: {
                type: "",
                fnc: (data) => {
                    setOpenModal({ show: true, id: data.id, name: data.name, modalUrl });
                },
            },
            icon: "content_copy",
            title: "Dupliraj",
        },
    };

    useEffect(() => {
        if (doesRefetch) {
            setDoesRefetch(false);
        }
    }, [doesRefetch]);

    return (
        <>
            <ListPage
                listPageId="B2CStaticPages"
                apiUrl="admin/static-pages-b2c/list"
                title="Statičke stranice"
                columnFields={tblFields}
                customActions={customActions}
                doesRefetch={doesRefetch}
                setDoesRefetch={setDoesRefetch}
            />

            <ModalForm
                anchor="right"
                openModal={openModal}
                setOpenModal={setOpenModal}
                formFields={[]}
                withoutSetterFunction
                cancelButton
                doesRefetch={doesRefetch}
                setDoesRefetch={setDoesRefetch}
                sx={{ padding: "2rem" }}
                shortText={`Da li ste sigurni da zelite da duplirate stranicu ${openModal.name}`}
                customTitle={"Dupliranje stranice"}
                initialData={{ id: openModal.id }}
                label="Dupliraj"
            />
        </>
    );
};

export default B2CStaticPages;
