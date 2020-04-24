import React from "react";
import TestRenderer from "react-test-renderer";

import IslandChinczyk from "../components/IslandChinczyk.jsx";
describe("Island Chinczyk", () => {
	let component;
    let instance;
    let img;
    beforeEach(()=>{
        component = TestRenderer.create(<IslandChinczyk />).root;    
        instance = component.instance;
        img = component.findByProps({className: "grid-box"})
    })
    
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