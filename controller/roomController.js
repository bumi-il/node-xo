const rooms = {}; 

const jwt = require('jsonwebtoken');

const createRoom = (req, res) => {
    const token = req.headers.authorization;

    if (!token || token !== "your-secret-token") {
        return res.status(401).json({ error: "Unauthorized" });
    }

    let roomId;
    do {
        roomId = Math.floor(Math.random() * 1000) + 1;
    } while (rooms[roomId]);

    const playerToken = jwt.sign({ playerId: 'uniquePlayerId' }, 'your-secret-key', { expiresIn: '1h' });

    rooms[roomId] = {
        players: [], 
        board: Array(9).fill(null),
        currentTurn: 'X',
        winner: null
    };

    res.json({ roomId, playerToken });
};


const joinRoom = (req, res) => {
    const { roomId } = req.params;
    if (!rooms[roomId]) {
        return res.status(404).json({ error: 'Room not found' });
    }
    if(rooms[roomId].players.length >= 2) {
        return res.status(400).json({ error: 'Room is full' });
    }

    const playerSymbol = rooms[roomId].players.length === 0 ? 'X' : 'O';
    rooms[roomId].players.push(playerSymbol);
    res.json({ roomId, playerSymbol });
};

const makeMove = (req, res) => {
    const { roomId } = req.params;
    const { index, player } = req.body;

    if (!rooms[roomId]) return res.status(404).json({ error: 'Room not found' });
    if (rooms[roomId].winner) return res.status(400).json({ error: 'Game is over' });
    if (rooms[roomId].board[index] !== null) return res.status(400).json({ error: 'Invalid move' });
    if (rooms[roomId].currentTurn !== player) return res.status(400).json({ error: 'Not your turn' });

    rooms[roomId].board[index] = player;
    rooms[roomId].currentTurn = player === 'X' ? 'O' : 'X';

    const winner = checkWinner(rooms[roomId].board);
    if (winner) {
        rooms[roomId].winner = winner;
    }

    res.json({ board: rooms[roomId].board, winner: rooms[roomId].winner });
};

const checkWinner = (board) => {
    const winningCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8], 
        [0, 4, 8], [2, 4, 6]
    ];
    
    for (const [a, b, c] of winningCombinations) {
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return board.includes(null) ? null : 'TIE';
};


