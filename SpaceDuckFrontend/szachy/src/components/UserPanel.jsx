import React from 'react';
import PropTypes from 'prop-types';
import duck_purple from '../assets/Kaczka_fuksja.png';
import duck_blue from '../assets/Kaczka_niebieski.png';
import close from '../assets/close.png';
import active from '../assets/activePlayer.png'
class UserPanel extends React.Component{
	static propTypes = {
    userName: PropTypes.string.isRequired,
    points: PropTypes.number.isRequired,
    color: PropTypes.string.isRequired,
    adminView: PropTypes.bool,
    removeUserfunc: PropTypes.func,
    active: PropTypes.bool,
   
  };
  static defaultProps = {
    userName: "User",
    points: 0,
    color:"white",
    adminView: false,
    active: false,
    removeUserfunc: () => {}
  };
	constructor(...props){
		super(...props);

	}
	chooseIcon(){
		if(this.props.color=="white")
			return(<img src={duck_blue} alt="duck"/>)
		if(this.props.color=="black")
			return(<img src={duck_purple} alt="duck"/>)
	}

	render(){
		const {
		      userName,
		      points,
		      color,
		      adminView,
		      removeUserfunc
    	} = this.props;

		return(
			<div className="user-container">
			{this.props.active ? <img src={active} alt=">" className="activePlayer" /> : null}
			<div className="userPanel">
				
				{this.chooseIcon()}
				<div className="userInfo">
				<p className="userName">{this.props.userName}</p>
				<p className="userPoints">{this.props.points}</p>
				</div>
				{this.props.adminView ? <img src={close} alt="x" className="removeUser" onClick={this.props.removeUserfunc}/> : null}
			</div>
			</div>
			)
	}

}
export default UserPanel;