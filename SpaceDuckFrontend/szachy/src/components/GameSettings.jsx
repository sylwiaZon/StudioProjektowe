import React from 'react'
import './settings-style.css';
import PropTypes from 'prop-types';
import Cookies from 'universal-cookie';
import address from '../configuration.json';
import classNames from "classnames";
import ErrorInfo from './ErrorInfo.jsx';
const cookies = new Cookies();
class GameSettings extends React.Component{
	static propTypes = {
  	privateTable: PropTypes.bool,
    continueFunc: PropTypes.func.isRequired,
    handlePublicTable: PropTypes.func.isRequired,
    handlePrivateTable:PropTypes.func.isRequired
   
  };
  static defaultProps = {
   	privateTable: false,
   	handlePrivateTable: () =>{},
   	handlePublicTable: ()=>{},
    continueFunc: () => {}
  };
	constructor(...props){
		super(...props);
		this.state = {
			roundNumber: 1,
			roundMinute:1,
			roundSeconds:20,
			correctData: true,
			isPrivate: false,
			password: '',
			color:'',
			blueColor:false,
		}
		
		this.handlePassword = this.handlePassword.bind(this);
		this.handleRoundMinutes = this.handleRoundMinutes.bind(this);
		this.handleRoundSeconds = this.handleRoundSeconds.bind(this);
		this.handleNumbersOnly = this.handleNumbersOnly.bind(this);
		this.handleNumbersOnly2 = this.handleNumbersOnly2.bind(this);
		this.handleNumbersOnly3 = this.handleNumbersOnly3.bind(this);
		this.setColor=this.setColor.bind(this);
	}

	handleNumbersOnly(event){
		if(event.keyCode<48 || event.keyCode>57){
			this.setState({roundNumber: ''});

		}
	}
	handleNumbersOnly2(event){
		if(event.keyCode<48 || event.keyCode>57){
			this.setState({roundMinute: ''});

		}
	}
	handleNumbersOnly3(event){
		if(event.keyCode<48 || event.keyCode>57){
			this.setState({roundSeconds: ''});

		}
	}
	handlePassword(event){
		this.createBody();
		this.setState({password: event.target.value})
	}

	handleRoundMinutes(event){
		this.setState({roundMinute: event.target.value})
	}
	handleRoundSeconds(event){
		this.setState({roundSeconds: event.target.value})
	}

	getRoundDuration() {
		return parseInt(this.state.roundMinute * 60) + parseInt(this.state.roundSeconds);
	}
	setColor(str){
		this.setState({color:str});
		console.log(str);
	}
	createBody(){
		var body = {
			"PlayerOwnerId": (cookies.get('user')).id,
			"PlayerOwnerName": (cookies.get('user')).userName,
			"RoundDuration": this.getRoundDuration(),
			"IsPrivate":this.state.isPrivate,
			//"Color":this.state.color,
			"RoundCount": 0
		}
		if(this.state.isPrivate){
			body["Password"] = this.state.password;
		}
		return body;
	}
	
	async createTable(){
		try{
			const response = await fetch('https://'+address.szachyURL+address.room, {
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json' 
				},
				body: JSON.stringify(this.createBody()),
			});

			if(!response.ok){
				throw Error(response.statusText);
			}

			const json = await response.json();

			this.props.continueFunc(json);
		} catch(error){
			this.setState({errorInfo: true});
		}

	}
	
	render(){

		if(this.state.roundNumber==0){
			this.state.correctData=false;
		}else{
			if(this.state.roundMinute == 0){
				if(this.state.roundSeconds>=30 && this.state.roundSeconds<60){
					this.state.correctData=true;
				}else{
					this.state.correctData=false;
				}
			}else{
				if(this.state.roundSeconds>=0 && this.state.roundSeconds<60){
					this.state.correctData=true;
				}else{
					this.state.correctData=false;
				}
			}
		}
		const {
			privateTable,
		 	handlePrivateTable,
		 	handlePublicTable,
		      continueFunc
    	} = this.props;
		return(
			<div className="settings-container">
				<h2 className="settingsTitle">Ustawienia</h2>
				<div className="settingsTile vertical">
					<label className="type"><span className={this.props.privateTable ? "settingsRadio" : "settingsRadio selected"} onClick={() => {this.state.isPrivate = false; this.props.handlePublicTable();}}></span><input type="radio" name="tableType"  />publiczny</label>
					<label className="type"><span className={!this.props.privateTable ? "settingsRadio" : "settingsRadio selected"} onClick={() => {this.state.isPrivate = true; this.props.handlePrivateTable();}}></span><input type="radio" name="tableType" />prywatny</label>
				</div>
				<div className={classNames({
					settingsTile: true,
					publicTable: !this.state.isPrivate
				})}>
					<div className="settingsPassword">
						<p>Podaj swoje hasło do pokoju</p>
						<span><input type="text" className="passwordInput" onChange={this.handlePassword} value={this.state.password}/></span>
					</div>
				</div>
				<div className="settingsTile">
					<div>
						
						<p>czas na ruch <span><input type="text" className="timeInput" onKeyUp={this.handleNumbersOnly2} value={this.state.roundMinute} onChange={this.handleRoundMinutes}/> : <input type="text"className="timeInput" onKeyUp={this.handleNumbersOnly3} value={this.state.roundSeconds}  onChange={this.handleRoundSeconds}/></span></p>
						<p>kolor pionka <span><span onClick={()=>{this.setColor("#e400f6"); this.setState({blueColor:false})}} className={this.state.blueColor ? "color-selector purple" : "color-selector purple selected"}></span> <span onClick={()=>{this.setColor("#00e1ea"); this.setState({blueColor:true})}} className={this.state.blueColor ? "color-selector blue selected" : "color-selector blue"}></span></span></p>
					</div>
				</div>
				{this.state.correctData ? <button onClick={() => {this.createTable();}}>kontynuuj</button>: <div><p className="error settingsTile">Uzupełnij prawidłowo formularz</p> <button disabled>Kontunuuj</button></div>}
			</div>
			)
	}
	
}
export default GameSettings