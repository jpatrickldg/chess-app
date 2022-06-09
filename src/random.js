const turnIndicator = document.createElement('h3')


const chessBoard = document.createElement('main')
chessBoard.setAttribute('id', 'chess-board')
chessBoard.classList.add('chessboard')

let cells = []
let blackTurn = false;
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
    cells[cellsIndex].classList.add(this.color)
}

function removeID(index) {
    cells[index].id = ''
}

function addIdToCell(index, object) {
    cells[index].id = `${object.color}-${object.name}`
    cells[index].classList.add(object.color)

    console.log(object.color)
}

class Pawn extends ChessPiece {
    constructor(x, y, name, color, firstTurn) {
        super(x, y, name, color)
        this.firstTurn = firstTurn
    }

    pawnMoves() {
        let piece = this
        let yCopy = []
        let xCopy = []
        let currentCellIndex = []
        if (this.firstTurn === true) {
            if (this.color === 'black') {
                yCopy.push(this.y + 1)

                if (Object.keys(board[this.x][this.y + 1]).length === 0) {
                    xCopy.push(this.x)
                }

                if ((Object.keys(board[this.x][this.y + 1]).length === 0) && (Object.keys(board[this.x][this.y + 2]).length === 0)) {
                    yCopy.push(this.y + 2)
                }

                if (board[this.x - 1][this.y + 1].color === 'white') {
                    xCopy.push(this.x - 1)
                }

                if (board[this.x + 1][this.y + 1].color === 'white') {
                    xCopy.push(this.x + 1)
                }

                // for (let i = 1; i < 3; i++) {
                //     if (Object.keys(board[this.x][this.y + i]).length === 0) {
                //         yCopy.push(this.y + i)
                //     }
                // }
            }
            else {
                yCopy.push(this.y - 1)

                if (Object.keys(board[this.x][this.y - 1]).length === 0) {
                    xCopy.push(this.x)
                }

                if ((Object.keys(board[this.x][this.y - 1]).length === 0) && (Object.keys(board[this.x][this.y - 2]).length === 0)) {
                    yCopy.push(this.y - 2)
                }

                if (board[this.x - 1][this.y - 1].color === 'black') {
                    xCopy.push(this.x - 1)
                }

                if (board[this.x + 1][this.y - 1].color === 'black') {
                    xCopy.push(this.x + 1)
                }
                // for (let i = 1; i < 3; i++) {
                //     if (Object.keys(board[this.x][this.y - i]).length === 0) {
                //         yCopy.push(this.y - i)
                //     }
                // }
            }
        } else {
            if (this.color === 'black') {
                yCopy.push(this.y + 1)
                if (Object.keys(board[this.x][this.y + 1]).length === 0) {
                    xCopy.push(this.x)
                }
                if (board[this.x - 1][this.y + 1].color === 'white') {
                    xCopy.push(this.x - 1)
                }

                if (board[this.x + 1][this.y + 1].color === 'white') {
                    xCopy.push(this.x + 1)
                }
                // if (Object.keys(board[this.x][this.y + 1]).length === 0) {
                //     yCopy.push(this.y + 1)
                // }
            }
            else {
                yCopy.push(this.y - 1)
                if (Object.keys(board[this.x][this.y - 1]).length === 0) {
                    xCopy.push(this.x)
                }

                if (this.x - 1)
                    if (board[this.x - 1][this.y - 1].color === 'black') {
                        xCopy.push(this.x - 1)
                    }

                if (board[this.x + 1][this.y - 1].color === 'black') {
                    xCopy.push(this.x + 1)
                }
            }
        }
        console.log(xCopy)
        console.log(yCopy)

        //Check Collisions


        //Coordinates for capture

        const existingIndex = convertIndex(this.x, this.y)

        for (let i = 0; i < xCopy.length; i++) {
            for (let j = 0; j < yCopy.length; j++) {
                currentCellIndex.push(convertIndex(xCopy[i], yCopy[j]))
                // cells[currentCellIndex[i]].classList.add('blue')
                // cells[currentCellIndex[i]].addEventListener('click', placePawn)
                console.log(currentCellIndex)
            }
        }


        console.log(currentCellIndex)

        function placePawn(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)

            board[piece.x][piece.y] = {}
            removeID(existingIndex)
            cells[existingIndex].classList.remove('black')
            cells[existingIndex].classList.remove('white')

            let x = getX(clickedSquareIndex)
            let y = getY(clickedSquareIndex, x)

            board[x][y] = piece
            piece.x = x
            piece.y = y
            piece.firstTurn = false
            addIdToCell(clickedSquareIndex, piece)
            for (let i = 0; i < currentCellIndex.length; i++) {
                cells[currentCellIndex[i]].classList.remove('blue')
                cells[currentCellIndex[i]].removeEventListener('click', placePawn)
            }
            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()
        }
    }
}

function getX(index) {
    const x = index % 8

    return x
}
function getY(index, x) {
    const y = (index - x) / 8
    return y
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
        new Pawn(i, 1, 'pawn', 'black', true)
    }
    for (let i = 0; i < 8; i++) {
        new Pawn(i, 6, 'pawn', 'white', true)
    }

    new Rook(0, 7, 'rook', 'white')
    new Rook(7, 7, 'rook', 'white')
    new Knight(1, 7, 'knight', 'white')
    new Knight(6, 7, 'knight', 'white')
    new Bishop(2, 7, 'bishop', 'white')
    new Bishop(5, 7, 'bishop', 'white')
    new Queen(3, 7, 'queen', 'white')
    new King(4, 7, 'king', 'white')

    new Rook(0, 5, 'rook', 'black')
    new Rook(7, 0, 'rook', 'black')
    new Knight(1, 0, 'knight', 'black')
    new Knight(6, 0, 'knight', 'black')
    new Bishop(2, 5, 'bishop', 'black')
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
    if (blackTurn === false) {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].id !== '' && cells[i].classList.contains('white')) {
                cells[i].addEventListener('click', movePiece)
            }
        }
    } else {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].id !== '' && cells[i].classList.contains('black')) {
                cells[i].addEventListener('click', movePiece)
            }
        }
    }
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



function changeTurn() {
    blackTurn = !blackTurn
}

const whoseTurn = () => blackTurn ? 'Black' : 'White'
turnIndicator.textContent = `Player ${whoseTurn()} Turn`

document.body.append(turnIndicator, chessBoard)



