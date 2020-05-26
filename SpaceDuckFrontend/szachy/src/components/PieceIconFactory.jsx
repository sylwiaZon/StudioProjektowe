class PieceIconFactory {
    get(piece) {
        var pieceName = piece.type + piece.color
        var icon = require('../assets/pieceIcons/' + pieceName + '.png')
        return icon
    }
};
export default PieceIconFactory;