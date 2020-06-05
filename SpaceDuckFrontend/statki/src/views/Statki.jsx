import React from 'react';
import Header from '../components/Header'
import './kalambury-styles.css';
import cosmoDuck from '../assets/Cosmo_duck.png'
import address from '../configuration.json';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Statki extends React.Component {
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
       cookies.set('game', 'statki', { path: '/' });
    }
    unLogged(){
    	return(
    		<div>
    			<a href={"http://"+address.baseURL+":"+address.mainPort+"/login"} onClick={this.goToMainService} className="button inline-button"> Zaloguj </a>
             	<a href="#" className="button inline-button" onClick={this.playAsGuest}> Gość </a><br/>
             			{this.state.guest ? <input type="text" placeholder="imię" onChange={this.handleChange}/>:null}
    		</div>
    		)
    }
    showInstructionsPopup(){
    	return(
    		<div className="overlay">
    			<div className="instructionPopup">	
    				<a href='#' onClick={this.handleCloseInstruction}>X</a>
    				<p><b>Statki</b><br/><br/>Każdy z graczy posiada po dwie plansze o wielkości 10x10 pól. Na jednym z kwadratów gracz zaznacza swoje statki, których położenie będzie odgadywał przeciwnik. Na drugim zaznaczone zostają trafione statki przeciwnika i oddane strzały. Statki ustawiane są w pionie lub poziomie, w taki sposób, aby nie stykały się one ze sobą ani bokami, ani rogami. 
Trafienie okrętu przeciwnika polega na strzale, który jest odgadnięciem położenia jakiegoś statku. Strzały oddawane są naprzemiennie. W przypadku strzału trafionego, gracz kontynuuje strzelanie (czyli swój ruch) aż do momentu chybienia. Zatopienie statku ma miejsce wówczas, gdy gracz odgadnie położenie całego statku. 
Wygrywa ten, kto pierwszy zatopi wszystkie statki przeciwnika.<br/>
					<br/><b>Punktacja</b><br/><br/>
					Użytkownik, który wygrał: +100 punktów<br/>
					Użytkownik, który przegrał: -50 punktów<br/>
					</p>
    			</div>
    		</div>


    	)
    }
    render() {
      	
        return (
            <div className="app">
            <Header/>
             <div className="kalambury-header"><p>Statki</p></div>
             <div className="main-container">
             	<div className="left-side">
             		<div className="ticket">
             			{(cookies.get('user'))==undefined ? this.unLogged() : null}

             			<div>
             			{this.state.guest || (cookies.get('user'))!=undefined ? <a href="/tables" className="button "> Graj </a>:null}
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
             				<p>Każdy z graczy posiada po dwie plansze o wielkości 10x10 pól. Na jednym z kwadratów gracz zaznacza swoje statki, których położenie będzie odgadywał przeciwnik. Na drugim zaznaczone zostają trafione statki przeciwnika i oddane strzały. Statki ustawiane są w pionie lub poziomie, w taki sposób, aby nie stykały się one ze sobą ani bokami, ani rogami.  </p>
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
    export default Statki;