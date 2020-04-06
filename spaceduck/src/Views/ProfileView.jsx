import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'

class Profile extends React.Component {
    constructor() {
        super();
    }
    render() {
      
        return (
            <div className="app">
                <Header />
                <h2 className="form-title">konto</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />
                <div className="form-container">
                <form>
                    <a href="/statistics" className="profile-button"> statystyki </a>
                    <a href="/changePassword" className="profile-button"> zmiana hasła </a>
                    <a href="/deleteAccount" className="profile-button"> usuń konto </a>
                    
                </form>
                </div>
            </div>
        )
    }
}


export default Profile;