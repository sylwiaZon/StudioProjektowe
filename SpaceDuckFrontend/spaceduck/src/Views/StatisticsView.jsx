import React from 'react';
import Header from '../components/Header.jsx'
import './forms-style.css'
import nyanDuck from '../assets/Nyan_kaczka.png'
import address from '../configuration.json';
import Cookies from 'universal-cookie';
const cookies = new Cookies();


class Statistics extends React.Component {
    constructor() {
        super();
        this.state = {
            kalamburyPoints:0,
            chessPoints:0,
            shipsPoints:0,
            chinesePoints:0,
            id:''
        };
    }
    componentDidMount(){
        this.state.id=cookies.get("user").id;
        this.fetchChessPoints();
        this.fetchKalamburyPoints();
        this.fetchChinesePoints();
        this.fetchShipsPoints();
    }

    fetchKalamburyPoints(){
            fetch('https://localhost:' + address.kalamburyBackendPort + address.kalamburyRanking+"/"+this.state.id )
            .then((response) => response.json())
            .then(data => {
                this.setState({kalamburyPoints: data});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);
            });

    }

    fetchChessPoints(){
            fetch('https://localhost:' + address.chessBackendPort + address.chessRanking+"/"+this.state.id)
            .then((response) => response.json())
            .then(data => {
                this.setState({chessPoints: data});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);               
            });

    }

    fetchChinesePoints(){
            fetch('https://localhost:'+ address.chineseBackendPort + address.chineseRanking+"/"+this.state.id )
            .then((response) => response.json())
            .then(data => {
                this.setState({chinesePoints: data});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);                
            });

    } 

    fetchShipsPoints(){
            fetch('https://localhost:'+ address.shipsBackendPort + address.shipsRanking+"/"+this.state.id)
            .then((response) => response.json())
            .then(data => {
                this.setState({shipsPoints: data});
                console.log(data);
            })
            .catch((error) => {
                console.log(error);                
            });

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
                                            <p className="form-white-title">{this.state.kalamburyPoints}</p>
                                        </div>
                                    </div>
                                </div>

                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">statki</h2>
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">{this.state.shipsPoints}</p>
            
                                        </div>
                                    </div>
                                </div>

                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">chińczyk</h2>    
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">{this.state.chinesePoints}</p>
                                        </div>
                                    </div>
                                </div>
                            
                                <div className = "stats-card-outside">
                                    <h2 className="form-white-title">szachy</h2>
                                    <div className="stats-inside-container2">
                                        <div classname="stats-card">
                                            <p className="form-white-title">{this.state.chessPoints}</p>
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