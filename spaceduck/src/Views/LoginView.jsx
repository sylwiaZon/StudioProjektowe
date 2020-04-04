import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'

class Login extends React.Component {
    constructor() {
        super();
        this.state = {
            mail: '',
            password:''
        };

        this.handleChange = this.handleChange.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
           
    }
    handleChange(event) {
        this.setState({mail: event.target.value});
       
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
                <h2 className="form-title">Logowanie</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />
                <div className="form-container">
                    
                    <form onSubmit={this.handleSubmit} action="/">
                    
                      <input type="text" value={this.state.mail} onChange={this.handleChange} placeholder="email" defaultValue={this.state.mail} value={this.state.mail}/><br/>
                       <input type="password" value={this.state.password} onChange={this.handlePassword} placeholder="hasło" defaultValue={this.state.password}/><br/>
                   
                    <input type="submit" value="Zaloguj" />
                  </form>
                </div>

            </div>
        )
    }
}


export default Login;