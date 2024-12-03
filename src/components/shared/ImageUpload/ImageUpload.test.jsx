import React from "react";

import { shallow } from "enzyme";

import ImageUpload from "./ImageUpload";

describe("<ImageUpload />", () => {
  it("should render successfully", async () => {
    const wrapper = shallow(<ImageUpload />);
    expect.assertions(1);
    expect(wrapper).toHaveLength(1);
  });
});
