import React, { useRef } from 'react';
import Chess from 'chess.js';
import PieceIconFactory from './PieceIconFactory.jsx';
import './chess-style.css';
import Square from './Square.jsx';

class ChessBoard extends React.Component{
	constructor(){
		super();
		this.state = {
			color: 'white',
			squareData: {}
		}

		this.boardContainer = React.createRef()

		this.iconFactory = new PieceIconFactory();

		this.game = new Chess();

		this.boardSize = 0
		this.boardVerticalOffset = 0
	}

	async componentDidMount() {
		var color = this.props.color
		this.setState({color: color})
		this.updateBoardTransform()
		this.initSquareData(color)
	}

	async componentDidUpdate() {
		this.updateGame()

		this.updateBoardTransform()
	}

	initSquareData(color) {
		var data = {}
		for (var [i, squareName] of this.game.SQUARES.entries()) {
			var position = null
			if (color == 'white') {
				position = [Math.floor(i/8), i%8]
			}
			else {
				position = [7 - Math.floor(i/8), 7 - i%8]
			}

			data[squareName] = {
				color: this.game.square_color(squareName),
				position: position,
				selected: false,
				isAvailableDestination: false
			}
		}
		this.setState({squareData: data})
	}

	handleBoardChange() {
		var status = {
			board: this.game.fen()
		}
		this.props.onBoardChange(status)
	}

	getSquareDataCopy() {
		return JSON.parse(JSON.stringify(this.state.squareData));
	}

	updateBoardTransform() {
		if (this.boardContainer.current == null) return 0

		var containerWidth = this.boardContainer.current.offsetWidth
		var containerHeight = this.boardContainer.current.offsetHeight

		this.boardSize = Math.min(containerWidth, containerHeight)
		this.boardVerticalOffset = (containerHeight - this.boardSize)/2
	}

	drawBoard() {
		var squareNames = this.game.SQUARES;
		var squares = [];
		for(var squareName of squareNames) {
			var state = this.createSquareState(squareName)
			var square = <Square state={state} onClick={(name) => this.handleSquareClick(name)}/>
			squares.push(square);
		}
		return squares;
	}

	createSquareState(square) {
		var state = Object.assign({}, this.state.squareData[square])

		state.piece = this.game.get(square);
		state.name = square
		state.size = this.boardSize / 8

		return state
	}

	updateGame() {
		if (this.props.receivedFen == undefined) return
		if (this.props.receivedFen == "") return
		if (this.props.receivedFen == this.game.fen()) return

		this.game.load(this.props.receivedFen)
	}

	cleanSelections() {
		var squareDataCopy = this.getSquareDataCopy()
		for (var [squareName, squareData] of Object.entries(squareDataCopy)) {
			squareData.selected = false
			squareData.isAvailableDestination = false
		}
		this.setState({squareData: squareDataCopy})
	}

	handleSquareSelect(square) {
		var squareDataCopy = this.getSquareDataCopy()

		var data = squareDataCopy[square]

		var piece = this.game.get(square)
		if (piece == null) return

		var pieceColor = piece.color == "w" ? "white" : "black"

		if (pieceColor != this.state.color) return

		for (var key in squareDataCopy) {
			squareDataCopy[key].selected = false
			squareDataCopy[key].isAvailableDestination = false
		}

		data.selected = true

		var availableMoves = this.game.moves({square: square, verbose: true})

		for (var move of availableMoves) {
			squareDataCopy[move.to].isAvailableDestination = true
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
	}

	handleSquareClick = (square) => {
		var data = this.state.squareData[square]

		if (!data.isAvailableDestination) {
			this.handleSquareSelect(square)
		}
		else {
			this.handleMove(square)
		}
	}

	render(){
		return(
				<div className="board-outer" ref={this.boardContainer}>
					<div className="board" style={{top: this.boardVerticalOffset}}>
						<div style={{width: this.boardSize, height: this.boardSize, margin: "auto", position: "relative"}}>
							{this.drawBoard()}
						</div>
					</div>
				</div>
		);
	}
};
export default ChessBoard;