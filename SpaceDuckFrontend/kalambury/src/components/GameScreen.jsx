import React from 'react';
import ReactPaint from './ReactPaint.jsx';
import '../views/game-styles.css'
import UserPanel from './UserPanel.jsx';
import GameSettings from './GameSettings.jsx';
import * as signalR from "@microsoft/signalr";
import Cookies from 'universal-cookie';
import address from '../configuration.json';

const cookies = new Cookies();
class GameScreen extends React.Component{
	constructor(){
		super();
		this.state = {
			color: '#ffffff',
			clear: false,
			width:window.innerWidth*0.9*0.55 -20,
			height:window.innerHeight*0.6,
			message:'',
			privateTable:false,
			keyView:false,
			table: '',
			hubConnection: null,
			nick: '',
			messages: [],
			gameStatus: '',
			currentHint: ''
		}
		
		this.handleClear = this.handleClear.bind(this);
		this.handleChangeColor = this.handleChangeColor.bind(this);
		this.handleSendMessage = this.handleSendMessage.bind(this);
		this.handleMessage = this.handleMessage.bind(this);
	}

	async componentDidMount(){
		var currTable = cookies.get('currentTable');
		console.log(currTable);
		if(currTable != ''){
			console.log(currTable);
			this.state.table = currTable;
			await this.startGame();
		}
	}

	async startGame(){
		try{
			const startGame = await fetch('https://'+address.kalamburyURL+address.game+'/'+this.state.table.id,{
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

		}
		this.connectToRoom();
	}

	submitForDrawing(){
		//`https://${address.kalamburyURL+address.game}/${this.state.table.id}/drawing/${cookies.get('user').id}`
		fetch('https://'+address.kalamburyURL+address.game+"/"+this.state.table.id+"/drawing/"+cookies.get('user').id, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json' 
				},
				body: {
					"gameId": this.state.table.id+'',
					"playerId": cookies.get('user').id
					},
			})           
			.catch((error) => {
                
            });
	}

	saveMessages(author, receivedMessage){
		if(receivedMessage !== 'Update status by contexthub.' && receivedMessage !== ''){
			this.state.messages.push({author, receivedMessage});
			console.log(this.state.messages);
		}
	}

	addHint(hint){
		if(this.state.currentHint !== hint){
			console.log(this.state.hint);
			this.setState({currentHint: hint});
			this.saveMessages('hint', hint);
		}
	}

	connectToRoom(){
		var nick = cookies.get('user').id;
		const hubConnection = new signalR.HubConnectionBuilder()
		.withUrl("https://localhost:5003/kalamburyHub")
		.configureLogging(signalR.LogLevel.Information)  
		.build();

		console.log(hubConnection);
		this.setState({ hubConnection, nick }, () => {
			this.state.hubConnection
			.start()
			.then(() => {
				console.log('Connection started!');
				console.log(this.state.hubConnection.connection.connectionState);
				this.addToGame();
				this.submitForDrawing();
			})
			.catch(err => console.log('Error while establishing connection :('));
	
			this.state.hubConnection.on('ReceiveMessage', (nick, receivedMessage) => {
				this.saveMessages(nick, receivedMessage);
			});

			this.state.hubConnection.on('Send', (receivedMessage) => {
				this.saveMessages('server', receivedMessage);
			});

			this.state.hubConnection.on('GameStatus', (status) => {
				this.setState({gameStatus: status});
				if(status.hint !== ''){
					this.addHint(status.hint);
				}
				console.log(status);
			});

			this.state.hubConnection.on('Points', (status) => {
				console.log(status);
			});
		});
	}

	sendWord = () => {
		this.state.hubConnection
		  .invoke('CheckGivenWord', `${this.state.table.id}`, {Word: this.state.message, PlayerId: `${cookies.get('user').id}`})
		  .catch(err => console.error(err));
	  
		  this.setState({word: ''});      
	}		
	
	addToGame = () => {
		this.state.hubConnection
		.invoke('AddToGameGroup', `${this.state.table.id}`, this.state.nick)
		.catch(err => console.error(err));
	}

