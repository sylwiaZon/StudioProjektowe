import React from "react";
import TestRenderer from "react-test-renderer";

import RegisterView from "../Views/RegisterView.jsx";
describe("Login View", () => {
	const component = TestRenderer.create(<RegisterView />).root;    
    const instance = component.instance;
test("incorrect date - disable button", ()=>{
	const button = component.findByProps({type:"submit"});
	expect(button.props.disabled).toBe("true");
})


const login = component.findByProps({placeholder: "login"})
const mail = component.findByProps({placeholder: "email"})
const password = component.findByProps({placeholder: "hasło"})
const passwordRepeated = component.findByProps({placeholder: "powtórz hasło"})
test("change login value", ()=>{
	
	login.props.onChange({target: {value: "test"}});
	expect(instance.state.name).toBe(login.props.value);
})
test("change mail value",()=>{
	mail.props.onChange({target: {value: "test@test.pl"}});
	expect(instance.state.mail).toBe(mail.props.value);
})

test("strong password value",()=>{
	password.props.onChange({target: {value: "abc"}});
	expect(instance.state.correctPassword).toBe(false);
})
test("strong password value - correct", ()=>{
	password.props.onChange({target: {value: "zaq1@WSX"}});
	expect(instance.state.correctPassword).toBe(true);
})
test("different repeated password",()=>{
	passwordRepeated.props.onChange({target: {value: "abc"}});
	expect(instance.state.correctRepeatedPassword).toBe(false);
})
test("correct repeated password but diffetent", () => {
	passwordRepeated.props.onChange({target: {value: "zaq1@WSX2"}});
	expect(instance.state.correctRepeatedPassword).toBe(false);
})
test("different passwords", () => {
	expect(instance.state.correctData).toBe(false)
})
test("setting repeated password same as first", ()=>{
	passwordRepeated.props.onChange({target: {value: "zaq1@WSX"}});
	expect(instance.state.correctRepeatedPassword).toBe(true);
})
test("same passwords", () => {
	expect(instance.state.repeatedPassword).toBe(instance.state.password);
})

test("correct date - enable button", ()=>{
	const button = component.findByProps({type:"submit"});
	expect(button.props.enabled).toBe("true");
})
});