const express = require('express');
const { WebSocketServer } = require('ws');

const encode = (data, type) => JSON.stringify({ data, type })

const wss = new WebSocketServer({ port: 5050 });
const connection = new Map()

wss.on('connection',ws=>{
    connection.set(ws,'')
    ws.on('open', () => console.log('New connection'));
    ws.on('close',()=>{
        console.log('Connection closed');
    })
    ws.on('error',()=>{
        console.log('Connection Error');
    })
    ws.on('message',()=>{
        console.log('there is message');
    })

})

const app = express();

app.use(express.static('./public'));

app.listen(5000, () => console.log('Listening on port 5000'));
