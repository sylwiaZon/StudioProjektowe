import React from 'react';
import Table from '../components/Table'
import './tables-styles.css'
import Header from '../components/Header'
import addTable from '../assets/Guzik_Nowy_Stół.png';
import address from '../configuration.json';
import history from '../history.jsx';
import Cookies from 'universal-cookie';
import ErrorInfo from '../components/ErrorInfo.jsx';
const cookies = new Cookies();
class Tables extends React.Component {
    constructor() {
        super();
        this.state = {
            tables: [],
            errorInfo:false,
        };
    }

    componentDidMount(){
        cookies.set('currentTable', '', { path: '/' });
        fetch('https://'+address.szachyURL+address.room+'/all')
            .then((response) => response.json())
            .then(data => {
                this.setState({tables: data});
                console.log(data);
            })
            .catch((error) => {
                this.setState({errorInfo: true})
            });
    }

    render() {
      
        return (
            <div className="app">
            {this.state.errorInfo ? <ErrorInfo {...{
                visible: ()=>{this.setState({errorInfo:false})}
            }}/> : null}
                <Header/>
                <div className="szachy-header"><p>Szachy</p></div>
                <div className="tables">
                    <ul className="card tables-header">
                        <li>STOŁ</li>
                        <li>GRACZE</li>
                        <li>CZAS</li>
                        <li>RODZAJ</li>
                        <li className="game-button">BUTTON</li>
                    </ul>
                    <ul>
                        {this.state.tables.map(arg => 
                            <li key={arg.id}>
                                <Table id={arg.id} players={arg.players} isFull={arg.isFull} roomConfiguration={arg.roomConfiguration} table={arg}/>
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