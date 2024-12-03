import React from "react";

import { shallow } from "enzyme";

import ListTable from "./ListTable";

const mockFields = [
  {
    field_name: "Naslov stranice",
    prop_name: "name",
    in_main_table: true,
    in_details: true,
    editable: true,
    disabled: false,
    required: true,
    description:
      "Maximum file size: 2MB, Allowed file types: Not all browsers support all these formats!",
    ui_prop: "xyz",
    sortable: true,
    input_type: "input",
  },
  {
    field_name: "Neki button",
    prop_name: "fake",
    in_main_table: true,
    in_details: true,
    editable: true,
    disabled: false,
    required: true,
    description:
      "Maximum file size: 2MB, Allowed file types: Not all browsers support all these formats!",
    ui_prop: "xyz",
    sortable: true,
    input_type: "edit_icon",
  },
];

const mockData = [
  {
    id: 0,
    name: "Vizuelna podesavanja portala",
    b2b: "b2b",
    image_logo: "image_logo",
    key_word: "kljucne reci",
  },
];

describe("<ListTable />", () => {
  it("should render successfully", async () => {
    const wrapper = shallow(<ListTable />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
  it("should render with fields successfully", async () => {
    const wrapper = shallow(<ListTable fields={mockFields} data={mockData} />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
});
