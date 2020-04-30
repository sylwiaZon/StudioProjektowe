import React from 'react';
import UserPanel from './UserPanel.jsx'
import ChessBoard from './ChessBoard.jsx'
class GameScreen extends React.Component{
	constructor(){
		super();
		this.state = {
			message: '',


		}
		this.handleMessage = this.handleMessage.bind(this)
		this.handleSendMessage = this.handleSendMessage.bind(this);
		
		}
		
	handleMessage(event){
		this.setState({message:event.target.value});
	}
	handleSendMessage(event){
		if(event.keyCode==13){
			this.setState({message:''});
			console.log('sending message')

		}
	}

	
	render(){
		
		return(
			<div className="gameScreen"> 
				
					<div className="game-container">
						<div className="players-list">
							<div className="player1">
								<div className="player">
								<UserPanel {...{
									userName: 'kaczka69',
									points: 123,
									panelType: 1,
									active: true // obecny gracz

								}}/>
								</div>
								<div className="playerTime">1:30</div>
							</div>
							<div className="player2">
								<div className="player">
								<UserPanel {...{
									userName: 'kalambury09865346',
									points: 123,
									panelType: 2

								}}/>
								</div>
								<div className="playerTime">0:00</div>
							</div>
							<div className="game-control">
								<button className="game-control-button">
									Remis
								</button>
								<button className="game-control-button">
									Rezygnacja
								</button>
							</div>
						</div>
						<div className="main-game"> 

						<ChessBoard />

						</div>
						<div className="game-chat">
							<div className="messages">messages messages</div>
							<input type="text" className="chat-input" onChange={this.handleMessage} onKeyUp={this.handleSendMessage} value={this.state.message}/>
						</div>

				</div>
			</div>
		
			)
	}

}
export default GameScreen;