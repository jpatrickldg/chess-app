const chessBoard = document.createElement('main')
chessBoard.setAttribute('id', 'chess-board')
chessBoard.classList.add('chessboard')

let cells = []

function createBoard() {
    for (let i = 0; i < 64; i++) {
        cells[i] = document.createElement('div')
        cells[i].setAttribute('id', `${i}`)
        cells[i].classList.add('cell')
        chessBoard.appendChild(cells[i])
    }

    for (let i = 0; i < 8; i++) {
        if (i % 2 === 0) {
            cells[i].classList.add('light')
        } else cells[i].classList.add('dark')
    }

    for (let i = 8; i < 16; i++) {
        if (i % 2 === 0) {
            cells[i].classList.add('dark')
        } else cells[i].classList.add('light')
    }
    for (let i = 16; i < 24; i++) {
        if (i % 2 === 0) {
            cells[i].classList.add('light')
        } else cells[i].classList.add('dark')
    }
    for (let i = 24; i < 32; i++) {
        if (i % 2 === 0) {
            cells[i].classList.add('dark')
        } else cells[i].classList.add('light')
    }
    for (let i = 32; i < 40; i++) {
        if (i % 2 === 0) {
            cells[i].classList.add('light')
        } else cells[i].classList.add('dark')
    }
    for (let i = 40; i < 48; i++) {
        if (i % 2 === 0) {
            cells[i].classList.add('dark')
        } else cells[i].classList.add('light')
    }
    for (let i = 48; i < 56; i++) {
        if (i % 2 === 0) {
            cells[i].classList.add('light')
        } else cells[i].classList.add('dark')
    }
    for (let i = 56; i < 64; i++) {
        if (i % 2 === 0) {
            cells[i].classList.add('dark')
        } else cells[i].classList.add('light')
    }
}

createBoard()

document.body.append(chessBoard)