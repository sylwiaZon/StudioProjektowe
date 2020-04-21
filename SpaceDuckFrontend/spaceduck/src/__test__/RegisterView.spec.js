import React from "react";
import TestRenderer from "react-test-renderer";
import RegisterView from "../Views/RegisterView.jsx";

describe("Register View", () => {

	let component;
	let instance;
	let login;
	let mail;
	let password;
	let passwordRepeated;

	beforeEach(()=>{
		component = TestRenderer.create(<RegisterView />).root; 
		instance = component.instance;
		login = component.findByProps({placeholder: "login"});
		mail = component.findByProps({placeholder: "email"});
		password = component.findByProps({placeholder: "hasło"});
		passwordRepeated = component.findByProps({placeholder: "powtórz hasło"});   
	});

	test("incorrect date - disable button", ()=>{
		const button = component.findByProps({type:"submit"});
		expect(button.props.disabled).toBe("true");
	});

	test("change login value", ()=>{
		
		login.props.onChange({target: {value: "test"}});
		expect(instance.state.name).toBe(login.props.value);
	});

	test("change mail value",()=>{
		mail.props.onChange({target: {value: "test@test.pl"}});
		expect(instance.state.mail).toBe(mail.props.value);
	});

	describe("password",()=>{
		describe("string password",()=>{

			test("incorrect",()=>{
				password.props.onChange({target: {value: "abc"}});
				expect(instance.state.correctPassword).toBe(false);
			});
		
			test("correct", ()=>{
				password.props.onChange({target: {value: "zaq1@WSX"}});
				expect(instance.state.correctPassword).toBe(true);
			});
		});

		describe("different repeated password",()=>{

			test("incorrect validation",()=>{
				passwordRepeated.props.onChange({target: {value: "abc"}});
				expect(instance.state.correctRepeatedPassword).toBe(false);
			});
		
			test("correct validation", () => {
				passwordRepeated.props.onChange({target: {value: "zaq1@WSX2"}});
				expect(instance.state.correctRepeatedPassword).toBe(false);
			});
		});
	
		test("different passwords", () => {
			expect(instance.state.correctData).toBe(false)
		});
	
		test("the same passwords", ()=>{
			passwordRepeated.props.onChange({target: {value: "zaq1@WSX"}});
			password.props.onChange({target: {value: "zaq1@WSX"}});
			expect(instance.state.correctRepeatedPassword).toBe(true);
			expect(instance.state.repeatedPassword).toBe(instance.state.password);
		});
	});

	test("enable button", ()=>{
		login.props.onChange({target: {value: "test"}});
		mail.props.onChange({target: {value: "test@test.pl"}});
		passwordRepeated.props.onChange({target: {value: "zaq1@WSX"}});
		password.props.onChange({target: {value: "zaq1@WSX"}});
		const button = component.findByProps({type:"submit"});
		expect(button.props.enabled).toBe("true");
	});
});