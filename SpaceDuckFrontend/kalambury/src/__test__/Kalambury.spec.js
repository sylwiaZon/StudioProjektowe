import React from "react";
import TestRenderer from "react-test-renderer";
import Kalambury from "../views/Kalambury.jsx";

describe("Main View", () => {
  test("testing instruction popup", () => {
    const component = TestRenderer.create(<Kalambury />).root;
    
   const instance = component.instance;
    expect(instance.state.instructionPopup).toBe(false);
    
  instance.setState({instructionPopup:true})

expect(component.findByProps({className: "instructionPopup"}))

  });
  test("testing guest panel", () => {
    const component = TestRenderer.create(<Kalambury />).root;
    
   const instance = component.instance;
  
 	 expect(instance.state.guest).toBe(false);
   instance.setState({guest:true})
     expect(component.findByProps({className: "asGuest"}))
  });
});