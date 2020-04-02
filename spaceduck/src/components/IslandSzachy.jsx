import React from 'react';
import island from '../assets/island-szachy.png';
import island2 from '../assets/island-szachy2.png';



class Szachy extends React.Component {
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
            {this.state.hover ? (<img src={island2} className="szachy-island" alt="szachy island"/>) : (<img src={island} className="szachy-island" alt="szachy island hover"/>)}       
            </div>
        )
    }
}


export default Szachy;