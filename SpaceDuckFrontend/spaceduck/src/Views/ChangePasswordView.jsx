import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'

class ChangePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            oldPassword: '',
            newPassword:''
        };

        this.handleOldPassword = this.handleOldPassword.bind(this);
        this.handleNewPassword = this.handleNewPassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

    }

        
        handleOldPassword(event) {
            this.setState({oldPassword: event.target.value});
           
        }
        handleNewPassword(event) {
            this.setState({newPassword: event.target.value});
           
        }
    
        handleSubmit(event) {
           console.log('tutaj wolanie na backend')
        }

    render() {
      
        return (
            <div className="app">
                <Header />
                <h2 className="form-title">zmień hasło</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />
                <div className="form-container">
                <form onSubmit={this.handleSubmit} action="/">
                    <h2 className="form-white-title">podaj stare oraz nowe hasło i potwierdź</h2>
                    <input type="password" value={this.state.oldPassword} onChange={this.handleOldPassword} placeholder="stare hasło" defaultValue={this.state.oldPassword}/><br/>
                    <input type="password" value={this.state.newPassword} onChange={this.handleNewPassword} placeholder="nowe hasło" defaultValue={this.state.newPassword}/><br/>
                    <input type="submit" style={{minWidth:230}} value="zmień"/> 
                    <a href="/profile" className="return-button"> powrót </a>
                </form>
                </div>
            </div>
        )
    }
}


export default ChangePassword;