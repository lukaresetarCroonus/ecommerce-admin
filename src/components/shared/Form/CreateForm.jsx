import React, { useState } from "react";

import ImageUpload from "../ImageUpload/ImageUpload";
import ImageButton from "../ImageButton/ImageButton";
import InputMultipleImages from "../InputMultipleImages/InputMultipleImages";
import {
    InputCheckbox,
    InputDate,
    InputDateTime,
    InputHtml,
    InputInput,
    InputMultiSelect,
    InputNumber,
    InputRadio,
    InputSelect,
    InputSwitch,
    InputText,
    AutocompleteInput,
    AutocompleteTagsFilled,
    ImportPicker,
    FilePicker,
    AutocompleteInputFreeSolo,
} from "./FormInputs/FormInputs";
import FileButton from "../FileButton/FileButton";
import InputMultipleFiles from "../InputMultipleFiles/InputMultipleFiles";
import Slider from "../Slider/Slider";
import InputMultipleImagesOne from "../InputMultipleImages/InputMultipleImagesOne";
import ImageDialog from "../Dialogs/ImageDialog";

const CreateForm = ({
    item = {},
    onChangeHandler = () => {},
    onImageUpload = () => {},
    onChangeAutoHandler = () => {},
    // TODO remove onImagePreview
    onImagePreview = () => {},
    onOpenImageDialog = () => {},
    value = "",
    error = null,
    disabled = false,
    queryString = "",
    optionsIsEmpty = () => {},
    styleCheckbox,
    autoFocus,
    onFilePicked = () => {},
    selectedFile,
    handleRemoveFile = () => {},
    dataFromServer,
    allowedFileTypes,
    setPropName,
    apiPathCrop,
    isArray,
}) => {
    // depending on input type in fields you will get a control
    // value is obvious
    // onChangeHandler change handler
    // error is for validations backend and frontend
    value = value === null ? "" : value;

    const onInputChangeHandler = (event) => {
        onChangeHandler(event);
    };
    let formItem = null;
    if (Array.isArray(item)) {
        formItem = (
            <>
                {item.map((itemUnit, index) => (
                    <CreateForm
                        item={itemUnit}
                        key={itemUnit.prop_name}
                        onChangeHandler={onChangeHandler}
                        onChangeAutoHandler={onChangeAutoHandler}
                        error={error[index]}
                        value={value}
                        disabled={disabled}
                    />
                ))}
            </>
        );
    } else {
        if (item.editable) {
            switch (item.input_type) {
                case "input":
                    formItem = (
                        <InputInput
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            error={error}
                            onChange={onChangeHandler}
                            disabled={disabled}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "image_upload": //TODO
                    formItem = (
                        <ImageUpload
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            error={error}
                            onImageUpload={onImageUpload}
                            onImagePreview={onImagePreview}
                            disabled={disabled}
                            autoFocus={autoFocus}
                        />
                    );
                    break;
                case "image_button": //TODO
                    formItem = (
                        <ImageButton
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            item={item}
                            error={error}
                            imgWidth={item.dimensions ? item.dimensions.width : 800}
                            imgHeight={item.dimensions ? item.dimensions.height : 600}
                            onImageUpload={onImageUpload}
                            onOpenImageDialog={onOpenImageDialog}
                            disabled={disabled}
                            selectedFile={selectedFile}
                            allowedFileTypes={allowedFileTypes ?? item?.ui_prop?.fileUpload?.allow_format}
                            autoFocus={autoFocus}
                            setPropName={setPropName}
                        />
                    );
                    break;
                case "checkbox":
                    formItem = (
                        <InputCheckbox
                            styleCheckbox={styleCheckbox}
                            name={item.prop_name}
                            value={Boolean(Number(value))}
                            onChange={(e) => onChangeHandler(e, "checkbox")}
                            disabled={disabled}
                            label={item.field_name}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "radio":
                    formItem = (
                        <InputRadio
                            name={item.prop_name}
                            value={Boolean(Number(value))}
                            onChange={(e) => onChangeHandler(e, "radio")}
                            disabled={disabled}
                            label={item.field_name}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "switch":
                    formItem = (
                        <InputSwitch
                            label={item.field_name}
                            name={item.prop_name}
                            value={Boolean(Number(value))}
                            onChange={(e) => onChangeHandler(e, "switch")}
                            disabled={disabled}
                            error={error}
                            description={item.description}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "select":
                    formItem = (
                        <InputSelect
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            name={item.prop_name}
                            disabled={disabled}
                            error={error}
                            value={value}
                            onChange={onInputChangeHandler}
                            options={item.options}
                            description={item.description}
                            fillFromApi={item.fillFromApi}
                            usePropName={item.usePropName}
                            queryString={item.queryString ?? queryString}
                            optionsIsEmpty={optionsIsEmpty}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "autocomplete":
                    formItem = (
                        <AutocompleteInput
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            name={item.prop_name}
                            disabled={disabled}
                            error={error}
                            value={value}
                            options={item.options}
                            onChange={onChangeAutoHandler}
                            description={item.description}
                            fillFromApi={item.fillFromApi}
                            usePropName={item.usePropName}
                            queryString={item?.queryString ?? queryString}
                            optionsIsEmpty={optionsIsEmpty}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "autocomplete_free_solo":
                    formItem = (
                        <AutocompleteInputFreeSolo
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            name={item.prop_name}
                            disabled={disabled}
                            error={error}
                            value={value}
                            options={item.options}
                            onChange={onChangeAutoHandler}
                            description={item.description}
                            fillFromApi={item.fillFromApi}
                            usePropName={item.usePropName}
                            queryString={item?.queryString ?? queryString}
                            optionsIsEmpty={optionsIsEmpty}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "autocomplete_tags_filled":
                    formItem = (
                        <AutocompleteTagsFilled
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            name={item.prop_name}
                            disabled={disabled}
                            error={error}
                            value={value}
                            options={item.options}
                            onChange={onChangeAutoHandler}
                            description={item.description}
                            fillFromApi={item.fillFromApi}
                            usePropName={item.usePropName}
                            queryString={queryString}
                            optionsIsEmpty={optionsIsEmpty}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "multi_select":
                    formItem = (
                        <InputMultiSelect
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            name={item.prop_name}
                            disabled={disabled}
                            error={error}
                            value={Array.isArray(value) ? value : []}
                            onChange={onInputChangeHandler}
                            options={item.options}
                            description={item.description}
                            fillFromApi={item.fillFromApi}
                            usePropName={item.usePropName}
                            queryString={queryString}
                            optionsIsEmpty={optionsIsEmpty}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "textarea":
                    formItem = (
                        <InputText
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            error={error}
                            onChange={onChangeHandler}
                            disabled={disabled}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "date_time":
                    formItem = (
                        <InputDateTime
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            error={error}
                            onChange={onChangeHandler}
                            disabled={disabled}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "date":
                    formItem = (
                        <InputDate
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            error={error}
                            onChange={onChangeHandler}
                            disabled={disabled}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "multiple_images_one":
                    formItem = (
                        <InputMultipleImagesOne
                            label={item.field_name}
                            list={Array.isArray(value) ? value : []}
                            name={item.prop_name}
                            isArray={item?.ui_prop?.fileUpload?.isArray ?? isArray}
                            uploadHandler={item?.uploadHandler}
                            deleteHandler={item?.deleteHandler}
                            handleReorder={item?.handleReorder}
                            onChangeHandler={onChangeHandler}
                            ui_prop={item?.ui_prop}
                            allowedFileTypes={allowedFileTypes ?? item?.ui_prop?.fileUpload?.allow_format}
                            autoFocus={autoFocus}
                            description={item.description}
                            validate={item.validate}
                            images={item.images && item.images !== undefined ? item.images : null}
                            additionalData={item?.additionalData}
                        />
                    );
                    break;
                case "multiple_images":
                    formItem = (
                        <InputMultipleImages
                            label={item.field_name}
                            isArray={item?.ui_prop?.fileUpload?.isArray ?? isArray}
                            list={Array.isArray(value) ? value : []}
                            name={item.prop_name}
                            uploadHandler={item?.uploadHandler}
                            deleteHandler={item?.deleteHandler}
                            handleReorder={item?.handleReorder}
                            onChangeHandler={onChangeHandler}
                            accept={allowedFileTypes ?? item?.ui_prop?.fileUpload ?? item?.validate?.imageUpload}
                            autoFocus={autoFocus}
                            apiPathCrop={apiPathCrop}
                            description={item.description}
                            validate={item.validate}
                            images={item.images && item.images !== undefined ? item.images : null}
                        />
                    );
                    break;
                case "multiple_files": //TODO
                    formItem = (
                        <InputMultipleFiles
                            list={Array.isArray(value) ? value : []}
                            name={item.prop_name}
                            onChangeHandler={onChangeHandler}
                            autoFocus={autoFocus}
                            validate={item.validate}
                            images={item.images && item.images !== undefined ? item.images : null}
                            description={item.description}
                        />
                    );
                    break;
                case "file_button":
                    formItem = (
                        <FileButton
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            error={error}
                            onImageUpload={onImageUpload}
                            onOpenImageDialog={onOpenImageDialog}
                            disabled={disabled}
                            autoFocus={autoFocus}
                        />
                    );
                    break;
                case "number":
                    formItem = (
                        <InputNumber
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            error={error}
                            onChange={onChangeHandler}
                            disabled={disabled}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "html_editor":
                    formItem = (
                        <InputHtml
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            error={error}
                            onChange={onChangeHandler}
                            disabled={disabled}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "password":
                    formItem = (
                        <InputInput
                            type="password"
                            name={item.prop_name}
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            description={item.description}
                            value={value}
                            error={error}
                            onChange={onChangeHandler}
                            disabled={disabled}
                            autoFocus={autoFocus}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "import_picker":
                    formItem = (
                        <ImportPicker
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            error={error}
                            disabled={disabled}
                            importPickerMessage={item.picker_message ? item.picker_message : "Kliknite ovde kako biste odabrali fajl za import."}
                            onFilePicked={onFilePicked}
                            value={value}
                            description={item.description}
                            selectedFile={selectedFile}
                            uiProp={item?.ui_prop}
                        />
                    );
                    break;
                case "file_picker":
                    formItem = (
                        <FilePicker
                            label={item.field_name}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            error={error}
                            disabled={disabled}
                            importPickerMessage={item.picker_message ? item.picker_message : "Kliknite ovde kako biste odabrali fajl za import."}
                            onFilePicked={onFilePicked}
                            value={value}
                            description={item.description}
                            selectedFile={selectedFile}
                            uiProp={item?.ui_prop}
                            multipleFileSelection={item?.multipleFileSelection}
                            handleRemoveFile={handleRemoveFile}
                        />
                    );
                    break;
                case "slider":
                    formItem = (
                        <Slider
                            label={item.field_name}
                            name={item.prop_name}
                            disabled={disabled}
                            error={error}
                            required={typeof item.required === "number" ? item.required === 1 : item.required}
                            sliderOptions={item.sliderOptions}
                            dataFromServer={dataFromServer}
                        />
                    );
                    break;
                default:
                    formItem = null;
            }
        }
    }
    return formItem;
};

export default CreateForm;
