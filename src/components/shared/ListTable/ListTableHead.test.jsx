import React from "react";

import { shallow } from "enzyme";

import ListTableHead from "./ListTableHead";

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
];

describe("<ListTableHead />", () => {
  it("should render successfully", async () => {
    const wrapper = shallow(<ListTableHead />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
  it("should render with fields successfully", async () => {
    const wrapper = shallow(<ListTableHead fields={mockFields} />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
});
