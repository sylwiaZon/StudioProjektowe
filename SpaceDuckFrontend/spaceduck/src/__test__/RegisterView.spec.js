import React from "react";
import TestRenderer from "react-test-renderer";

import RegisterView from "../Views/RegisterView.jsx";
describe("Login View", () => {
	const component = TestRenderer.create(<RegisterView />).root;    
    const instance = component.instance;

test("testing register inputs", () => {
	const button = component.findByProps({type:"submit"});
	expect(button.props.disabled).toBe("true");
	const login = component.findByProps({placeholder: "login"})
	login.props.onChange({target: {value: "test"}});
	expect(instance.state.name).toBe(login.props.value);
	const mail = component.findByProps({placeholder: "email"})
	mail.props.onChange({target: {value: "test@test.pl"}});
	expect(instance.state.mail).toBe(mail.props.value);
	expect(instance.state.correctEmail).toBe(true);
	const password = component.findByProps({placeholder: "hasło"})
	password.props.onChange({target: {value: "abc"}});
	expect(instance.state.correctPassword).toBe(false);
	password.props.onChange({target: {value: "zaq1@WSX"}});
	expect(instance.state.correctPassword).toBe(true);
    const passwordRepeated = component.findByProps({placeholder: "powtórz hasło"})
	passwordRepeated.props.onChange({target: {value: "abc"}});
	expect(instance.state.correctRepeatedPassword).toBe(false);
	passwordRepeated.props.onChange({target: {value: "zaq1@WSX2"}});
	expect(instance.state.correctRepeatedPassword).toBe(false);
	expect(instance.state.correctData).toBe(false)
	passwordRepeated.props.onChange({target: {value: "zaq1@WSX"}});
	expect(instance.state.correctRepeatedPassword).toBe(true);
	expect(instance.state.repeatedPassword).toBe(instance.state.password);
	expect(instance.state.correctData).toBe(true)
    expect(button.props.enabled).toBe("true");
  });
});