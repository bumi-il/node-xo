const Game = require("../models/Game.js")

exports.createGame = async(req,res,next)=>{

    try {
        const newGame = new Game();
        await newGame.save();
        res.status(201).json(newGame);
    } catch (error) {
        res.status(500).json({ message: 'Error creating game', error });
    }
}
exports.getGame = async(req,res,next)=>{

    const gameId = req.params;
    try {
        const game = await Game.findById(gameId)

    if (!game) {
        return res.status(404).json({ message: 'Game not found' });
    }
    return res.status(200).json({message:game})
        
    } catch (error) {
        res.status(500).json({ message: 'Error creating game', error });  
    }
    
}

exports.makeMove = async(req,res,next)=>{
    
}










const checkWinner = (board) => {
    const lines = [
        // שורות
        [board[0][0], board[0][1], board[0][2]],
        [board[1][0], board[1][1], board[1][2]],
        [board[2][0], board[2][1], board[2][2]],
        // עמודות
        [board[0][0], board[1][0], board[2][0]],
        [board[0][1], board[1][1], board[2][1]],
        [board[0][2], board[1][2], board[2][2]],
        // אלכסונים
        [board[0][0], board[1][1], board[2][2]],
        [board[0][2], board[1][1], board[2][0]]
    ];
    
    for (let line of lines) {
        if (line[0] && line[0] === line[1] && line[1] === line[2]) {
            return line[0]; // מחזיר 'X' או 'O' אם יש מנצח
        }
    }
    
    return board.flat().includes('') ? null : 'Draw'; // אם אין מקום פנוי, תיקו
};




