import React from "react";

import { shallow } from "enzyme";

import DetailsBasic from "./DetailsBasic";

describe("<DetailsBasic />", () => {
  it("should render successfully", async () => {
    const wrapper = shallow(<DetailsBasic />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
});