	sendMessage = () => {
		this.state.hubConnection
		  .invoke('SendMessage', this.state.nick, this.state.message)
		  .catch(err => console.error(err));
		  this.setState({message: ''});      
	}

	sendGameStatus = (canvas) => {
		if(this.isCurrentUserDrawing()){
			var body = this.state.gameStatus;
			body.canvas = canvas;
			console.log(body);
			this.state.hubConnection
			.invoke('SendGameStatus', this.state.table.id+'', body)
			.catch(err => console.error(err));
		}
	}

	isCurrentUserDrawing(){
		return this.state.gameStatus === '' ? false : this.state.gameStatus.currentPlayerId == cookies.get('user').id;
	}

	handleChangeColor(str){
		this.setState({clear: false});
		this.setState({color: str});
	}
	handleClear(){
		this.setState({clear: true});
	}
	handleMessage(event){
		this.setState({message:event.target.value});
	}
	handleSendMessage(event){
		if(event.keyCode==13){
			this.sendMessage();
			this.sendWord();
			this.setState({message:''});
		}

	}
	handleRemoveUser(){
		console.log('remove this user');
	}
	handleContinue(table){
		console.log(table);
		this.setState({table: table});
		this.startGame();
	}
	handleKey(){
		this.setState({keyView:false});
	}

	displayCanvas(){
		return (
			<div className="received-canvas">
			 	<img src={this.state.gameStatus.canvas} />
			</div>
		);
	}

	isTableSet(){
		return this.state.table !== '';
	}

	Colors(){
		return(
			<div className="colors-panel"> 
				<div className="color clear" onClick={this.handleClear} ></div>
				<div className="color" style={{background: '#ffffff'}} onClick={(str) => this.handleChangeColor('#ffffff')}></div>
				<div className="color" style ={{background: "#e400f6"}} onClick={(str) => this.handleChangeColor('#e400f6')}></div>
				<div className="color" style={{background: '#ffc865'}} onClick={(str) => this.handleChangeColor('#ffc865')} ></div>
				<div className="color" style={{background: '#00ee32'}}  onClick={(str) => this.handleChangeColor('#00ee32')}></div>
				<div className="color" style={{background: '#00e1ea'}} onClick={(str) => this.handleChangeColor('#00e1ea')}></div>
			 </div>
			)
	}

	render(){
		
		return(
			<div className="gameScreen"> 
				<div className={!this.isCurrentUserDrawing() ? 'hide-header' : '' + "game-header"}><p className='game-title'>{this.state.gameStatus.word}</p>{this.Colors()}<div className="time-counter"><p>1:50</p></div></div>
				<div className="game-container">
				<div className="players-list">
				
				<UserPanel {...{
					userName: 'User1',
					points: 123,
					panelType: 1,
					adminView:true,
					removeUserfunc: ()=>{this.handleRemoveUser()}

				}}/>
				<UserPanel {...{
					userName: 'dlugieimiezebysprawdziczysiezmiesci',
					points: 123,
					panelType: 2,
					adminView:true,
					removeUserfunc: ()=>{this.handleRemoveUser()}

				}}/>
				
				<UserPanel {...{
					userName: 'kaczka69',
					points: 123,
					panelType: 3

				}}/>
				<UserPanel {...{
					userName: 'kalambury09865346',
					points: 123,
					panelType: 4

				}}/>
				<UserPanel {...{
					userName: 'gracz87654',
					points: 0,
					panelType: 1

				}}/>

				</div>
				<div className="main-game"> 

				{this.isTableSet() ? (this.isCurrentUserDrawing() ? <ReactPaint {...{
				  brushCol: this.state.color,
				  className: 'react-paint',
				  height: this.state.height,
				  width: this.state.width,
				  clear:this.state.clear,
				  sendCanvas: (arg) => {this.sendGameStatus(arg)}
				}} /> :
					this.displayCanvas()
				): <GameSettings {...{
					handlePrivateTable: () => {this.setState({privateTable:true})},
					handlePublicTable: () => {this.setState({privateTable:false})},
					continueFunc: (str)=>{this.handleContinue(str)},
					privateTable: this.state.privateTable

				}} />}
				
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