import { useContext, useState } from "react";
import ListPage from "../../components/shared/ListPage/ListPage";

import tblFields from "./tblFields.json";
import ModalContent from "./ModalContent";
import Chip from "@mui/material/Chip";
import Icon from "@mui/material/Icon";
import Box from "@mui/material/Box";
import AuthContext from "../../store/auth-contex";

const Scripts = () => {

  const authCtx = useContext(AuthContext);
  const { api } = authCtx;

  const [data, setData] = useState(null);
  const [rowData, setRowData] = useState(null);
  const [activePage, setActivePage] = useState(null);

  const customActions = {
    contentCopy: {
      type: "custom",
      display: true,
      icon: "description",
      title: "Skripte",
      clickHandler: {
        type: 'modal_form',
        fnc: (rowData) => {
          setActivePage('checkbox');
          api.get(`admin/scripts/commands/${rowData.id}`)
            .then((response) => { setData(response?.payload?.items) })
            .catch((error) => console.log(error));
          setRowData(rowData);
          return {
            show: true,
            id: rowData.id
          };
        },
      },
    },
    infoStatus: {
      type: "custom",
      display: true,
      icon: "info",
      title: "Proverite status",
      clickHandler: {
        type: 'modal_form',
        fnc: (rowData) => {
          setActivePage('info');
          setRowData(rowData);
          api.get(`admin/scripts/execute/${rowData.id}`)
            .then((response) => {
              const status = response?.payload?.status;
              let chipColor = "";
              let icon = "";
              switch (status) {
                case "Error":
                  chipColor = "error";
                  icon = "error";
                  break;
                case "Wait":
                  chipColor = "error";
                  icon = "pending";
                  break;
                case "Done":
                  chipColor = "success";
                  icon = "done";
                  break;
                case "In Progress":
                  chipColor = "info";
                  icon = "loop";
                  break;
                case "Warning":
                  chipColor = "warning";
                  icon = "warning";
                  break;
                case "Cancel":
                  chipColor = "error";
                  icon = "cancel";
                  break;
                default:
                  chipColor = "success";
                  icon = "done";
                  break;
              }
              const dataObject = {
                status: status,
                chipColor: chipColor,
                icon: icon
              }
              setData(dataObject);
            })
            .catch((error) => console.log(error));

          return {
            show: true,
            id: rowData.id,
            mutate: null,
          };
        },
      },
    },
    edit: {
      type: "edit",
      display: false,
    },
    delete: {
      type: "delete",
      display: false,
    }
  };

  return (
    <>
      <ListPage
        listPageId="Scripts"
        apiUrl="admin/scripts/list"
        title="Skripte"
        columnFields={tblFields}
        customActions={customActions}
        modalFormChildren={
          <>
            {activePage === 'info' ? (
              <Box sx={{ height: "100%", display: "flex" }}>
                <Chip
                  label={rowData?.status}
                  icon={<Icon>{data?.icon}</Icon>}
                  color={data?.chipColor}
                  sx={{
                    fontSize: "0.875rem",
                    borderRadius: "0.3rem",
                    padding: "2rem",
                    margin: "auto",
                    "& .MuiChip-icon": {
                      fontSize: "1.2rem"
                    }
                  }}
                />
              </Box>
            ) : (
              <ModalContent data={data} rowData={rowData} />
            )}
          </>
        }
        showNewButton={false}
      />
    </>
  );
};

export default Scripts;
