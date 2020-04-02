import React from 'react';
import Header from '../components/Header.jsx'

class Register extends React.Component {
    constructor(props) {
        super(props);
       
    }
   
    render() {
      
        return (
            <div className="app">
                <Header />
               <p>Register</p>

            </div>
        )
    }
}


export default Register;