import React from "react";
import TestRenderer from "react-test-renderer";

import IslandChinczyk from "../components/IslandChinczyk.jsx";
describe("Island Chinczyk", () => {
	const component = TestRenderer.create(<IslandChinczyk />).root;    
    const instance = component.instance;
    const img = component.findByProps({className: "grid-box"})
    
    describe("hover", ()=>{
        test("init", () => {
            expect(instance.state.hover).toBe(false);
        });
        
        test("mouse over", ()=>{
             img.props.onMouseOver();
             expect(instance.state.hover).toBe(true);
        });
    
        test("mouse out", () => {
            img.props.onMouseOut();
             expect(instance.state.hover).toBe(false);
        });
    });
    
});