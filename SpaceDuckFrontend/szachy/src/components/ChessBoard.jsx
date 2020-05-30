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

		this.handleSquareClick = this.handleSquareClick.bind(this)

		this.boardSize = 0
		this.boardVerticalOffset = 0
	}

	async componentDidMount() {
		var color = this.props.color
		this.setState({color: color})
		this.board = this.game.SQUARES
		this.setState({squareData: this.initSquareData(this.board, color)})
	}

	async componentDidUpdate() {
		this.updateSquareTransforms()
	}

	initSquareData(board, color) {
		this.updateBoardTransform()

		var data = {}
		var squareSize = this.boardSize / 8
		for (var [i, squareName] of board.entries()) {
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
				size: squareSize,
				selected: false,
				isAvailableDestination: false
			}
		}
		return data
	}

	handleBoardChange() {
		var status = {
			board: this.game.fen()
		}
		this.props.onBoardChange(status)
	}

	updateBoardTransform() {
		if (this.boardContainer.current == null) return 0

		var containerWidth = this.boardContainer.current.offsetWidth
		var containerHeight = this.boardContainer.current.offsetHeight

		this.boardSize = Math.min(containerWidth, containerHeight)
		this.boardVerticalOffset = (containerHeight - this.boardSize)/2
	}

	getSquareDataCopy() {
		return JSON.parse(JSON.stringify(this.state.squareData));
	}

	updateSquareTransforms() {
		this.updateBoardTransform()

		if (Object.keys(this.state.squareData).length == 0) return
		var squareSize = this.boardSize / 8
		
		var squareDataCopy = this.getSquareDataCopy()

		for (var [name, data] of Object.entries(squareDataCopy)) {
			data.size = squareSize
		}

		if (this.state.squareData["a8"].size == squareDataCopy["a8"].size) return
		this.setState({squareData: squareDataCopy})
	}

	drawBoard() {
		var squareNames = this.game.SQUARES;
		var squares = [];
		for(var squareName of squareNames) {
			var piece = this.game.get(squareName);
			var state = Object.assign({}, this.state.squareData[squareName])
			state.piece = piece;
			state.name = squareName
			var square = <Square state={state} onClick={(name) => this.handleSquareClick(name)}/>
			squares.push(square);
		}
		return squares;
	}

	updateGame() {
		if (this.props.receivedFen == undefined) return
		if (this.props.receivedFen == "") return
		if (this.props.receivedFen == this.game.fen()) return

		this.game.load(this.props.receivedFen)
	}

	cleanSelections() {
		this.setState({squareData: this.initSquareData(this.board, this.state.color)})
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
		this.forceUpdate()
	}

	handleSquareClick(square) {
		var data = this.state.squareData[square]

		if (!data.isAvailableDestination) {
			this.handleSquareSelect(square)
		}
		else {
			this.handleMove(square)
		}
	}

	render(){
		this.updateGame()

		return(
			<div className="board-outer">
				<div className="board-center">
					<div className="board-inner-container" ref={this.boardContainer}>
						<div className="board" style={{top: this.boardVerticalOffset}}>
							<div style={{width: this.boardSize, height: this.boardSize, margin: "auto", position: "relative"}}>
								{this.drawBoard()}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
};
export default ChessBoard;