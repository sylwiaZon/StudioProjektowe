import React from 'react';
import logo from '../assets/logo.png'
import Cookies from 'universal-cookie';
import address from '../configuration.json';

const cookies = new Cookies();
class Header extends React.Component {
    constructor(props) {
        super(props);
        
        this.state = {
            path: window.location.pathname
        }
        this.goToMainService = this.goToMainService.bind(this);
    }
    goToMainService(){
       cookies.set('game', 'szachy', { path: '/' });
    }
    handleLogout(){
        cookies.remove('user', { path: '/' })
    }
   
    render() {

        
        return (
        	<header className="app-header">
            <a href={"http://"+address.baseURL+":"+address.mainPort+"/"}><img src={logo} alt="logo"/></a>
            <div className="buttons-container">
            {this.state.path==="/" && (cookies.get('user')==undefined) ? <a href={"http://"+address.baseURL+":"+address.mainPort+"/login"} className="header-button" onClick={this.goToMainService}> Zaloguj </a>:null}
            {this.state.path==="/" && (cookies.get('user')==undefined)  ? <a href={"http://"+address.baseURL+":"+address.mainPort+"/register"} className="header-button" onClick={this.goToMainService}> Zarejestruj </a>:null}
             
            {(cookies.get('user')!==undefined)? <a href={"http://"+address.baseURL+":"+address.mainPort} className="header-button">Konto</a>:null}
            {(cookies.get('user')!==undefined )? <a href={"http://"+address.baseURL+":"+address.mainPort} className="header-button" onClick={this.handleLogout}> Wyloguj </a>:null}
            </div>
            </header>
        )
    }
}


export default Header;