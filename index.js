const express = require('express');
const { WebSocketServer } = require('ws');

const encode = (data, type) => JSON.stringify({ data, type })

const wss = new WebSocketServer({ port: 5050 });
const rooms = new Map()

wss.on('connection',ws=>{
    let currentRoom = null;
    let playerName = null;
    ws.on('open', () => console.log('New connection'));
    ws.on('close',()=>{
        console.log('Connection closed');
    })
    ws.on('error',()=>{
        console.log('Connection Error');
    })
    ws.on('message',()=>{
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

            room.players.set(ws, name);
            currentRoom = roomID;
            playerName = name;

            if (room.players.size === 2) {
                room.turn = [...room.players.values()][0]; 
                room.players.forEach((_, playerWs) => {
                    playerWs.send(encode({ players: [...room.players.values()], turn: room.turn }, 'start'));
                });
            }
        } else if (type === 'move' && currentRoom) {
            const { position } = data;
            const room = rooms.get(currentRoom);

            if (!room || room.board[position] !== null) return;

            if (room.turn !== playerName) {
                ws.send(encode('Not your turn', 'error'));
                return;
            }

            room.board[position] = playerName;
            room.turn = [...room.players.values()].find(p => p !== playerName);

            room.players.forEach((_, playerWs) => {
                playerWs.send(encode({ board: room.board, turn: room.turn }, 'update'));
            });
        }


    })

})

const app = express();

app.use(express.static('./public'));

app.listen(5000, () => console.log('Listening on port 5000'));
