import React from 'react';
import Header from '../components/Header'
import './szachy-styles.css';
import cosmoDuck from '../assets/Cosmo_duck.png'
import address from '../configuration.json';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
class Szachy extends React.Component {
    constructor() {

        super();
        this.state = {
            guest: false,
            instructionPopup:false,
            guestName:''
        }
       this.playAsGuest = this.playAsGuest.bind(this);
       this.handleInstruction = this.handleInstruction.bind(this);
       this.handleCloseInstruction = this.handleCloseInstruction.bind(this);
       this.handleChange = this.handleChange.bind(this);
       this.goToMainService = this.goToMainService.bind(this);
       this.saveGuestName  = this.saveGuestName.bind(this);      
    }

    playAsGuest(){
        this.setState({guest:true});
    }
    handleInstruction(){
    	this.setState({instructionPopup:true});
    }
    handleCloseInstruction(){
    	this.setState({instructionPopup:false});
    }
    handleChange(event) {
        this.setState({guestName: event.target.value});    
    }
     goToMainService(){
       cookies.set('game', 'kalambury', { path: '/' });
    }
    unLogged(){
    	return(
    		<div className="asGuest">
    			<a href={"http://"+address.baseURL+":"+address.mainPort+"/login"} onClick={this.goToMainService} className="button inline-button"> Zaloguj </a>
             	<a href="#" className="button inline-button" onClick={this.playAsGuest} > Gość </a><br/>
             			{this.state.guest ? <input type="text" placeholder="imię" onChange={this.handleChange}/>:null}
    		</div>
    		)
    }
    saveGuestName(){
    	if(this.state.guest==true){
    		localStorage.setItem('guest', this.state.guestName);
    	};
    }
    showInstructionsPopup(){
    	return(
    		<div className="overlay">
    			<div className="instructionPopup">	
    				<a className="close" href='#' onClick={this.handleCloseInstruction}>X</a>
    				<p><b>Szachy</b><br/><br/>W grze udział biorą dwie osoby. Rozgrywa się ją na planszy nazywanej szachownicą, gdzie rozstawia się 32 bierki (sześciu rodzajów, w tym po 8 pionów i 8 figur, łącznie 16 dla każdego z graczy). Celem gry jest danie mata, tzn. zagrożenie królowi przeciwnika usunięciem z dalszej rozgrywki („zbiciem”), którego nie sposób uniknąć. 
<br/>
                    <br/>
                    <a href="https://pl.wikipedia.org/wiki/Zasady_gry_w_szachy" target="_blank"><b>Zasady gry</b></a><br/>
					<br/><b>Punktacja</b><br/><br/>
					Wygrana: +100 punktów<br/>
                    Przegrana: -50 punktów<br/>
                    Rezygnacja: -70 punktów<br/>
                    Remis: 0 punktów

					
					</p>
    			</div>
    		</div>


    	)
    }
    render() {
      	
        return (
            <div className="app">
            <Header/>
             <div className="szachy-header"><p>Szachy</p></div>
             <div className="main-container">
             	<div className="left-side">
             		<div className="ticket">
             			{(cookies.get('user'))==undefined ? this.unLogged() : null}

             			<div>
             			{this.state.guest || (cookies.get('user'))!=undefined ? <a href="/tables" className="button " onClick={this.saveGuestName}> Graj </a>:null}
             			</div>
             		</div>
             		

             	</div>
             	<div className="right-side">
             		<div className="ticket">
             				<h2>Ranking</h2>
             				<h3>1. user</h3>
             				<h3>1. user</h3>
             				<h3>1. user</h3>
             				<h3>1. user</h3>
             				<h3>1. user</h3>
             		</div>
             		<div className="ticket">
             				<h2>Instrukcja</h2>
             				<p>W grze udział biorą dwie osoby. Rozgrywa się ją na planszy nazywanej szachownicą, gdzie rozstawia się 32 bierki (sześciu rodzajów, w tym po 8 pionów i 8 figur, łącznie 16 dla każdego z graczy). Celem gry jest danie mata, tzn. zagrożenie królowi przeciwnika usunięciem z dalszej rozgrywki („zbiciem”), którego nie sposób uniknąć. 
 </p>
             				<button className="button" onClick={this.handleInstruction}>Czytaj dalej</button>
             		</div>
             	</div>
             	<img src={cosmoDuck} className="cosmoDuck-img" alt="cosmoDuck"/>
             </div>
             {this.state.instructionPopup ? this.showInstructionsPopup():null}
            </div>

            )
        }
    }
    export default Szachy;