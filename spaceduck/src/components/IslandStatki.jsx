import React from 'react';
import island from '../assets/island-statki.png';
import island2 from '../assets/island-statki2.png';



class Statki extends React.Component {
    constructor(props) {
        super(props);
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.state = {
            hover: false
        }
    }
    mouseOver() {
        this.setState({hover: true});
       
    }
    mouseOut() {
        this.setState({hover: false});
         
    }
    render() {
      
        return (
            <div className="grid-box" onMouseOver={this.mouseOver} onMouseOut={this.mouseOut}>
            {this.state.hover ? (<img src={island2} className="statki-island" alt="island statki"/>) : (<img src={island} className="statki-island" alt="island statki hover"/>)}       
            </div>
        )
    }
}


export default Statki;