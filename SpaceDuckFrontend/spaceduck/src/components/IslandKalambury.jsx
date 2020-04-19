import React from 'react';
import island from '../assets/island-kalambury.png';
import island2 from '../assets/island-kalambury2.png';



class Kalambury extends React.Component {
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
            {this.state.hover ? (<img src={island2} className="kalambury-island" alt="kalambury island"/>) : (<img src={island} className="kalambury-island" alt="kalambury island hover"/>)}       
            </div>
        )
    }
}


export default Kalambury;