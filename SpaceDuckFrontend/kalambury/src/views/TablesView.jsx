import React from 'react';
import Table from '../components/Table'
import './tables-styles.css'
import Header from '../components/Header'
import addTable from '../assets/Guzik_Nowy_Stół.png';


class Tables extends React.Component {
    constructor() {
        super();
                 
    }


    render() {
      
        return (
            <div className="app">
                <Header/>
                <div className="kalambury-header"><p>Kalambury</p></div>
                <div className="tables-view tables">
                    <ul className="card tables-header">
                        <li>STOŁ</li>
                        <li>GRACZE</li>
                        <li>RUNDY</li>
                        <li>CZAS</li>
                        <li>RODZAJ</li>
                    </ul>
                    <ul>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                        <li><Table></Table></li>
                    </ul>
                    <button className="add-table" type="button">
                        <img src={addTable} className="add-table-image"/>
                    </button>
                </div>
            </div>
        )
    }
}


export default Tables;