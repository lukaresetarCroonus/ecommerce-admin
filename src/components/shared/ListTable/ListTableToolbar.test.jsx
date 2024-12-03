import React from "react";

import { shallow } from "enzyme";

import ListTableToolbar from "./ListTableToolbar";

describe("<ListTableToolbar />", () => {
  it("should render successfully", async () => {
    const wrapper = shallow(<ListTableToolbar />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
});
