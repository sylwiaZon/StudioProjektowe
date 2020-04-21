import React from "react";
import TestRenderer from "react-test-renderer";

import Islands from "../Views/IslandsView.jsx";
describe("Islands View", () => {
	const component = TestRenderer.create(<Islands />).root;    
    const instance = component.instance;
    const container = component.findByProps({className: "islands"});
    const islands = container.findAllByType("a");
	test("init test", ()=>{
		 expect(instance.state.title).toBe("Wybierz grę");
	})
	test("setting  proper title - kalambury", () => {
	   	let i = 0;
	    islands[i].parent.props.onMouseOver();
	   expect(instance.state.title).toBe("Kalambury");
	});
	test("setting  proper title - szachy", () => {
	   	let i = 1;
	    islands[i].parent.props.onMouseOver();
	   expect(instance.state.title).toBe("Szachy");
	});
	test("setting  proper title - statki", () => {
	   	let i = 2;
	    islands[i].parent.props.onMouseOver();
	   expect(instance.state.title).toBe("Statki");
	});
    test("setting  proper title - chinczyk", () => {
	   	let i = 3;
	    islands[i].parent.props.onMouseOver();
	   expect(instance.state.title).toBe("Chińczyk");
	});	
    		
    test("mouse out of islands", ()=>{
    	 islands[2].parent.props.onMouseOut();
         expect(instance.state.title).toBe("Wybierz grę");
    })	


});