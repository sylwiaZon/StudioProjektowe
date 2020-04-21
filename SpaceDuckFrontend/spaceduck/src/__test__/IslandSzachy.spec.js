import React from "react";
import TestRenderer from "react-test-renderer";

import IslandSzachy from "../components/IslandSzachy.jsx";
describe("Island Szachy", () => {
	const component = TestRenderer.create(<IslandSzachy />).root;    
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