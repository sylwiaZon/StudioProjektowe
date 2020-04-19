import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'
import address from '../configuration.json';
import Cookies from 'universal-cookie';
import { Redirect } from 'react-router-dom'

const cookies = new Cookies();

class Statistics extends React.Component {
    constructor() {
        super();
        this.state = {
            id:'',
            userData:''
        }

        this.state.userData=cookies.get("user").split(' ');
        this.state.id=this.state.userData[4];
    }
    render() {
      
        return (
            <div className="app">
                <Header />
                <h2 className="form-title">statystyki</h2>
                <img src={nyanDuck} alt="nyan kaczka" className="nyan" />


                <div className="form-container">
                    <div className="stats-container">
                        <div className="stats-inside-container1">
                            
                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">kalambury</h2>
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">statki</h2>
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                        </div>
                                    </div>
                                </div>

                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">chińczyk</h2>    
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                        </div>
                                    </div>
                                </div>
                            
                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">szachy</h2>
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                            <p className="form-white-title">1.</p>
                                        </div>
                                    </div>
                                </div>

                        </div>
                        
                         <a href="/profile" className="profile-button"> powrót </a>

                        </div>
                    </div>


            </div>

        )
    }
}


export default Statistics;