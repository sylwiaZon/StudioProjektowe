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
	Colors(){
		return(
			<div className="colors-panel" style={{flexDirection:'row', marginTop:'-45px', justifyContent:'flex-end', marginRight:'-120px'}}> 
				<div className="color" style ={{background: "#e400f6",width: '40px', height: '40px'}} ></div>
				<div className="color" style={{background: '#00e1ea',width: '40px', height: '40px'}}></div>
			 </div>)
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
				<p>czas na ruch <span><input type="number" className="timeInput"/> : <input type="number"className="timeInput" /></span></p>
				<p className='game-title'>wybór pionka</p> <span>{this.Colors()}</span>

				</div>
				</div>
				<button onClick={this.props.continueFunc}>kontynuuj</button>
			</div>
			)
	}
	
}
export default GameSettings