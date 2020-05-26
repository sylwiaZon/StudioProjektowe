import React from 'react';
import Chess from 'chess.js';
import ChessHub from './ChessHub.jsx';
import PieceIconFactory from './PieceIconFactory.jsx';
import './chess-style.css';

class ChessBoard extends React.Component{
	constructor(){
		super();

		this.iconFactory = new PieceIconFactory();

		this.game = new Chess();
	}

	getSquareClassName(square) {
		return "square " + this.game.square_color(square) + "-square"
	}

	getSquares() {
		var squareArray = this.game.SQUARES;
		var rowArray = [];
		for (var i=0; i<squareArray.length; i+=8) {
			rowArray.push(squareArray.slice(i,i+8));
		}
		if (this.props.color == "black") {
			return rowArray.reverse();
		}
		return rowArray;
	}

	renderPiece(piece) {
		if (piece != null) {
			return(
				<img src={this.iconFactory.get(piece)} className="piece-icon"></img>
			)
		}
		return ''
	}

	drawSquare(square) {
		var piece = this.game.get(square)

		var className = this.getSquareClassName(square);
		return(<div className={className}>{this.renderPiece(piece)}</div>)
	}

	drawBoard() {
		var squares = this.getSquares();
		var mapped = [];
		for(var i = 0; i < 8; i++) {
			var row = [];
			for(var j = 0; j < 8; j++) {
				var square = squares[i][j];
				var className = "square " + this.game.square_color(square) + "-square"
				if (j == 0) className += " left-square"
				if (i == 0) className += " top-square"
				var piece = this.game.get(square)
				row.push(<div className={className}>{this.renderPiece(piece)}</div>)
			}
			mapped.push(row);
		}
		return mapped;
	}

	render(){
		var squares = this.drawBoard().map(row =>
			<div className="square-row">{row}</div>
		)

		return(
			<div className="board-outer-container">
				<div className="board-inner-container">
					<div className="board">
						{squares}
					</div>
				</div>
			</div>
		);
	}
};
export default ChessBoard;