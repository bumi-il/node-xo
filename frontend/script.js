const root = document.querySelector('#root');

let game = false;

const encode = (type, data) => JSON.stringify({ type, data });

const ws = new WebSocket('ws://localhost:5050');

const button = document.createElement('button');
const input = document.createElement('input');
button.addEventListener('click', () => {
    game = true;
    const name = input.value;
    if (!name.length) {
        return;
    }
    ws.send(encode('join', name));
});
button.innerHTML = 'save';
root.appendChild(button);
root.appendChild(input);

const board = document.createElement('div');
board.id = 'board'
root.appendChild(board)
for (let i = 0; i < 9; i++) {
    const cell = document.createElement('div');
    cell.classList.add('cell')
    cell.id = '_' + i;
    board.appendChild(cell);
}

ws.addEventListener('open', () => {})
ws.addEventListener('close', () => {})
ws.addEventListener('error', () => {})
ws.addEventListener('message', (e) => {
    const { type, data } = e.data;
    switch (type) {
        case 'start':
            for (let i = 0; i < 9; i++) {
                document.querySelector('#_' + i).innerHTML = data[i];
            }
            break;
        default:
            break;
    }
})
