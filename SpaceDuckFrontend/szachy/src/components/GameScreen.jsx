import React from 'react';
import UserPanel from './UserPanel.jsx'
import ChessBoard from './ChessBoard.jsx'
import GameSettings from './GameSettings.jsx'
import EndGamePopup from './EndGamePopup.jsx';
import * as signalR from "@microsoft/signalr";
import Cookies from 'universal-cookie';
import address from '../configuration.json';
import history from '../history.jsx';
import ErrorInfo from './ErrorInfo.jsx';
import './popup-style.css';
const cookies = new Cookies();
class GameScreen extends React.Component{
	constructor(){
		super();
		this.state = {
			message: '',
			table: '',
			privateTable:false,
			message:'',
			privateTable:false,
			keyView:false,
			table: '',
			hubConnection: null,
			user: '',
			messages: [],
			gameStatus: '',
			players: [],
			points: '',
			gameFinished:  false,
			roomExists: true,
			gameStarted: false,
			errorInfo:false,

		}
		this.handleMessage = this.handleMessage.bind(this)
		this.handleSendMessage = this.handleSendMessage.bind(this);
		
		}
		async componentDidMount(){
		var currTable = cookies.get('currentTable');

		if(currTable != ''){
			this.state.table = currTable;
			await this.startGame();
		}
	}
		
