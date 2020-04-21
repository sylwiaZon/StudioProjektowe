import React from "react";
import TestRenderer from "react-test-renderer";

import IslandStatki from "../components/IslandStatki.jsx";
describe("Island Szachy", () => {
	const component = TestRenderer.create(<IslandStatki />).root;    
    const instance = component.instance;
 const img = component.findByProps({className: "grid-box"})
    test("testing hover init", () => {
        expect(instance.state.hover).toBe(false);
    })
    test("testing hover, mouse over", ()=>{
         img.props.onMouseOver();
         expect(instance.state.hover).toBe(true);
    })
    test("testing hover, mouse out", () => {
        img.props.onMouseOut();
         expect(instance.state.hover).toBe(false);
    })
});