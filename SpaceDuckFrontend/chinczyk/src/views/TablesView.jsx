import React from 'react';
import Table from '../components/Table'
import './tables-styles.css'
import Header from '../components/Header'
import addTable from '../assets/Guzik_Nowy_St.png';


class Tables extends React.Component {
    constructor() {
        super();
                 
    }


    render() {
      
        return (
            <div className="app">
                <Header/>
                <div className="kalambury-header"><p>Chińczyk</p></div>
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
                        <li><Table/></li>
                        <li><Table/></li>
                        <li><Table/></li>
                        <li><Table/></li>
                        <li><Table/></li>
                        <li><Table/></li>
                        <li><Table/></li>
                        <li><Table/></li>
                        <li><Table/></li>
                        <li><Table/></li>
                    </ul>
                    <button className="add-table table-button" type="button">
                        <img src={addTable} className="add-table-image" alt="Add table"/>
                    </button>
                </div>
            </div>
        )
    }
}


export default Tables;
