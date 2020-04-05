import React from 'react';
import logo from '../assets/logo.png'

class Header extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            path: window.location.pathname
        }
    }
   
    render() {

        
        return (
        	<header className="app-header">
            <a href="/"><img src={logo} alt="logo"/></a>
            <div className="buttons-container">
            {this.state.path==="/" || this.state.path==="/register"? <a href="/login" className="header-button"> Zaloguj </a>:null}
              {this.state.path==="/" || this.state.path==="/login"? <a href="/register" className="header-button"> Zarejestruj </a>:null}
              {this.state.path==="/" || this.state.path==="/profile"? <a href="/profile" className="header-button"> Profil </a>:null}

            </div>
            </header>
        )
    }
}


export default Header;