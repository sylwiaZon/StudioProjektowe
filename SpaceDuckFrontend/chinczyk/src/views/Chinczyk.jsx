import React from 'react';
import Header from '../components/Header'
import './kalambury-styles.css';
import cosmoDuck from '../assets/Cosmo_duck.png'
import address from '../configuration.json';
import Cookies from 'universal-cookie';
const cookies = new Cookies();
class Chinczyk extends React.Component {
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
       cookies.set('game', 'chinczyk', { path: '/' });
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
    				<a href='#' onClick={this.handleCloseInstruction}>X</a>
    				<p><b>Chińczyk</b><br/><br/>Gracze rzucają kostką, aż do momentu, kiedy któryś z graczy wyrzuci kostką liczbę 6 – wtedy ustawia jeden ze swoich czterech pionków na polu startowym i rzuca jeszcze raz, by następnie przesunąć pionek o taką liczbę pól w kierunku zgodnym z ruchem wskazówek zegara, ile wyrzuci kostką. Gracze przesuwają się o taką liczbę pól, jaką wyrzucą kostką. Jeżeli któryś z graczy wyrzuci 6, ma prawo do jeszcze jednego rzutu (pozostali czekają kolejkę). Gracz, po wyrzuceniu 6, może także wyprowadzić ze „schowka” kolejny pionek. Jeśli podczas gry pionek jednego gracza stanie na polu zajmowanym przez drugiego,pomijając pole startowe, pionek stojący tutaj poprzednio zostaje zbity i wraca do swojego „schowka”. Kiedy gracz obejdzie pionkiem całą planszę dookoła, wprowadza swój pionek do „domku” – czyli czterech pól oznaczonych własnym kolorem. Do „domku” jednego gracza nie mogą wjechać swoimi pionkami inni gracze.Kiedy gracz wjechał swoim pionkiem do „domku”, a na planszy nie ma żadnych innych jego pionków, musi wylosować 6, aby móc wprowadzić kolejny pionek ze „schowka” na planszę. W takiej sytuacji zamiast jednego rzutu kostką – ma trzy próby.To samo gracz wykonuje, kiedy jego wszystkie pionki zostały zbite i nie ma żadnej możliwości ruchu. <br/>
					<br/><b>Punktacja</b><br/><br/>
					Wygrana: +100 punktów <br/>
					Przegrana: -50 punktów <br/>
					Rezygnacja: -50 punktów <br/>
					</p>
    			</div>
    		</div>


    	)
    }
    render() {

        return (
            <div className="app">
            <Header/>
             <div className="kalambury-header"><p>Chińczyk</p></div>
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
             				<p>Gracze rzucają kostką po trzy razy, aż do momentu, kiedy któryś z graczy wyrzuci kostką liczbę 6 – wtedy ustawia jeden ze swoich czterech pionków na polu startowym i rzuca jeszcze raz, by następnie przesunąć pionek o taką liczbę pól w kierunku zgodnym z ruchem wskazówek zegara, ile wyrzuci kostką. Gracze przesuwają się o taką liczbę pól, jaką wyrzucą kostką. Jeżeli któryś z graczy wyrzuci 6, ma prawo do jeszcze jednego rzutu (pozostali czekają kolejkę). Gracz, po wyrzuceniu 6, może także wyprowadzić ze „schowka” kolejny pionek...</p>
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
    export default Chinczyk;
