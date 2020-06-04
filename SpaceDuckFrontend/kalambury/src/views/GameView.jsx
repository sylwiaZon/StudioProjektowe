import React from 'react';
import Header from '../components/Header.jsx'
import GameScreen from '../components/GameScreen.jsx'

import './game-styles.css'
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Game extends React.Component{
	constructor(){
		super();

	}

	render(){
		return(
			<div className="app">
           		 <Header/>
           		 <div className="kalambury-header"><h1>Kalambury <span>#{cookies.get('currentTable').id}</span></h1></div>
           		 <GameScreen />
           	</div>
			)
	}

}
export default Game;