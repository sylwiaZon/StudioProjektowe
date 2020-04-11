import React from 'react';
import island from '../assets/island-chinczyk.png';
import island2 from '../assets/island-chinczyk2.png';



class Chinczyk extends React.Component {
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
            {this.state.hover ? (<img src={island2} className="chinczyk-island" alt="chinczyk island"/>) : (<img src={island} className="chinczyk-island" alt="chinczyk island hover"/>)}       
            </div>
        )
    }
}


export default Chinczyk;