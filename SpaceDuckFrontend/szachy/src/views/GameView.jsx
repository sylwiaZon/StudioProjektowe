import React from 'react';
import Header from '../components/Header.jsx'
import GameScreen from '../components/GameScreen.jsx'

import './game-styles.css'
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Game extends React.Component{
	constructor(){
		super();

		this.state = {
			tableId: ''
		}
	}

	componentDidMount() {
		this.setState({tableId: cookies.get('currentTable').id})
	}

	onTableSet = (tableId) => {
		this.setState({tableId: tableId});
	}

	render(){
		return(
			<div className="app">
           		 <Header/>
           		 <div className="szachy-header"><h1>Szachy <span>#{this.state.tableId}</span></h1></div>
           		 <GameScreen onTableSet={this.onTableSet}/>
           	</div>
			)
	}

}
export default Game;