	addPoints(){
		
		if(this.state.players != []){
			this.state.players.forEach((plr) => {
				
				if(this.state.points[plr.id] != undefined){
					plr['points'] = this.state.points[plr.id];
				}
			});
		}
		
	}
	async getPlayers(){
		try{
            const response = await fetch('https://'+address.szachyURL+address.room+'/'+this.state.table.id, {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            });

            if(!response.ok){
                throw Error(response.statusText);
            }
			const data = await response.json();
			if(data.players == undefined){
				this.setState({roomExists: false});
			} else {
				this.state.players = await data.players;
				this.addPoints();
			}
			
		} catch(error){
			console.log("getPlayers")
			this.setState({errorInfo: true});
		}
	}
	async startGame(){
		try{
			const startGame = await fetch('https://'+address.szachyURL+address.game+'/'+this.state.table.id,{
				method: 'GET',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json' 
				}
			});

			if(!startGame.ok){
				throw Error(startGame.statusText);
			}
		}catch(Error){
			console.log("startGame")
			this.setState({errorInfo: true});
		}
		this.connectToRoom();
	}
	saveMessages(author, receivedMessage){
		if(receivedMessage !== 'Update status by contexthub.' && receivedMessage !== ''){
			this.state.messages.push({author, receivedMessage});
		}
	}

	async connectToRoom(){
		this.getPlayers();
		var user = cookies.get('user');
		const hubConnection = new signalR.HubConnectionBuilder()
		.withUrl("https://"+address.szachyURL+"/chessHub")
		.configureLogging(signalR.LogLevel.Information)  
		.build();

		
		this.setState({ hubConnection, user }, () => {
			this.state.hubConnection
			.start()
			.then(async () => {
					//if(!this.isCurrentPlayerOwner()){
						this.addToGame();
					//}
					
				//await this.submitForPlaying();
			})
			.catch(err => {console.log('Error while establishing connection :('); this.setState({errorInfo: true});});
	
			this.state.hubConnection.on('ReceiveMessage', (nick, receivedMessage) => {
				this.saveMessages(nick, receivedMessage);
			});

			this.state.hubConnection.on('Send', async (receivedMessage) => {
				await this.getPlayers();
				this.saveMessages('server', receivedMessage);
				if(receivedMessage == 'Koniec gry'){
					this.setState({gameFinished: true});
				}
			});

			this.state.hubConnection.on('GameStatus', (status) => {
				console.log(status);
				this.setState({gameStatus: status});
				this.setState({gameStarted: true});
				
			});

			this.state.hubConnection.on('Points', async (points) => {
				this.state.points = points;
				await this.getPlayers();
				//this.setState({canvas: ''});
				
			});
			this.state.hubConnection.on('Error', async (err) => {
				console.log(err + " --------------- ");
				
			});
		});
	}
	addToGame = () => {
		this.state.hubConnection
		.invoke('AddToGameGroup', `${this.state.table.id}`,this.state.user.id, this.state.user.userName)
		.catch(err => {console.error(err); this.setState({errorInfo: true});});
	}

	sendMessage = () => {
		this.state.hubConnection
		  .invoke('SendMessage', this.state.user.userName, this.state.message)
		  .catch(err => {console.error(err); this.setState({errorInfo: true});});
		  this.setState({message: ''});      
	}

	sendGameStatus = (canvas) => {
		if(this.isCurrentUserDrawing()){
			var body = this.state.gameStatus;
			body.canvas = canvas;
			this.state.hubConnection
			.invoke('SendGameStatus', this.state.table.id+'', body)
			.catch(err => {console.error(err); this.setState({errorInfo: true});});
		}
	}
	handleMessage(event){
		this.setState({message:event.target.value});
	}
	handleSendMessage(event){
		if(event.keyCode==13){
			this.sendMessage();
			this.setState({message:''});
		}
	}

	getTime(){
		if(this.state.table == ''){
			return '';
		}else if(this.state.gameStatus.roundTime == undefined){
			return '';
		}else {
			return parseInt(this.state.table.roomConfiguration.roundDuration,10) - this.state.gameStatus.roundTime;
		}
	}
	isTableSet(){
		return this.state.table !== '';
	}
	handleContinue(table){
		this.setState({table: table});
		cookies.set('currentTable', table, { path: '/' });
		this.startGame();
	}
	isCurrentUserMove(){
		return this.state.gameStatus === '' ? false : this.state.gameStatus.currentPlayerId == cookies.get('user').id;
	}
	async removeRoomAsOwner(){
		var user = cookies.get('user');
        try{
            const response = await fetch('https://'+address.szachyURL+address.room+'/'+this.state.table.id+'/owner/'+user.id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

            const json = await response.json();
            
		} catch(error){
			console.log("removeRoomAsOwner")
			this.setState({errorInfo: true})
		}
	}
	deleteUserFromHub(){
		this.state.hubConnection
		  .invoke('RemoveFromGameGroup', `${this.state.table.id}`, this.state.user.id, this.state.user.userName)
		  .catch(err => {console.error(err);this.setState({errorInfo: true}) });
	}

	resetView(){
		cookies.set('currentTable', '', { path: '/' });
        history.push('/tables');
	}
	isCurrentPlayerOwner(){
		return this.state.user.id == this.state.table.roomConfiguration.playerOwnerId;
	}
	async handleEndGame(){
		await this.removeUserFromRoom();
		this.deleteUserFromHub();
		
		if(this.isCurrentPlayerOwner()){
			
			await this.removeRoomAsOwner();
		}
		this.resetView();
	}
	async restartGame(){
		var user = cookies.get('user');
        try{
            const response = await fetch('https://'+address.szachyURL+address.game+'/'+this.state.table.id+'/restart', {
                method: 'GET',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

            const json = await response.json();
            
		} catch(error){
			console.log("restartGame")
			this.setState({errorInfo: true})
		}
	}
	async removeUserFromRoom(){
		var user = cookies.get('user');
        try{
            const response = await fetch('https://'+address.szachyURL+address.room+'/'+this.state.table.id+'/'+user.id, {
                method: 'DELETE',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json' 
                }
            });

            if(!response.ok){
                throw Error(response.statusText);
            }

            const json = await response.json();
            
		} catch(error){
			console.log("removeUserFromRoom")
			this.setState({errorInfo: true})
		}
	}

	async handleContinueGame(){
		await this.restartGame();
		this.setState({gameFinished: false});
	}

	ownerLeftGame(){
		return 	<div className="popup-container">
					<h2 className="popup-title">Właściciel gry opuścił pokój. </h2>
					<h2 className="popup-title">Koniec gry.</h2>
					<div>
						<button onClick={()=>this.handleEndGame()}>Powrót</button>
					</div>
				</div>
	}

	waitingForPlayers(){
		return 	<div className="popup-container">
					<h2 className="popup-title">Oczekiwanie na innych graczy </h2>
				</div>
	}
	renderScreen(){
		if(this.isTableSet()){
			if(!this.state.roomExists){
				return this.ownerLeftGame();
			}
			else if(!this.state.gameStarted){
				return this.waitingForPlayers();
			}
			else if(this.state.gameFinished){
				return <EndGamePopup 
					players={this.state.players} 
					handleEndGame={()=>this. handleEndGame()}  
					handleContinue={()=>this.handleContinueGame()}
				/>;
			}
			else if(this.isCurrentUserMove()){
				return <ChessBoard /> 
			} else{
				//widok bez ruchow pionkami
				return <ChessBoard /> 
			}
		} else{
			return <GameSettings {...{
							handlePrivateTable: () => {this.setState({privateTable:true})},
							handlePublicTable: () => {this.setState({privateTable:false})},
							continueFunc: (str)=>{this.handleContinue(str)},
							privateTable: this.state.privateTable

						}} />
		}
	}
	renderPlayers(){
		if(this.state.players != undefined){
			return this.state.players.map((plr, index) => 
				
					<div className={"player"+index}>
								<div className="player">
								<UserPanel {...{
									userName: plr.name,
									points: plr.points,
									panelType: index,
									active: true // obecny gracz
								}}/>
								</div>
								<div className="playerTime">1:30</div>
							</div>				
			)
		}
	}
		
	render(){
		
		return(
			<div className="gameScreen"> 
				{this.state.errorInfo ? <ErrorInfo {...{
				visible: ()=>{this.setState({errorInfo:false})}
			}}/> : null}
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
							{this.renderScreen()}
						</div>
						<div className="game-chat">
							<div className="messages">
						<ul>
							{this.state.messages.map(arg => 
								<li key={arg.receivedMessage}>
									<p><span className="message-author">{arg.author}:</span> {arg.receivedMessage}</p>
								</li>
							)}
						</ul>
					</div>
					<input type="text" className="chat-input" onChange={this.handleMessage} onKeyUp={this.handleSendMessage} value={this.state.message}/>
				</div>

				</div>
			</div>
		
			)
	}

}
export default GameScreen;