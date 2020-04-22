import React from "react";
import TestRenderer from "react-test-renderer";
import ChangePasswordView from "../Views/ChangePasswordView.jsx";

describe("Change Password View", () => {

	let component;
	let instance;
	let oldPassword;
	let newPassword;

	beforeEach(()=>{
		component = TestRenderer.create(<ChangePasswordView />).root; 
		instance = component.instance;
		oldPassword = component.findByProps({placeholder: "stare hasło"});
		newPassword = component.findByProps({placeholder: "nowe hasło"});   
    });
    

    
    test("testing new password", () => {
        newPassword.props.onChange({target: {value: "test"}});
        expect(instance.state.newPassword).toBe(newPassword.props.value);
        
    });

    test("testing password", () => {
        oldPassword.props.onChange({target: {value: "test1"}});
        expect(instance.state.oldPassword).toBe(oldPassword.props.value);
        
    });

	describe("new password",()=>{
		describe("string password",()=>{
			test("incorrect",()=>{
				newPassword.props.onChange({target: {value: "abcde"}});
                expect(instance.state.correctNewPassword).toBe(false);
			});
		
			test("correct", ()=>{
				newPassword.props.onChange({target: {value: "zaq1@WSX"}});
				expect(instance.state.correctNewPassword).toBe(true);
			});
		});

	});
    
    test("incorrect date - disable button", ()=>{
		const button = component.findByProps({type:"submit"});
		expect(button.props.disabled).toBe("true");
    });
    
    test("enable button", ()=>{
		newPassword.props.onChange({target: {value: "zaq1@WSX"}});
		oldPassword.props.onChange({target: {value: "zaq2@WSX"}});
		const button = component.findByProps({type:"submit"});
		expect(button.props.enabled).toBe("true");
	});
});