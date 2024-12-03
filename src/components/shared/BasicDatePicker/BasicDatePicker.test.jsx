import React from "react";

import { shallow } from "enzyme";

import BasicDatePicker from "./BasicDatePicker";

describe("<BasicDatePicker />", () => {
  it("should render successfully", async () => {
    const wrapper = shallow(<BasicDatePicker />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
});
