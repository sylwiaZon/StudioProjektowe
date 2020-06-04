import React from 'react';
import logo from '../assets/logo.png'
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Header extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            path: window.location.pathname
        }
        this.handleLogout = this.handleLogout.bind(this);
    }
    handleLogout(){
        cookies.remove('user', { path: '/' })
    }
   
    render() {
   
        return (
            
        	<header className="app-header">
            <a href="/"><img src={logo} alt="logo"/></a>
            <div className="buttons-container">
            {this.state.path==="/register"? <a href="/login" className="header-button"> Zaloguj </a>:null}
            {this.state.path==="/login"? <a href="/register" className="header-button"> Zarejestruj </a>:null}
            {this.state.path==="/profile"|| this.state.path==="/statistics" || this.state.path==="/changePassword" || this.state.path==="/deleteAccount"? <a href="/" className="header-button" onClick={this.handleLogout}> Wyloguj </a>:null}
            {this.state.path==="/" && (cookies.get('user')!==undefined) ? <a href="/" className="header-button" onClick={this.handleLogout}> Wyloguj </a>:null}
            {this.state.path==="/" && (cookies.get('user')!==undefined) ? <a href="/profile" className="header-button"> Konto</a>:null}
            {this.state.path==="/" && (cookies.get('user')===undefined) ? <a href="/login" className="header-button"> Zaloguj </a>: null}
            {this.state.path==="/" && (cookies.get('user')===undefined) ? <a href="/register" className="header-button"> Zarejestruj </a>: null}

            </div>
            </header>
        )
    }
}


export default Header;