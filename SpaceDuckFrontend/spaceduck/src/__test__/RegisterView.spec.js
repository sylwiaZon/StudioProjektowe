import React from "react";
import TestRenderer from "react-test-renderer";

import RegisterView from "../Views/RegisterView.jsx";
describe("Login View", () => {
	const component = TestRenderer.create(<RegisterView />).root;    
	const instance = component.instance;
	const login = component.findByProps({placeholder: "login"});
	const mail = component.findByProps({placeholder: "email"});
	const password = component.findByProps({placeholder: "hasło"});
	const passwordRepeated = component.findByProps({placeholder: "powtórz hasło"});

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
			expect(instance.state.correctRepeatedPassword).toBe(true);
		});
	
		test("same passwords", () => {
			expect(instance.state.repeatedPassword).toBe(instance.state.password);
		});
	});

	test("correct date - enable button", ()=>{
		const button = component.findByProps({type:"submit"});
		expect(button.props.enabled).toBe("true");
	});
});