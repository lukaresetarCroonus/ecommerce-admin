import React from "react";
import SearchableListForm from "../../../../../../components/shared/Form/SearchableListForm/SearchableListForm";

const CampaignList = ({
  selected,
  onChange,
  data,
  inputType
}) => {

  const onChangeHandler = (value) => {
    let arr = [...value];
    arr = arr.map((item) => {
      let name = data?.available.find(e => e.id === item)?.name;
      return { id: item, name }
    })
    onChange(arr);
  }

  return (
    <SearchableListForm
      available={data?.available}
      sx={{ display: 'none' }}
      selected={(selected ?? []).map((item) => item.id)}
      onChange={onChangeHandler}
      selectOne={inputType === "select"}
    />
  );
};

export default CampaignList;
