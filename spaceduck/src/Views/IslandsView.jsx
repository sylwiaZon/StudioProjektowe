import React from 'react';
import Header from '../components/Header.jsx'
import Kalambury from '../components/IslandKalambury.jsx'
import Szachy from '../components/IslandSzachy.jsx'
import Chinczyk from '../components/IslandChinczyk.jsx'
import Statki from '../components/IslandStatki.jsx'
import './island.css'
import planet from '../assets/title-planet.png'
import ufo from '../assets/title-ufo.png'


class Islands extends React.Component {
    constructor(props) {
        super(props);
        this.mouseOver = this.mouseOver.bind(this);
        this.mouseOut = this.mouseOut.bind(this);
        this.state = {
            title: "Wybierz grę"
        }
       
    }
     mouseOver(name) {
        this.setState({title: name});
    }
    mouseOut() {
        this.setState({title: "Wybierz grę"});
    }
    
    render() {
       
        return (
            <div className="app" >
                <Header />
                <div className="title"><img src={ufo} alt="ufo"/><p>{this.state.title}</p><img src={planet} alt="planet"/></div>
                <div className="islands" >
                        <div onMouseOver={()=>this.mouseOver("Kalambury")} onMouseOut={()=>this.mouseOut()} >
                           <a href="http://google.com" style={{display: 'inline-block'}}> <Kalambury /></a>
                        </div>
                        <div onMouseOver={()=>this.mouseOver("Szachy")} onMouseOut={()=>this.mouseOut()} >
                             <a href="http://google.com" style={{display: 'inline-block'}}> <Szachy /></a>
                        </div>
                        <div onMouseOver={()=>this.mouseOver("Statki")} onMouseOut={()=>this.mouseOut()} >
                            <a href="http://google.com" style={{display: 'inline-block'}}> <Statki /></a>
                        </div>
                        <div onMouseOver={()=>this.mouseOver("Chińczyk")} onMouseOut={()=>this.mouseOut()} >    
                            <a href="http://google.com" style={{display: 'inline-block'}}> <Chinczyk /></a>
                        </div>
            
                </div>

            </div>
        )
    }
}


export default Islands;