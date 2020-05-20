import React from "react";
import TestRenderer from "react-test-renderer";
import Tables from "../views/TablesView.jsx";

describe("Tables View", () => {
	const component = TestRenderer.create(<Tables />).root;    
    const instance = component.instance;
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
})