import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'

class DeleteAccount extends React.Component {
    constructor() {
        super();
        this.state = {
            password:''
        };

        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
       
    }

    handleSubmit(event) {
      
       console.log('tutaj wolanie na backend')
     
    }
    render() {
      
        return (
            <div className="app">
                <Header />
                
                <h2 className="form-title">usuń konto</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />
               
                <div className="form-container">
               
                <form onSubmit={this.handleSubmit} action="/">
                    <h2 className="form-white-title">podaj hasło i potwierdź chęć usunięcia konta</h2>
                    <input type="password" value={this.state.password} onChange={this.handlePassword} placeholder="hasło" defaultValue={this.state.password}/><br/>
                    <input type="submit"style={{minWidth:230}} value="usuń konto" />
                    <a href="/profile" className="return-button"> powrót </a>
                </form>
                
                </div>
            </div>
        )
    }
}


export default DeleteAccount;