import React from "react";

import { shallow } from "enzyme";

import ListTableTitle from "./ListTableTitle";

describe("<ListTableTitle />", () => {
  it("should render successfully", async () => {
    const wrapper = shallow(<ListTableTitle />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
});
