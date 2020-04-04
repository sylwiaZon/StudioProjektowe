import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'
class Register extends React.Component {
    constructor() {
        super();
        this.state = {
            name:'',
            mail: '',
            password:'',
            password2:'',
          
        };
        this.handleName = this.handleName.bind(this);
        this.handleEmail = this.handleEmail.bind(this);
        this.handlePassword = this.handlePassword.bind(this);
        this.handlePassword2 = this.handlePassword2.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
           
    }
    handleEmail(event) {
        this.setState({mail: event.target.value});
    }
    handleName(event) {
        this.setState({name: event.target.value}); 
    }
    handlePassword(event) {
        this.setState({password: event.target.value}); 
    }
    handlePassword2(event) {
        this.setState({password2: event.target.value});   
    }

    handleSubmit(event) {
      
       console.log('tutaj wolanie na backend')

    }

    emailValidation(email){
        var re = /\S+@\S+\.\S+/;
        return re.test(email);
    }
    
    render() {
        //password validation
        let inputStyle = { };
        if(this.state.password!==this.state.password2){
            inputStyle={
                'border': 'solid red 1px',
                'background': 'rgba(255,0,0,0.3)'
            }

        }else{
            inputStyle={}    
        }

        //email validation
        let emailStyle ={};
        if(!this.emailValidation(this.state.mail)){
            emailStyle={
                'border': 'solid red 1px',
                'background': 'rgba(255,0,0,0.3)'
            }
        }else{
            emailStyle ={};
        }
      
        return (
            <div className="app">
                <Header />
                <h2 className="form-title">Rejestracja</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />
                <div className="form-container">
                    
                    <form onSubmit={this.handleSubmit} action="/login">
                        <input type="text" value={this.state.name} onChange={this.handleName} placeholder="login" defaultValue={this.state.name} /><br/>
                        <input style={emailStyle} type="text"  onChange={this.handleEmail} placeholder="email" defaultValue={this.state.mail} /><br/>
                        <input type="password" value={this.state.password} onChange={this.handlePassword} placeholder="hasło" defaultValue={this.state.password}/><br/>
                        <input style={inputStyle} type="password"  onChange={this.handlePassword2} placeholder="powtórz hasło" defaultValue={this.state.password2}/><br/>
                   
                    <input type="submit" value="Zarejestruj" />
                  </form>
                </div>

            </div>
        )
    }
   
}


export default Register;