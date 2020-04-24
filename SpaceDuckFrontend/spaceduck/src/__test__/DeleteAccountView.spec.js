import React from "react";
import TestRenderer from "react-test-renderer";

import DeleteAccountView from "../Views/DeleteAccountView.jsx";
describe("Delete Account View", () => {
	const component = TestRenderer.create(<DeleteAccountView />).root;    
    const instance = component.instance;

	test("testing password", () => {
		const password = component.findByProps({placeholder: "hasło"})
		password.props.onChange({target: {value: "test"}});
		expect(instance.state.password).toBe(password.props.value);
		
	});
	
});