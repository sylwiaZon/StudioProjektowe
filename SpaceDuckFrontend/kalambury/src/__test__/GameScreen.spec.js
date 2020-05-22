import React from "react";
import TestRenderer from "react-test-renderer";
import GameScreen from "../components/GameScreen.jsx";

describe("Game Screen", () => {
	const component = TestRenderer.create(<GameScreen />).root;    
    const instance = component.instance;

	describe("Chat",()=>{
		test("render with blank input",()=>{
			expect(instance.state.message).toBe('')
		});

		test("input change", ()=>{
			const chatInput = component.findByProps({className: "chat-input"})
			chatInput.props.onChange({target: {value: "To jest wiadomość"}})
			expect(instance.state.message).toBe('To jest wiadomość');
		});

	})
  
  test("clear board", () => {
  	instance.setState({clear: false})
   	const clear = component.findByProps({className: "color clear"});
   	clear.props.onClick();
   	expect(instance.state.clear).toBe(true)

  });
 

   describe("Changing brush color",()=>{
   		const colors = component.findAllByProps({className: "color"});
	    test("change brush color: white", () => {
		  	let i=0;
		   	
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });

	    test("change brush color: fuchsia", () => {
		  	let i=1;
		   	
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });
	    test("change brush color: orange", () => {
		  	let i=2;
		   	
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });
	    test("change brush color: green", () => {
		  	let i=3;
		   	
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });
	    test("change brush color: blue", () => {
			let i=4;
			  
		   	colors[i].props.onClick();
		    expect(instance.state.color).toBe(colors[i].props.style.background)	
	 	 });
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

   describe("correct content", ()=>{
   		test("settings", () => {
		  	instance.setState({table: ''})
		  	expect(component.findByProps({className: "popup-container"}))
		});
		test("owner left game", () => {
			instance.setState({table: 'abc', roomExists:false})
		  	expect(component.findAllByProps({className: "popup-title"})[0].children).toEqual(["Właściciel gry opuścił pokój. "])
		});
		test("waiting for players", () => {
			instance.setState({table: 'abc', roomExists:true,gameStarted:false})
		  	expect(component.findAllByProps({className: "popup-title"})[0].children).toEqual(["Oczekiwanie na innych graczy "])
		});
		test("game finished",()=>{
			instance.setState({table: 'abc', roomExists:true,gameStarted:true,gameFinished:true})
		  	expect(component.findAllByProps({className: "popup-title"})[0].children).toEqual(["Koniec"])
		});
		test("show image", ()=>{
			instance.setState({table: 'abc',roomExists:true,gameStarted:true,gameFinished:false,gameStatus:'' });
			expect(component.findByProps({className:"received-canvas"}))
		});

   })
	

});