import React from "react";
import TestRenderer from "react-test-renderer";

import GameSettings from "../components/GameSettings.jsx";
describe("Game Settings", () => {
	const component = TestRenderer.create(<GameSettings />).root;    
    const instance = component.instance;
describe("Round Number ",() => {
	test("round number 0 ", () => {
	   
	   instance.setState({roundNumber:0})
	   expect(instance.state.correctData).toBe(false)
	    
	});
	test("round number not 0 ", () => {
   
	   
	    instance.setState({roundNumber:5})
	    expect(instance.state.correctData).toBe(true)
	});
})
 describe("Round Time ",() => {
	test("testing round time, 0minutes and less than 30seconds ",() => {
    	instance.setState({roundMinute:0, roundSeconds:29})
    	expect(instance.state.correctData).toBe(false)
    })
    test("testing round time, more than 59seconds ",() => {
    	instance.setState({roundSeconds:60})
    	expect(instance.state.correctData).toBe(false)
    })
    test("testing round time,0minutes correct number of seconds ",() => {
    	instance.setState({roundMinute:0,roundSeconds:30})
    	expect(instance.state.correctData).toBe(true)
    })
    test("testing round time,more than minute ",() => {
    	instance.setState({roundMinute:1,roundSeconds:1})
    	expect(instance.state.correctData).toBe(true)
    })
   
})
 
describe("Round Time ",() => {
	const rounds = component.findByProps({className: "settingsInput"})
	const minute = component.findAllByProps({className: "timeInput"})[0]
	 const second = component.findAllByProps({className: "timeInput"})[1]
	 test("testing only digits inputs - round number", () => {
	  
	   rounds.props.onChange({target:{value:'lalala'}});
	   rounds.props.onKeyUp({keyCode: 'lalala'.charCodeAt(0)})
	   expect(instance.state.roundNumber).toBe('');
	})
	 test("testing only digits inputs - minutes", () => {
	  
	  minute.props.onChange({target:{value:'lalala'}});
	   minute.props.onKeyUp({keyCode: 'lalala'.charCodeAt(0)})
	   expect(instance.state.roundMinute).toBe('');
	})
	 test("testing only digits inputs - seconds", () => {
	  
	  second.props.onChange({target:{value:'lalala'}});
	   second.props.onKeyUp({keyCode: 'lalala'.charCodeAt(0)})
	  
	   expect(instance.state.roundSeconds).toBe('');
	})

	   

});
});