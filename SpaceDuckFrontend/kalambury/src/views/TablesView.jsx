import React from 'react';
import Table from '../components/Table'
import './tables-styles.css'
import Header from '../components/Header'
import addTable from '../assets/Guzik_Nowy_Stół.png';
import address from '../configuration.json';
import history from '../history.jsx';
import Cookies from 'universal-cookie';

const cookies = new Cookies();
class Tables extends React.Component {
    constructor() {
        super();
        this.state = {
            tables: []
        };
    }

    componentDidMount(){
        cookies.set('currentTable', '', { path: '/' });
        fetch('https://'+address.kalamburyURL+address.room+'/all')
            .then((response) => response.json())
            .then(data => {
                this.setState({tables: data});
                console.log(data);
            })
            .catch((error) => {
                
            });
    }

    render() {
      
        return (
            <div className="app">
                <Header/>
                <div className="kalambury-header"><p>Kalambury</p></div>
                <div className="tables">
                    <ul className="card tables-header">
                        <li>STOŁ</li>
                        <li>GRACZE</li>
                        <li>RUNDY</li>
                        <li>CZAS</li>
                        <li>RODZAJ</li>
                        <li className="game-button">BUTTON</li>
                    </ul>
                    <ul>
                        {this.state.tables.map(arg => 
                            <li key={arg.id}>
                                <Table id={arg.id} playersIds={['a0e38bfa-0df4-4374-9fbb-57e68902d8c7']} isFull={arg.isFull} roomConfiguration={arg.roomConfiguration} table={arg}/>
                            </li>
                        )}
                    </ul>
                    <button className="add-table table-button" type="button" onClick={() => {history.push('/game')}}>
                        <img src={addTable} className="add-table-image" alt="Add table"/>
                    </button>
                </div>
            </div>
        )
    }
}


export default Tables;