const chessBoard = document.createElement('main')
chessBoard.setAttribute('id', 'chess-board')
chessBoard.classList.add('chessboard')

let cells = []
const board = [[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}],
[{}, {}, {}, {}, {}, {}, {}, {}]]

function createBoard() {
    let changePattern = false
    let classToAdd = 'light'
    for (let i = 0; i < 64; i++) {
        cells[i] = document.createElement('div')
        cells[i].classList.add('cell')
        changePattern = (i % 8 === 0 || i === 0)
        classToAdd = changePattern ? classToAdd : classToAdd === 'light' ? 'dark' : 'light'
        cells[i].classList.add(classToAdd)
        chessBoard.appendChild(cells[i])
    }
}

createBoard()

document.body.append(chessBoard)


function convertIndex(x, y) {
    let index = (y * 8) + x
    return index
}

class ChessPiece {
    constructor(x, y, name, color) {
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.move();
        this.addId();
    }
}

//Place piece in the board
ChessPiece.prototype.move = function () {
    board[this.x][this.y] = this;
}

//Add id into cell array corresponding to its 2d array counterpart
ChessPiece.prototype.addId = function () {
    let cellsIndex = (this.y * 8) + this.x
    cells[cellsIndex].id = `${this.color}-${this.name}`
}

function removeID(index) {
    cells[index].id = ''
}

function addIdToCell(index, object) {
    cells[index].id = `${object.color}-${object.name}`
}

class Pawn extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    pawnMoves() {
        let piece = this
        console.log(this)
        console.log(this.color)
        console.log(this.x, this.y)
        if (this.color === 'black') {
            let yCopy = this.y + 2
            // console.log(this.x)
            const existingIndex = convertIndex(this.x, this.y)
            const currentCellIndex = convertIndex(this.x, yCopy)
            console.log(currentCellIndex)
            cells[currentCellIndex].classList.add('blue')
            cells[currentCellIndex].addEventListener('click', function () {
                // console.log(piece.y)
                board[piece.x][piece.y] = {}
                removeID(existingIndex)
                // cells[existingIndex].removeEventListener('click', movePiece)

                let xy = getXY(currentCellIndex)
                board[xy[0]][xy[1]] = piece
                piece.x = xy[0]
                piece.y = xy[1]
                addIdToCell(currentCellIndex, piece)
                cells[currentCellIndex].classList.remove('blue')
                removeListeners()
                addListenerToOccupiedSquare()


            })
        }

    }
}

function getXY(index) {
    let coords = []
    const x = index % 8
    const y = (index - x) / 8
    coords.push(x)
    coords.push(y)
    return coords
}

class Rook extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    rookMoves() {

        for (let i = 0; i < 8; i++) {
            const currentCellIndex = convertIndex(i, this.y)
            cells[currentCellIndex].classList.add('blue')

            const currentCellIndexY = convertIndex(this.x, i)
            cells[currentCellIndexY].classList.add('blue')
        }
    }
}

class Knight extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    knightMoves() {

    }
}

class Bishop extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    bishopMoves() {

    }
}

class Queen extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    queenMoves() {

    }
}

class King extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    kingMoves() {

    }
}

function renderPieces() {
    for (let i = 0; i < 8; i++) {
        new Pawn(i, 1, 'pawn', 'black')
    }
    for (let i = 0; i < 8; i++) {
        new Pawn(i, 6, 'pawn', 'white')
    }

    new Rook(0, 7, 'rook', 'white')
    new Rook(7, 7, 'rook', 'white')
    new Knight(1, 7, 'knight', 'white')
    new Knight(6, 7, 'knight', 'white')
    new Bishop(2, 7, 'bishop', 'white')
    new Bishop(5, 7, 'bishop', 'white')
    new Queen(3, 7, 'queen', 'white')
    new King(4, 7, 'king', 'white')

    new Rook(0, 0, 'rook', 'black')
    new Rook(7, 0, 'rook', 'black')
    new Knight(1, 0, 'knight', 'black')
    new Knight(6, 0, 'knight', 'black')
    new Bishop(2, 0, 'bishop', 'black')
    new Bishop(5, 0, 'bishop', 'black')
    new Queen(3, 0, 'queen', 'black')
    new King(4, 0, 'king', 'black')
}

renderPieces()
console.log(board)


// cells.forEach(element => element.addEventListener('click', movePiece))

function removeListeners() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', movePiece)
    }
    console.log('remove')
}
function addListenerToOccupiedSquare() {
    for (let i = 0; i < cells.length; i++) {
        if (cells[i].id !== '') {
            cells[i].addEventListener('click', movePiece)
        }
    }
    console.log('add')
}

addListenerToOccupiedSquare()



function movePiece(e) {
    console.log('Have listener')
    const piece = e.target;
    const pieceIndex = Array.from(piece.parentElement.children).indexOf(piece)
    const x = pieceIndex % 8
    const y = (pieceIndex - x) / 8

    if (board[x][y] === undefined) {
        console.log('error')
    } else if (board[x][y].name === 'pawn') {
        console.log(board[x][y].name)
        board[x][y].pawnMoves()
    } else if (board[x][y].name === 'rook') {
        board[x][y].rookMoves()
    }
}

