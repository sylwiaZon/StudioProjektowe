import React from "react";
import TestRenderer from "react-test-renderer";

import GameSettings from "../components/GameSettings.jsx";
describe("Game Settings", () => {
	const component = TestRenderer.create(<GameSettings />).root;    
    const instance = component.instance;

 test("testing round number ", () => {
   
   instance.setState({roundNumber:0})
   expect(instance.state.correctData).toBe(false)
    instance.setState({roundNumber:5})
    expect(instance.state.correctData).toBe(true)
});
 test("testing round time ",() => {
    instance.setState({roundMinute:0})
    for (let i = 0; i < 30; i += 1){
    	instance.setState({roundSeconds: i})
    	expect(instance.state.correctData).toBe(false)
    }
    for (let i = 30; i < 60; i += 1){
    	instance.setState({roundSeconds: i})
    	expect(instance.state.correctData).toBe(true)
    }
    for (let i = 60; i < 120; i += 1){
    	instance.setState({roundSeconds: i})
    	expect(instance.state.correctData).toBe(false)
    }
    instance.setState({roundMinute:12})
    for (let i = 0; i < 60; i += 1){
    	instance.setState({roundSeconds: i})
    	expect(instance.state.correctData).toBe(true)
    }
   	for (let i = 60; i < 120; i += 1){
    	instance.setState({roundSeconds: i})
    	expect(instance.state.correctData).toBe(false)
    }
     instance.setState({roundMinute:"a12"})
     expect(instance.state.correctData).toBe(false)

  });

 test("testing only digits inputs", () => {
   const rounds = component.findByProps({className: "settingsInput"})

   rounds.props.onChange({target:{value:'lalala'}});
   rounds.props.onKeyUp({keyCode: 'lalala'.charCodeAt(0)})
   expect(instance.state.roundNumber).toBe('');

   const minute = component.findAllByProps({className: "timeInput"})[0]
   const second = component.findAllByProps({className: "timeInput"})[1]
   minute.props.onChange({target:{value:'lalala'}});
   minute.props.onKeyUp({keyCode: 'lalala'.charCodeAt(0)})
   second.props.onChange({target:{value:'lalala'}});
   second.props.onKeyUp({keyCode: 'lalala'.charCodeAt(0)})
   expect(instance.state.roundMinute).toBe('');
   expect(instance.state.roundSeconds).toBe('');
    expect(instance.state.correctData).toBe(false)
});
});