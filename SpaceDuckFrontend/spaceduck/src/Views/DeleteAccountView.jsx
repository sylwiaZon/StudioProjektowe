import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'
import address from '../configuration.json';
import { Redirect } from 'react-router-dom'
import Cookies from 'universal-cookie';


const cookies = new Cookies();

class DeleteAccount extends React.Component {
    constructor() {
        super();
        this.state = {
            userData:'',
            password:'',
            id:'',
            deleted:false
        };

        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state.userData=cookies.get("user").split(' ');
        this.state.id=this.state.userData[4]

    }

    handlePassword(event) {
        this.setState({password: event.target.value});  
    }

    handleSubmit(event) {
        console.log(this.state.userData)
          fetch('https://'+address.backendURL+address.userPath+this.state.id, {
                        method: 'DELETE',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json' 
                        },
                        body: JSON.stringify({
                        }),
                    })
                .then((response) => {
               
                    if(response.status==401){
                    //infromation about wrong password
                     var error = document.createElement('p');
                     error.style="color: #D62222; background: rgba(255,0,0,0.1); display:inline-block; padding:10px; width:80%; border: solid 1px #D62222;";
                     error.innerHTML="Błędne hasło!";
                     var errorDiv = document.getElementsByClassName('errorContainer')[0];
           
                     if(errorDiv.childElementCount!=0)
                        errorDiv.removeChild(errorDiv.lastElementChild);
                     errorDiv.style="visibility:visible;";
                     errorDiv.append(error);
                     
                    }
                    else{
                        //account deleted succesfully 
                        this.setState({deleted: true});
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