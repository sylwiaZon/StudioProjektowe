import React from "react";
import TestRenderer from "react-test-renderer";
import GameScreen from "../components/GameScreen.jsx";

describe("Game Screen", () => {
	const component = TestRenderer.create(<GameScreen />).root;    
    const instance = component.instance;

  test("sending message - chat", () => {
   	expect(instance.state.message).toBe('')
  	const chatInput = component.findByProps({className: "chat-input"})
  	chatInput.props.onChange({target: {value: "To jest wiadomość"}})
  	expect(instance.state.message).toBe('To jest wiadomość');
  	chatInput.props.onKeyUp({keyCode: 13}) //enter ascii code
  	expect(instance.state.message).toBe(''); 
  });
  test("clear board", () => {
  	instance.setState({clear: false})
   	const clear = component.findByProps({className: "color clear"});
   	clear.props.onClick();
   	expect(instance.state.clear).toBe(true)

  });
  test("show settings", () => {
  	instance.setState({settings: true})
  	expect(component.findByProps({className: "settings-container"}))
  });
   test("show properly key", () => {
   	instance.setState({settings: true, privateTable:true})

  	const button = component.findByType("button");
  	button.props.onClick();
  	expect(instance.state.settings).toBe(false)
  	const key = component.findByProps({className:"settings-container"})
  	const keyValue = key.findAllByType("h3")[0];
  	expect(instance.state.key).toBe(keyValue.props.children)
  });
   test("change brush color", () => {
  	
   	const colors = component.findAllByProps({className: "color"});
   	for( let i =0; i<colors.lenght; i++){
   		colors[i].props.onClick();
    	expect(instance.state.color).toBe(colors[i].props.style.background)
   	}
   	
  });
   
});