import React from "react";
import TestRenderer from "react-test-renderer";

import Islands from "../Views/IslandsView.jsx";
describe("Islands View", () => {
	const component = TestRenderer.create(<Islands />).root;    
    const instance = component.instance;

test("setting  proper title", () => {
    expect(instance.state.title).toBe("Wybierz grę");
    const container = component.findByProps({className: "islands"});
    const islands = container.findAllByType("a");
    expect(islands.length).toBe(4)
    for(let i = 0; i<islands.length ;i++){
    
    	islands[i].parent.props.onMouseOver();
    	
    	switch(i){
    		case 0:
    			expect(instance.state.title).toBe("Kalambury");
    			break
    		case 1:
    			expect(instance.state.title).toBe("Szachy");
    			break
    		case 2:
    			expect(instance.state.title).toBe("Statki");
    			break
    		case 3:
    			expect(instance.state.title).toBe("Chińczyk");
    			break
    	}
    	 islands[i].parent.props.onMouseOut();
         expect(instance.state.title).toBe("Wybierz grę");
    }
  
  });
});