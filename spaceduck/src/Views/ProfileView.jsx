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
                <h2 className="form-title">KONTO</h2>

                <div className="button-container">
                    <a href="/" className="profile-button"> STATYSTYKI </a>
                    <a href="/" className="profile-button"> ZMIANA HASŁA </a>
                </div>

                <img src={nyanDuck} alt="nyan kaczka rotated" className="nyan-rotated" />

            </div>
        )
    }
}


export default Profile;