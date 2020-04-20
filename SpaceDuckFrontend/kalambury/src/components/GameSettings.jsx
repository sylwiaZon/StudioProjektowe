import React from 'react'
import './settings-style.css';
import PropTypes from 'prop-types';
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