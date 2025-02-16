
const mongoose = require('mongoose');

const GameSchema = new mongoose.Schema({
    board: {
        type: [[String]], 
        default: [['', '', ''], ['', '', ''], ['', '', '']]
    },
    currentPlayer: {
        type: String,
        enum: ['X', 'O'],
        required: true,
        default: 'X'
    },
    winner: {
        type: String,
        enum: ['X', 'O', 'Draw', null],
        default: null
    },
    isFinished: {
        type: Boolean,
        default: false
    },
    
});

module.exports = mongoose.model('TicTacToe', GameSchema);

