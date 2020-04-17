import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'
import address from '../configuration.json';

class ChangePassword extends React.Component {
    constructor() {
        super();
        this.state = {
            id:'',
            name:'',
            email:'',
            password:'',
            oldPassword: '',
            newPassword:'',
            correctOldPassword:false,
            correctNewPassword:false,
            correctData:false,
            changed:false
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
    
            fetch('https://'+address.backendURL+address.userPath+this.state.id, {
                        method: 'POST',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({
                            "Name": this.state.name,
                            "Email": this.state.email,
                            "Password": this.state.oldPassword,
                            "NewPassword": this.state.newPassword
                        }),
                    })
                .then((response) => response.json())
                .then((responseJson) => {
                    if(responseJson=="You can't change password!"){
                    //information about taken login/email
                     var error = document.createElement('p');
                     error.style="color: #D62222; background: rgba(255,0,0,0.1); display:inline-block; padding:10px; width:80%; border: solid 1px #D62222;";
                     error.innerHTML="Błędne hasło!";
                     var errorDiv = document.getElementsByClassName('errorContainer')[0];
                     if(errorDiv.childElementCount!=0)
                        errorDiv.removeChild(errorDiv.lastElementChild);
                     errorDiv.style="visibility:visible;";
                     errorDiv.append(error);
                     
                    }else{
                        //changeded password succesfully 
                        this.setState({changed: true});
                    }
                    
                  })
                  
                .catch((error) => {
                     var error = document.createElement('p');
                     error.style="color: #D62222; background: rgba(255,0,0,0.1); display:inline-block; padding:10px; width:80%; border: solid 1px #D62222;";
                     error.innerHTML="Nie można połączyć się z serwerem, spróbuj poźniej!";
                     var errorDiv = document.getElementsByClassName('errorContainer')[0];
           
                     if(errorDiv.childElementCount!=0)
                        errorDiv.removeChild(errorDiv.lastElementChild);
                     errorDiv.style="visibility:visible;";
                     errorDiv.append(error);
                  
            });
        }

        strongPassword(newPassword){
            var re = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/;
            return re.test(newPassword)
        }

    render() {
        
        let inputStyle = { };
        if(this.state.password!==this.state.oldPassword){
            inputStyle={
                'border': 'solid red 1px',
                'background': 'rgba(255,0,0,0.3)'
            }
             this.state.correctOldPassword = false;

        }else{
            inputStyle={}   
            this.state.correctOldPassword = true; 
        }
        let passwordStyle = {};
        //strong password validation
        if(!this.strongPassword(this.state.newPassword)){
            passwordStyle = {
                'border': 'solid red 1px',
                'background': 'rgba(255,0,0,0.3)'
            }
             this.state.correctNewPassword = false;
        }else{
            passwordStyle={};
            this.state.correctNewPassword = true;
        }

        if(this.state.correctOldPassword && this.state.correctNewPassword){
            this.state.correctData=true;
        }else{
            this.state.correctData=false;
        }
        
        return (
            <div className="app">
                <Header />
                <h2 className="form-title">zmień hasło</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />
                
                <div className="form-container">
                    <div className='errorContainer'></div>

                    <div>
                        <h2 className="form-white-title">podaj stare oraz nowe hasło i potwierdź</h2>
                        <input style={passwordStyle} type="password" value={this.state.oldPassword} onChange={this.handleOldPassword} placeholder="stare hasło" defaultValue={this.state.oldPassword}/><br/>
                        {!this.state.correctNewPassword ? <p className='incorrectPassword'>Użyj silnego hasła. Silne hasło zawiera minimum jedną dużą i małą literę, cyfrę oraz znak specialny. Minimalna długość hasła to 8 znaków.</p>:null}
                        <input style={passwordStyle} type="password" value={this.state.newPassword} onChange={this.handleNewPassword} placeholder="nowe hasło" defaultValue={this.state.newPassword}/><br/>
                        {this.state.correctNewPassword ? (<input type="submit" style={{minWidth:230}} value="zmień" onClick={this.handleSubmit} enabled="true"/>) : (<input type="submit" value="Zmień" style={{minWidth:230}} disabled="true"/>)}
                        <a href="/profile" className="return-button"> powrót </a>
                    </div>
                
                </div>
            </div>
        )
    }
}


export default ChangePassword;