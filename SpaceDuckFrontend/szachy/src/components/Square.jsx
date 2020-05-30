import React, {useLayoutEffect, useRef} from 'react';
import PieceIconFactory from './PieceIconFactory.jsx';
import './chess-style.css';
import equal from 'fast-deep-equal'

export default class Square extends React.Component{
	constructor(){
		super();
		this.state = {
			name: '',
            color: '',
            piece: '',
            position: [0, 0],
            selected: false,
            isAvailableDestination: false
		}

		this.iconFactory = new PieceIconFactory();
    }
    
    async componentDidMount(){
        this.updateState()
    }

    async componentDidUpdate(prevProps) {
        if (equal(this.props, prevProps)) return
        this.updateState()
	}

	getSquareClassName() {
		var className = "square " + this.state.color + "-square"

		if (this.state.position[0] == 0) className += " top-square"
		if (this.state.position[1] == 0) className += " left-square"

		if (this.state.isAvailableDestination) {
			className += ' target';
		}

		if (this.state.selected) {
			className += ' selected';
		}

		return className
	}

	getSizeWithoutBorders() {
		var size = [this.state.size, this.state.size]

		size[0] -= 1 // right border
		size[1] -= 1 // bottom border
		
		if (this.state.position[0] == 0) size[1] -= 1 // top border
		if (this.state.position[1] == 0) size[0] -= 1 // left border

		return size
	}

	renderPiece() {
        var piece = this.state.piece
		if (piece != null) {
			return(
				<img src={this.iconFactory.get(piece)} className="piece-icon"></img>
			)
		}
		return ''
    }
    
    updateState() {
        this.setState(this.props.state)
	}s
	
	getPositionAbsolute() {
		return [
			this.state.size * this.state.position[0],
			this.state.size * this.state.position[1]
		]
	}

	render() {
		if (this.state.color == '') return(<div></div>)
		
		var size = this.getSizeWithoutBorders()

		var className = this.getSquareClassName();
		var position = this.getPositionAbsolute()

		var style = {
			position: "absolute",
			top: position[0],
			left: position[1],
			width: size[0],
			height: size[1]
		}

        return(<div className={className} style={style} onClick={() => this.props.onClick(this.state.name)}>{this.renderPiece()}</div>)
	}
};