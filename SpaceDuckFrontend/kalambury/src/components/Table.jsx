import React from 'react';

class Table extends React.Component {
    constructor() {
        super();
                 
    }


    render() {
      
        return (
           <div >
               <ul className="card">
                   <li>#501</li>
                   <li>User 1, User2, User3</li>
                   <li>5</li>
                   <li>1:30</li>
                   <li>op</li>
               </ul>
           </div>
        )
    }
}


export default Table;