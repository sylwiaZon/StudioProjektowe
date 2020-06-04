import React from "react";
import TestRenderer from "react-test-renderer";

import GameSettings from "../components/GameSettings.jsx";
describe("Game Settings", () => {
	const component = TestRenderer.create(<GameSettings />).root;    
    const instance = component.instance;
	
 
	describe("Round Time ",() => {
		instance.setState({isPrivate:false});
		
		const minute = component.findAllByProps({className: "timeInput"})[0]
		const second = component.findAllByProps({className: "timeInput"})[1]

		test("0minutes and less than 30seconds ",() => {
			instance.setState({roundMinute:0, roundSeconds:29})
			expect(instance.state.correctData).toBe(false)
		});

		test("more than 59seconds ",() => {
			instance.setState({roundSeconds:60})
			expect(instance.state.correctData).toBe(false)
		});
		
		test("0minutes correct number of seconds ",() => {
			instance.setState({roundMinute:0,roundSeconds:30})
			expect(instance.state.correctData).toBe(true)
		});
		
		test("more than minute ",() => {
			instance.setState({roundMinute:1,roundSeconds:1})
			expect(instance.state.correctData).toBe(true)
		});

		describe("digits inputs",()=>{

	
			test("testing only digits inputs - minutes", () => {
				minute.props.onChange({target:{value:'text'}});
				minute.props.onKeyUp({keyCode: 'text'.charCodeAt(0)})
				expect(instance.state.roundMinute).toBe('');
			});
	
			test("testing only digits inputs - seconds", () => {
				second.props.onChange({target:{value:'text'}});
				second.props.onKeyUp({keyCode: 'text'.charCodeAt(0)})
				expect(instance.state.roundSeconds).toBe('');
			});
		});
	});
	describe("Private game",()=>{
		test("show password tile",()=>{
			instance.setState({isPrivate:true});
			const pass = component.findAllByProps({className: "settingsTile publicTable"});
		    expect(pass).toStrictEqual([]);
		})
		test("hide password tile",()=>{
			instance.setState({isPrivate:false});
		    expect(component.findByProps({className: "settingsTile publicTable"}))
		})
	})
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