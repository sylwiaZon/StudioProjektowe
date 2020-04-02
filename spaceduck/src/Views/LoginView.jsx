import React from 'react';
import Header from '../components/Header.jsx'

class Login extends React.Component {
    constructor(props) {
        super(props);
       
    }
   
    render() {
      
        return (
            <div className="app">
                <Header />
               <p>Login</p>

            </div>
        )
    }
}


export default Login;