import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import Buttons from '../../../../components/shared/Form/Buttons/Buttons';
import Button from '../../../../components/shared/Button/Button';
import { rotateMatrix } from '../../../../helpers/data';
import Table from "../../../../components/shared/Table/Table";

import Check from "@mui/icons-material/Check";
import CircularProgress from '@mui/material/CircularProgress';
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { InputCheckbox, InputSelect } from '../../../../components/shared/Form/FormInputs/FormInputs';
import Dialog from '../../../../components/shared/Dialogs/DeleteDialog';
import Done from '@mui/icons-material/Done';
import Close from '@mui/icons-material/Close';
import style from './Connection.module.scss';
import Typography from '@mui/material/Typography';
import AuthContext from '../../../../store/auth-contex';

const Connection = ({ id, file }) => {
  const authCtx = useContext(AuthContext);
  const { api } = authCtx;
  const getImport = "admin/import/connect";
  const postImportExecute = "admin/import/mapping";


  const [dataImport, setDataImport] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingOnSubmit, setIsLoadingOnSubmit] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const [openDialog, setOpenDialog] = useState({
    show: false,
  });


  const [skipRows, setSkipRows] = useState(0);
  const [showSelected, setShowSelected] = useState(false);

  const [selectedConnection, setSelectedConnection] = useState(null);

  // The selected mapping by the user
  const [mapping, setMapping] = useState({});
  const [mappingCheckBox, setMappingCheckBox] = useState({});
  const updateMapping = (event, index, targetsArr) => {
    const { target } = event;
    const { value } = target;

    const updatedMapping = { ...mapping };

    if (value === "") {
      delete updatedMapping[index];
    } else {
      updatedMapping[index] = value;
    }

    setMapping(updatedMapping);
  }

  const submitTemp = () => {
    let arrTargetsModified = [];
    Object.keys(mapping).forEach((key) => {
      let index = dataImport?.targets.findIndex((target) => target.id === mapping[key]);
      let foundTargetObj = dataImport?.targets[index];
      foundTargetObj = {
        ...foundTargetObj.data,
        source_key: Number(key),
        overwrite_admin_value: mappingCheckBox[key] !== undefined ? mappingCheckBox[key] ? 1 : 0 : 0,
        name: foundTargetObj.name,
        cms_name_file: dataImport.preview[0][key],
        value_file: dataImport.preview[1][key]
      }

      arrTargetsModified.push(foundTargetObj);
    });

    const dataForServer = {
      targets: arrTargetsModified,
      id_admin_import_set: id,
      skip_rows: skipRows,
      save_template: showSelected
    }

    setModalContent(dataForServer);
    setOpenDialog({ show: true });
  }

  const updateMappingCheckBox = (index) => {
    setMappingCheckBox({ ...mappingCheckBox, [index]: !mappingCheckBox[index] });
  }

  const handleData = async () => {
    setIsLoading(true);
    api.put(`${getImport}/${id}`)
      .then((response) => {
        setDataImport(response?.payload);
        setIsLoading(false);
      })
      .catch((error) => {
        console.warn(error);
        setIsLoading(false);
      });
  };

  const submitHandler = (data) => {
    setIsLoadingOnSubmit(true);
    api.post(postImportExecute, data)
      .then((response) => {
        toast.success("Uspešno ste uvezli dokument!");
        setIsLoadingOnSubmit(false);
        setOpenDialog({ show: false });
      })
      .catch((error) => {
        toast.error("Došlo je do greške prilikom uvoza dokumenta!");
        setIsLoadingOnSubmit(false);
        setOpenDialog({ show: false });
      });
  };

  const handleCancel = () => {
    setOpenDialog({ show: false });
  };

  useEffect(() => {
    if (id) {
      handleData();
    }
  }, [id]);

  return (
    <>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell width="15%">Poveži sa</TableCell>
            <TableCell width="21,25%">Pregazi admin vrednost</TableCell>
            <TableCell width="21,25%">Prvi red</TableCell>
            <TableCell width="21,25%">Drugi red</TableCell>
            <TableCell width="21,25%">Treći red</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {dataImport && dataImport.preview && rotateMatrix(dataImport.preview).map((row, index) => {
            return (
              < TableRow key={index} >
                {/* The list of options to choose from */}
                <TableCell className="no-padding" >
                  <FormControl fullWidth size="small" style={{ padding: "5px 1em 5px 5px" }}>
                    <Select
                      value={mapping[index] ?? ""}
                      onChange={(event => updateMapping(event, index, dataImport?.targets))}
                      label=" "
                      sx={{
                        ".MuiSelect-select": { padding: "0.7rem", fontSize: "0.875rem" },
                        "& legend": { display: "none" },
                        "& fieldset": { top: 0 },
                      }}
                    >
                      <MenuItem sx={{ fontSize: "0.875rem" }} value="">-</MenuItem>
                      {dataImport.targets.map(key =>
                        <MenuItem sx={{ fontSize: "0.875rem" }} key={key.id} value={key.id}>{key.name}</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell >
                  <InputCheckbox value={mappingCheckBox[index] ?? false} onChange={(ev) => { updateMappingCheckBox(index) }} />
                </TableCell>

                {/* The extracted values, limited to 4 */}
                {
                  row.slice(0, 3).map((cell, index) => {
                    return (
                      <TableCell TableCell key={index} > {cell}</TableCell>
                    )

                  })
                }
              </TableRow>
            );
          })}

          {/*  Shown while loading */}
          {/* {setIsLoading && <LoadingTableRows columns="4" />} */}
        </TableBody >

      </Table >
      {file && (
        <Buttons styleWrapperButtons={{ alignItems: "end" }}>
          {/* Skip starting rows */}
          <InputSelect onChange={(res) => { const { target } = res; setSkipRows(target.value); setSelectedConnection(target.value) }} value={selectedConnection ?? ""} label="Preskoči redova" options={dataImport?.skip_rows} styleFormControl={{ width: "25%", marginBottom: "0", marginRight: "1rem !important", ".MuiFormLabel-root": { fontSize: "0.875rem" } }} />
          {/* <InputSelect onChange={(res) => { const { target } = res; setSelectedImportSystem(target.value) }} value={selectedImportSystem} label="Import sistema" options={dataImport?.import_system} styleFormControl={{ width: "25%", marginRight: "auto", marginBottom: "0" }} /> */}
          <InputCheckbox label="Sačuvaj kao template" value={showSelected} onChange={({ target }) => { setShowSelected(target.checked) }} labelStyle={{ color: "#00000099" }} styleCheckBoxWrapp={{ width: "auto", marginRight: "auto", visibility: "hidden" }} />
          <Button icon={<Check />} label={isLoading ? <CircularProgress size="1.5rem" /> : "Potvrdi uvoz"} onClick={submitTemp} variant="contained" />
        </Buttons>
      )
      }

      <Dialog
        title={modalContent?.targets?.length > 0 ? `${file?.name}` : " "}
        handleCancel={handleCancel}
        handleConfirm={() => submitHandler(modalContent)}
        openDeleteDialog={openDialog}
        setOpenDeleteDialog={setOpenDialog}
        nameOfButton="Nastavi"
        deafultDeleteIcon={false}
        sx={{ backgroundColor: "#28a86e", "&:hover": { backgroundColor: "#1e7d4e" } }}
        disabledButton={modalContent?.targets?.length > 0 ? false : true}
        children={() => {
          if (modalContent?.targets?.length > 0) {
            return (
              <>
                <Typography variant="subtitle2" sx={{ color: "#6d6d6d", marginBottom: "2rem" }}>Pre nego što potvrdite uvoz, molimo Vas da pažljivo proverite da ste svaku kolonu iz CSV fajla pravilno povezali sa odgovarajućim ciljem u CMS-u. </Typography >
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Polje u CMS</TableCell>
                      <TableCell>Polje iz fajla</TableCell>
                      <TableCell>Vrednost iz fajla</TableCell>
                      <TableCell>Pregažena vrednost</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {modalContent?.targets.map((row) => (
                      <TableRow key={`${row.target_key}-${row.source_key}`} className={style.tableRowModalContent}>
                        <TableCell style={{ padding: "0.5rem 1rem" }}>{row.name}</TableCell>
                        <TableCell style={{ padding: "0.5rem 1rem" }}>{row.cms_name_file}</TableCell>
                        <TableCell style={{ padding: "0.5rem 1rem" }}>{row.value_file}</TableCell>
                        <TableCell style={{ padding: "0.5rem 1rem" }}>
                          {
                            row?.overwrite_admin_value === 1 ? (
                              <Done style={{ color: 'green' }} />
                            ) : (
                              <Close style={{ color: 'red' }} />
                            )
                          }
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table >
              </>
            )
          } else {
            return (
              <Typography>
                Obvazeno je odabrati vrednosti za uvoz.
              </Typography>
            )
          }
        }}
      />

    </>
  );
}

export default Connection;