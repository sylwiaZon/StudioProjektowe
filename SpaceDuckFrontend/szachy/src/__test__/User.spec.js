import React from "react";
import TestRenderer from "react-test-renderer";

import UserPanel from "../components/UserPanel.jsx";
describe("Players", () => {
	const component = TestRenderer.create(<UserPanel {...{
					userName: "test",
					points: 123,
					panelType: 1,
				}}/>).root;    
	const instance = component.instance;

	test("check name", () => {
  	const player = component.findByProps({className:"userName"})
  	expect(component.props.userName).toBe(player.props.children)
  });

	test("check point", () => {
  	const player = component.findByProps({className:"userPoints"})
  	expect(component.props.points).toBe(player.props.children)
	});
	
	test("admin panel", () => {
		const component = TestRenderer.create(<UserPanel {...{userName: "test",
					points: 123,
					panelType: 1, adminView: true}}/>).root;    
  	expect(component.findByProps({className:"removeUser"}))
  });

})