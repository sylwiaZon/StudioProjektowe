import React from 'react';
import Chess from 'chess.js';
import ChessHub from './ChessHub.jsx';
import PieceIconFactory from './PieceIconFactory.jsx';
import './chess-style.css';

class ChessBoard extends React.Component{
	constructor(){
		super();
		this.state = {
			color: 'white',
			squareData: {}
		}

		this.iconFactory = new PieceIconFactory();

		this.game = new Chess();

		this.handleSquareClick = this.handleSquareClick.bind(this)
	}

	async componentWillMount() {
		var color = this.props.color
		this.setState({color: color})
		this.board = this.generateBoard(color)
		this.setState({squareData: this.initSquareData(this.board)})
	}

	initSquareData(board) {
		var data = {}
		board.forEach(row => {
			row.forEach(square => {
				data[square] = {
					selected: false,
					isAvailableTarget: false
				}
			});
		});
		return data
	}

	handleBoardChange() {
		var status = {
			board: this.game.fen()
		}
		this.props.onBoardChange(status)
	}

	getSquareClassName(square) {
		return "square " + this.game.square_color(square) + "-square"
	}

	generateBoard(color) {
		var squareArray = this.game.SQUARES;
		var rowArray = [];
		for (var i=0; i<squareArray.length; i+=8) {
			rowArray.push(squareArray.slice(i,i+8));
		}
		if (color == "black") {
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

	drawSquare(square, edges={top:false, left:false}) {
		var piece = this.game.get(square)

		var className = this.getSquareClassName(square);
		var data = this.state.squareData[square];

		if (edges.top) className += " top-square"
		if (edges.left) className += " left-square"

		if (data.isAvailableTarget) {
			className += ' target';
		}

		if (data.selected) {
			className += ' selected';
		}

		return(<div className={className} onClick={() => this.handleSquareClick(square)}>{this.renderPiece(piece)}</div>)
	}

	drawBoard() {
		var squares = this.board;
		var mapped = [];
		for(var i = 0; i < 8; i++) {
			var row = [];
			for(var j = 0; j < 8; j++) {
				var square = squares[i][j];
				var edges = {
					top: i==0,
					left: j==0
				}
				row.push(this.drawSquare(square, edges))
			}
			mapped.push(row);
		}
		return mapped;
	}

	updateGame() {
		if (this.props.receivedFen == undefined) return
		if (this.props.receivedFen == "") return
		if (this.props.receivedFen == this.game.fen()) return

		this.game.load(this.props.receivedFen)
		this.forceUpdate()
	}

	cleanSelections() {
		this.setState({squareData: this.initSquareData(this.board)})
	}

	handleSquareSelect(square) {
		var squareDataCopy = Object.assign({}, this.state.squareData)

		var data = squareDataCopy[square]

		var piece = this.game.get(square)
		if (piece == null) return

		var pieceColor = piece.color == "w" ? "white" : "black"

		if (pieceColor != this.state.color) return

		for (var key in squareDataCopy) {
			squareDataCopy[key].selected = false
			squareDataCopy[key].isAvailableTarget = false
		}

		data.selected = true

		var availableMoves = this.game.moves({square: square, verbose: true})

		for (var move of availableMoves) {
			squareDataCopy[move.to].isAvailableTarget = true
		}

		this.setState({squareData: squareDataCopy})
	}

	handleMove(square) {
		var source = null
		for (var key in this.state.squareData) {
			if (this.state.squareData[key].selected) {
				source = key;
				break
			}
		}

		var moves = this.game.moves({square: source, verbose: true})
		var move = moves.find(move => move.to == square)

		this.cleanSelections()

		this.game.move(move)
		this.handleBoardChange()
		this.forceUpdate()
	}

	handleSquareClick(square) {
		var data = this.state.squareData[square]

		if (!data.isAvailableTarget) {
			this.handleSquareSelect(square)
		}
		else {
			this.handleMove(square)
		}
	}

	render(){
		this.updateGame()

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