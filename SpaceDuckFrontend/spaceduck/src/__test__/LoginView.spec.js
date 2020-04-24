import React from "react";
import TestRenderer from "react-test-renderer";

import LoginView from "../Views/LoginView.jsx";
describe("Login View", () => {
	let component;
	let instance;
	let login;
	let password;
	beforeEach(()=>{
		component = TestRenderer.create(<LoginView />).root; 
		instance = component.instance;
		login = component.findByProps({placeholder: "login/email"})
		password = component.findByProps({placeholder: "hasło"})
	});
	
	test("testing login/email", () => {
		login.props.onChange({target: {value: "test"}});
		expect(instance.state.name).toBe(login.props.value);
	});
	
	test("testing password", () => {
		password.props.onChange({target: {value: "test"}});
		expect(instance.state.password).toBe(password.props.value);
	});
});