import React from 'react';
import watch from '../assets/Obserwuj.png';
class Table extends React.Component {
    constructor() {
        super();
                 
    }


    render() {
      
        return (
               <ul className="card">
                    <li>#501</li>
                    <li>User 1, User2, User3</li>
                    <li>5</li>
                    <li>1:30</li>
                    <li>op</li>
                    <li>
                        <button className="table-button" type="button">
                            <img src={watch} className="watch-table-image"/>
                        </button>
                    </li>
               </ul>
        )
    }
}


export default Table;