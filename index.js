const express = require('express');
const { WebSocketServer } = require('ws');

const encode = (data, type) => JSON.stringify({ data, type })

const wss = new WebSocketServer({ port: 5050 });
const rooms = new Map()

wss.on('connection', ws => {
    let currentRoom = null;
    let playerName = null;
   console.log('New connection')
    ws.on('close', () => {
        console.log('Connection closed');
        if (currentRoom && rooms.has(currentRoom)) {
            const room = rooms.get(currentRoom);
            room.players.delete(ws);

            if (room.players.size === 1) {
                room.players.forEach((_, playerWs) => {
                    playerWs.send(encode(playerName, 'opponent_left'));
                });
            } else if (room.players.size === 0) {
                rooms.delete(currentRoom);
            }
        }
    })
    ws.on('error', err => {
        console.error('WebSocket error:', err);
    });
    ws.on('message', () => {
        const msg = buffer.toString();
        const { data, type } = JSON.parse(msg);
        if (type === 'join') {
            const { roomID, name } = data;

            if (!rooms.has(roomID)) {
                rooms.set(roomID, { players: new Map(), board: Array(9).fill(null), turn: null });
            }

            const room = rooms.get(roomID);

            if (room.players.size >= 2) {
                ws.send(encode('Room is full', 'error'));
                return;
            }

            if ([...room.players.values()].includes(name)) {
                ws.send(encode('Name taken', 'error'));
                return;
            }

            playerSymbol = room.players.size === 0 ? 'X' : 'O'; // שחקן ראשון X, השני O
            room.players.set(ws, { name, symbol: playerSymbol });
            currentRoom = roomID;

            if (room.players.size === 2) {
                room.turn = 'X'; // תמיד מתחילים עם X
                room.players.forEach(({ name, symbol }, playerWs) => {
                    playerWs.send(encode({
                        players: [...room.players.values()].map(p => ({ name: p.name, symbol: p.symbol })),
                        turn: room.turn
                    }, 'start'));
                });
            }
        } 

        else if (type === 'move' && currentRoom) {
            const { position } = data;
            const room = rooms.get(currentRoom);

            if (!room || room.board[position] !== null) return; // אם המקום תפוס, מתעלמים

            const player = room.players.get(ws);
            if (!player || room.turn !== player.symbol) {
                ws.send(encode('Not your turn', 'error'));
                return;
            }

            room.board[position] = player.symbol; // מכניסים X או O ללוח
            room.turn = room.turn === 'X' ? 'O' : 'X'; // מעבירים תור לשחקן השני

            // שולחים עדכון לכל השחקנים
            room.players.forEach((_, playerWs) => {
                playerWs.send(encode({ board: room.board, turn: room.turn }, 'update'));
            });
        }
    })
    
})

const app = express();

app.use(express.static('./public'));

app.listen(5000, () => console.log('Listening on port 5000'));
