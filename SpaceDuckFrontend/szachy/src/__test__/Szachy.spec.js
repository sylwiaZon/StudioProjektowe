import React from "react";
import TestRenderer from "react-test-renderer";
import Szachy from "../views/Szachy.jsx";
import ErrorInfo from "../components/ErrorInfo.jsx";

describe("Main View", () => {
	 const component = TestRenderer.create(<Szachy />).root;
	 const instance = component.instance;
  test("testing init", () => {
      expect(instance.state.instructionPopup).toBe(false);
    });
  test("testing instruction popup", () => {
	  instance.setState({instructionPopup:true})
    expect(component.findByProps({className: "instructionPopup"}))
  });
  describe("Server connection",()=>{
    test("cannot connect to server",()=>{
        instance.setState({errorInfo:true})
        expect(component.findByProps({className: "errorInfo"}))
      });
    test("connected to server", ()=>{
        instance.setState({errorInfo:false})
        const error = component.findAllByProps({className: "errorInfo"});
        expect(error).toStrictEqual([]);
     })
   })
});