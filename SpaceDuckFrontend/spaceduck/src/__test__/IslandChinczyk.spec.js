import React from "react";
import TestRenderer from "react-test-renderer";

import IslandChinczyk from "../components/IslandChinczyk.jsx";
describe("Island Chinczyk", () => {
	const component = TestRenderer.create(<IslandChinczyk />).root;    
    const instance = component.instance;

test("testing hover", () => {
    expect(instance.state.hover).toBe(false);
    const img = component.findByProps({className: "grid-box"})
    img.props.onMouseOver();
     expect(instance.state.hover).toBe(true);
     img.props.onMouseOut();
     expect(instance.state.hover).toBe(false);
  
  });
});