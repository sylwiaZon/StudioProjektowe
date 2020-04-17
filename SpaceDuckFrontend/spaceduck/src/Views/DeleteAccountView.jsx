import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'
import address from '../configuration.json';
import { Redirect } from 'react-router-dom'

class DeleteAccount extends React.Component {
    constructor() {
        super();
        this.state = {
            id:'',
            password:'',
            deleted:false
        };

        this.handlePassword = this.handlePassword.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handlePassword(event) {
        this.setState({password: event.target.value});
       
    }

    handleSubmit(event) {
       
       
        //calling backend
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
        if (this.state.deleted === true) {
            return <Redirect to='/' />
          }
        return (
            <div className="app">
                <Header />
                
                <h2 className="form-title">usuń konto</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />
               
                <div className="form-container">
                    <div>
                        <h2 className="form-white-title">podaj hasło i potwierdź chęć usunięcia konta</h2>
                        <div className='errorContainer'></div>
                        <input type="password"  onChange={this.handlePassword} placeholder="hasło" defaultValue={this.state.password}/><br/>
                        <input type="submit"style={{minWidth:230}} onClick={this.handleSubmit} value="usuń konto" />
                        <a href="/profile" className="return-button"> powrót </a>
                    </div>
                </div>
            </div>
        )
    }
}


export default DeleteAccount;