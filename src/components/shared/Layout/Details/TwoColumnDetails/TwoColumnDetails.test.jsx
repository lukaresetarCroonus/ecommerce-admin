import React from "react";

import { shallow } from "enzyme";

import TwoColumnDetails from "./TwoColumnDetails";

describe("<TwoColumnDetails />", () => {
  it("should render successfully", async () => {
    const wrapper = shallow(<TwoColumnDetails />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
});
