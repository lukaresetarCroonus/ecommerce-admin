import React from "react";

import { shallow } from "enzyme";

import CreateForm from "./CreateForm";

const mockInputItem = {
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
};

const mockCheckbox = {
  field_name: "Naslov checkbox",
  prop_name: "checkbox",
  editable: true,
  input_type: "checkbox",
};

const mockRadio = {
  field_name: "Naslov radio",
  prop_name: "radio",
  editable: true,
  input_type: "radio",
};

const mockDropdown = {
  field_name: "Naslov dropdown",
  prop_name: "dropdown",
  editable: true,
  input_type: "dropdown",
};

describe("<CreateForm />", () => {
  it("should render successfully", async () => {
    const wrapper = shallow(<CreateForm />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
  it("should render input item successfully", async () => {
    const wrapper = shallow(<CreateForm item={mockInputItem} />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
  it("should render checkbox item successfully", async () => {
    const wrapper = shallow(<CreateForm item={mockCheckbox} />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
  it("should render radio item successfully", async () => {
    const wrapper = shallow(<CreateForm item={mockRadio} />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
  it("should render dropdown item successfully", async () => {
    const wrapper = shallow(<CreateForm item={mockDropdown} />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
  it("should render textarea item successfully", async () => {
    const fakeItem = {
      field_name: "Naslov textarea",
      prop_name: "textarea",
      editable: true,
      input_type: "textarea",
    };
    const wrapper = shallow(<CreateForm item={fakeItem} />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
  it("should render successfully all fields", async () => {
    const fakeItem = [
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
        field_name: "Naslov checkbox",
        prop_name: "checkbox",
        input_type: "checkbox",
      },
    ];

    const errors = [
      {
        field_name: "Naslov stranice",
        prop_name: "name",
        in_main_table: true,
        editable: true,
        input_type: "input",
        required: true,
      },
      {
        field_name: "checkbox fake",
        prop_name: "checkbox",
        in_main_table: true,
        editable: true,
        input_type: "input",
      },
    ];

    const someValue = "string";

    const wrapper = shallow(
      <CreateForm value={someValue} item={fakeItem} error={errors} />
    );
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
});
