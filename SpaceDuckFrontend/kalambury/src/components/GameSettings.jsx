import React from 'react'
import './settings-style.css';
import PropTypes from 'prop-types';
import cookies from 'universal-cookie';
import address from '../configuration.json';


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
	}
	
	createTable(){
            fetch('https://'+address.kalamburyURL+address.room, {
					method: 'POST',
					headers: {
						'Accept': 'application/json',
						'Content-Type': 'application/json' 
					},
					body: JSON.stringify({
						"PlayerOwnerId": (cookies.get('user')).id,
						"RoundDuration": this.state.RoundDuration,
						"NumberOfPlayers":this.state.NumberOfPlayers,
						"IsPrivate":this.state.IsPrivate,
						"RoundCount": this.state.RoundCount
					}),
				});
	}
	
	render(){
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
				<label className="type"><span className={this.props.privateTable ? "settingsRadio" : "settingsRadio selected"}onClick={this.props.handlePublicTable}></span><input type="radio" name="tableType"  />publiczny</label>
					<label className="type"><span className={!this.props.privateTable ? "settingsRadio" : "settingsRadio selected"} onClick={this.props.handlePrivateTable}></span><input type="radio" name="tableType" />prywatny</label>
				</div>
				<div className="settingsTile">
				<div>
				<label>ilość tur <span><input type="number" className="settingsInput"/></span></label>
				<p>czas trwana tury <span><input type="number" className="timeInput"/> : <input type="number"className="timeInput" /></span></p>
				</div>
				</div>
				<button onClick={this.props.continueFunc}>kontynuuj</button>
			</div>
			)
	}
	
}
export default GameSettings