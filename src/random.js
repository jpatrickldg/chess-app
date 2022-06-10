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


const cellBoard = [[], [], [], [], [], [], [], []]
cells.forEach((element,index) => {
    let x = index % 8
    let y = (index - x) / 8
    cellBoard[x][y] = element
})

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
                yCopy.push(this.y + 2)
            }
            else {
                yCopy.push(this.y - 1)
                yCopy.push(this.y - 2)
            }
        } else {
            if (this.color === 'black') yCopy.push(this.y + 1)
            else yCopy.push(this.y - 1)
        }

        //Check Collisions


        //Coordinates for capture

        const existingIndex = convertIndex(this.x, this.y)

        for (let i = 0; i < yCopy.length; i++) {
            currentCellIndex.push(convertIndex(this.x, yCopy[i]))
            cells[currentCellIndex[i]].classList.add('blue')
            cells[currentCellIndex[i]].addEventListener('click', placePawn)
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
        //Capture Function
        const capture = (e)=>{
            const targetCell = e.target
            const cellIndex = Array.from(targetCell.parentElement.children).indexOf(targetCell)
            let x = cellIndex % 8
            let y = (cellIndex - x)/8
            if(blackTurn === true){
                cellBoard[this.x][this.y].classList.remove("black")
                cellBoard[this.x][y].classList.remove("white")
                new Rook(x,y,'rook', 'black')
            }else{
                cellBoard[this.x][this.y].classList.remove("white")
                cellBoard[this.x][y].classList.remove("black")
                new Rook(x,y,'rook', 'white')
            }
            board[this.x][this.y]={}
            cellBoard[this.x][this.y].id = ""
            
            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()

            cellBoard[this.x][y].removeEventListener("click",capture)

            for (let i = 0; i < cells.length; i++) {
                    cells[i].classList.remove("blue")
                } 
            for (let i = 0 ; i < 8; i++) {
                cellBoard[this.x][i].removeEventListener("click",capture)
                cellBoard[i][this.y].removeEventListener("click",capture)
            }
        }
        //Bottom
        for (let i = this.y+1 ; i < 8; i++) {
            if(blackTurn === true){
                if(board[this.x][i].color === "black"){
                    break
                }else if(board[this.x][i].color === "white"){
                    cellBoard[this.x][i].addEventListener("click",capture)
                    cellBoard[this.x][i].classList.add("blue")
                    break
                }else{
                    cellBoard[this.x][i].addEventListener("click",capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            }else{
                if(board[this.x][i].color === "white"){
                    break
                }else if(board[this.x][i].color === "black"){
                    cellBoard[this.x][i].addEventListener("click",capture)
                    cellBoard[this.x][i].classList.add("blue")
                    break
                }else{
                    cellBoard[this.x][i].addEventListener("click",capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            }
        }
        //Top
        for (let i = this.y-1 ; i > -1; i--) {
            if(blackTurn === true){
                if(board[this.x][i].color === "black"){
                    break
                }else if(board[this.x][i].color === "white"){
                    cellBoard[this.x][i].addEventListener("click",capture)
                    cellBoard[this.x][i].classList.add("blue")
                    break
                }else{
                    cellBoard[this.x][i].addEventListener("click",capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            }else{
                if(board[this.x][i].color === "white"){
                    break
                }else if(board[this.x][i].color === "black"){
                    cellBoard[this.x][i].addEventListener("click",capture)
                    cellBoard[this.x][i].classList.add("blue")
                    break
                }else{
                    cellBoard[this.x][i].addEventListener("click",capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            }
        }
        //Left
        for (let i = this.x-1 ; i > -1; i--) {
            if(blackTurn === true){
                if(board[i][this.y].color === "black"){
                    break
                }else if(board[i][this.y].color === "white"){
                    cellBoard[i][this.y].addEventListener("click",capture)
                    cellBoard[i][this.y].classList.add("blue")
                    break
                }else{
                    cellBoard[i][this.y].addEventListener("click",capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            }else{
                if(board[i][this.y].color === "white"){
                    break
                }else if(board[i][this.y].color === "black"){
                    cellBoard[i][this.y].addEventListener("click",capture)
                    cellBoard[i][this.y].classList.add("blue")
                    break
                }else{
                    cellBoard[i][this.y].addEventListener("click",capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            }
        }
         //Right
         for (let i = this.x+1 ; i < 8; i++) {
            if(blackTurn === true){
                if(board[i][this.y].color === "black"){
                    break
                }else if(board[i][this.y].color === "white"){
                    cellBoard[i][this.y].addEventListener("click",capture)
                    cellBoard[i][this.y].classList.add("blue")
                    break
                }else{
                    cellBoard[i][this.y].addEventListener("click",capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            }else{
                if(board[i][this.y].color === "white"){
                    break
                }else if(board[i][this.y].color === "black"){
                    cellBoard[i][this.y].addEventListener("click",capture)
                    cellBoard[i][this.y].classList.add("blue")
                    break
                }else{
                    cellBoard[i][this.y].addEventListener("click",capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            }
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
    new Rook(3, 4, 'rook', 'white')
    new Knight(1, 7, 'knight', 'white')
    new Knight(6, 7, 'knight', 'white')
    new Bishop(2, 7, 'bishop', 'white')
    new Bishop(5, 7, 'bishop', 'white')
    new Queen(3, 7, 'queen', 'white')
    new King(4, 7, 'king', 'white')

    new Rook(4, 4, 'rook', 'black')
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



