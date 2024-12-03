import React from "react";

import { shallow } from "enzyme";

import TextBoxSingle from "./TextBoxSingle";

describe("<TextBoxSingle />", () => {
    it("should render successfully", async () => {
        const wrapper = shallow(<TextBoxSingle />);
        expect.assertions(1);
        expect(wrapper).toHaveLength(1);
    });
});
