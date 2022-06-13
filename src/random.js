const turnIndicator = document.createElement('h3')
const chessBoard = document.createElement('main')
chessBoard.setAttribute('id', 'chess-board')
chessBoard.classList.add('chessboard')

let cells = []
let blackTurn = false;
let lastMoveIndex, squaresMoved //TO CHECK FOR EN PASSANT

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
cells.forEach((element, index) => {
    let x = index % 8
    let y = (index - x) / 8
    cellBoard[x][y] = element
})

function convertIndex(x, y) {
    let index = (y * 8) + x
    return index
}

function getX(index) {
    const x = index % 8
    return x
}

function getY(index, x) {
    const y = (index - x) / 8
    return y
}

function removeID(index) {
    cells[index].id = ''
}

function addCellClassAndID(index, object) {
    cells[index].id = `${object.color}-${object.name}`
    cells[index].classList.add(object.color)
}

function passMovePieceParams(piece, originIndex, openCellIndex, captureCellIndex) {
    return function movePiece(e) {
        const clickedSquare = e.target
        const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)
        //GET TARGET CELL COORDINATES
        let x = getX(clickedSquareIndex)
        let y = getY(clickedSquareIndex, x)

        if (originIndex === clickedSquareIndex) { //CHECK IF TARGET CELL IS THE SAME AS THE ORIGIN
            //RESET
            //REMOVE LISTENER/CLASS OF ALL POSSIBLE MOVES ONCE A SPOT IS SELECTED
            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', movePiece)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', movePiece)
            }
            cells[clickedSquareIndex].classList.remove('gray')
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].classList.contains('pink')) {
                    cells[i].classList.remove('pink')
                    break
                }
            }
            addListenerToOccupiedSquare()
        } else {
            lastMoveIndex = clickedSquareIndex
            //PAWN EXCLUSIVE
            //REMOVE CELL/BOARD DATA FOR EN PASSANT
            if (cells[clickedSquareIndex].classList.contains('pink')) {
                if (piece.color === 'black') {
                    board[x][y - 1] = {}
                    removeID(convertIndex(x, y - 1))
                    cells[convertIndex(x, y - 1)].classList.remove('white')
                } else if (piece.color === 'white') {
                    board[x][y + 1] = {}
                    removeID(convertIndex(x, y + 1))
                    cells[convertIndex(x, y + 1)].classList.remove('black')
                }
                cells[clickedSquareIndex].classList.remove('pink')
                cells[clickedSquareIndex].removeEventListener('click', movePiece) //REMOVE LISTENER OF EN PASSANT CELL FROM PAWNMOVES()
            }

            //RESET
            //REMOVE LISTENER/CLASS OF ALL POSSIBLE MOVES ONCE A SPOT IS SELECTED
            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', movePiece)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', movePiece)
            }
            board[piece.x][piece.y] = {} //EMPTY THE OBJECT FROM ORIGINAL POSITION
            removeID(originIndex) //REMOVE ID FROM ORIGINAL POSITION
            //REMOVE CLASSES FROM ORIGINAL POSITION
            cells[originIndex].classList.remove('black')
            cells[originIndex].classList.remove('white')
            cells[originIndex].classList.remove('gray')

            //MOVE
            //CHANGE CLASS OF TARGET CELL ACCORDINGLY
            if (cells[clickedSquareIndex].classList.contains('black')) {
                cells[clickedSquareIndex].classList.replace('black', 'white')
            } else if (cells[clickedSquareIndex].classList.contains('white')) {
                cells[clickedSquareIndex].classList.replace('white', 'black')
            }

            board[x][y] = piece //MOVE THE PIECE TO THE TARGET BOARD SPOT
            piece.x = x //UPDATE THE X-COORDINATE INTO THE TARGET'S X-COORDINATE
            piece.y = y //UPDATE THE Y-COORDINATE INTO THE TARGET'S Y-COORDINATE

            //PAWN EXCLUSIVE
            //CHECK FOR PROMOTION
            if (piece.name === 'pawn' && (piece.y === 0 || piece.y === 7)) {
                const promoBg = document.createElement('div')
                promoBg.classList.add('promo-bg')
                const promoContainer = document.createElement('div')
                promoContainer.classList.add('promo-container')
                promoBg.appendChild(promoContainer)
                const rookBox = document.createElement('div')
                rookBox.classList.add('box')
                const knightBox = document.createElement('div')
                knightBox.classList.add('box')
                const bishopBox = document.createElement('div')
                bishopBox.classList.add('box')
                const queenBox = document.createElement('div')
                queenBox.classList.add('box')
                promoContainer.append(rookBox, knightBox, bishopBox, queenBox)

                if (piece.y === 0) {
                    rookBox.setAttribute('id', 'white-rook')
                    knightBox.setAttribute('id', 'white-knight')
                    bishopBox.setAttribute('id', 'white-bishop')
                    queenBox.setAttribute('id', 'white-queen')
                    document.body.append(promoBg)

                    rookBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Rook(x, y, 'rook', 'white')
                        promoBg.remove()
                    })

                    knightBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Knight(x, y, 'knight', 'white')
                        promoBg.remove()
                    })

                    bishopBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Bishop(x, y, 'bishop', 'white')
                        promoBg.remove()
                    })

                    queenBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Queen(x, y, 'queen', 'white')
                        promoBg.remove()
                    })
                } else if (piece.y === 7) {
                    rookBox.setAttribute('id', 'black-rook')
                    knightBox.setAttribute('id', 'black-knight')
                    bishopBox.setAttribute('id', 'black-bishop')
                    queenBox.setAttribute('id', 'black-queen')
                    document.body.append(promoBg)

                    rookBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Rook(x, y, 'rook', 'black')
                        promoBg.remove()
                    })

                    knightBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Knight(x, y, 'knight', 'black')
                        promoBg.remove()
                    })

                    bishopBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Bishop(x, y, 'bishop', 'black')
                        promoBg.remove()
                    })

                    queenBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Queen(x, y, 'queen', 'black')
                        promoBg.remove()
                    })
                }
            }

            if (piece.name === 'pawn') {
                piece.firstTurn = false
                if (clickedSquareIndex - originIndex === 8 || originIndex - clickedSquareIndex === 8) {
                    squaresMoved = 1
                } else squaresMoved = 2
            }

            addCellClassAndID(clickedSquareIndex, piece) //ADD PIECE'S CLASS AND ID TO THE TARGET CELL
            // removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()
        }
    }
}


class ChessPiece {
    constructor(x, y, name, color) {
        this.name = name;
        this.color = color;
        this.x = x;
        this.y = y;
        this.place();
        this.addClassAndID();
    }
}

//PLACE THE PIECE ON THE BOARD
ChessPiece.prototype.place = function () {
    board[this.x][this.y] = this;
}

//ADD ID AND CLASS TO CELL EQUIVALENT TO THE BOARD
ChessPiece.prototype.addClassAndID = function () {
    let cellsIndex = (this.y * 8) + this.x
    cells[cellsIndex].id = `${this.color}-${this.name}`
    cells[cellsIndex].classList.add(this.color)
}

class Pawn extends ChessPiece {
    constructor(x, y, name, color, firstTurn) {
        super(x, y, name, color)
        this.firstTurn = firstTurn
    }

    pawnMoves() {
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y)
        let openCellIndex = []
        let captureCellIndex = []
        let encompassantIndex = 0

        //GET POSSIBLE CAPTURE CELLS
        if (this.color === 'black') {
            if (this.x - 1 >= 0) { //CHECK IF X IS OUT OF BOUNDS
                if ((Object.keys(board[this.x - 1][this.y + 1]).length !== 0) && (board[this.x - 1][this.y + 1].color === 'white')) {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y + 1))
                }
            }
            if (this.x + 1 < 8) { //CHECK IF X IS OUT OF BOUNDS
                if ((Object.keys(board[this.x + 1][this.y + 1]).length !== 0) && (board[this.x + 1][this.y + 1].color === 'white')) {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y + 1))
                }
            }
            //CHECK FOR ENCOMPASSANT
            if (this.y === 4) { //ONLY SPOT WHERE EN PASSANT IS POSSIBLE FOR BLACK
                if (this.x - 1 >= 0) { //CHECK IF X IS OUT OF BOUNDS
                    if ((Object.keys(board[this.x - 1][this.y + 1]).length === 0) && (convertIndex(this.x - 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'white-pawn') && (squaresMoved === 2)) {
                        encompassantIndex = (convertIndex(this.x - 1, this.y + 1))
                    }
                }
                if (this.x + 1 < 8) { //CHECK IF X IS OUT OF BOUNDS
                    if ((Object.keys(board[this.x + 1][this.y + 1]).length === 0) && (convertIndex(this.x + 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'white-pawn') && (squaresMoved === 2)) {
                        encompassantIndex = (convertIndex(this.x + 1, this.y + 1))
                    }
                }
            }
        }

        if (this.color === 'white') {
            if (this.x - 1 >= 0) {
                if ((Object.keys(board[this.x - 1][this.y - 1]).length !== 0) && (board[this.x - 1][this.y - 1].color === 'black')) {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y - 1))
                }
            }
            if (this.x + 1 < 8) {
                if ((Object.keys(board[this.x + 1][this.y - 1]).length !== 0) && (board[this.x + 1][this.y - 1].color === 'black')) {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y - 1))
                }
            }
            //CHECK FOR ENCOMPASSANT
            if (this.y === 3) { //ONLY SPOT WHERE EN PASSANT IS POSSIBLE FOR WHITE
                if (this.x - 1 >= 0) {
                    if ((Object.keys(board[this.x - 1][this.y - 1]).length === 0) && (convertIndex(this.x - 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'black-pawn') && (squaresMoved === 2)) {
                        encompassantIndex = (convertIndex(this.x - 1, this.y - 1))
                    }
                }
                if (this.x + 1 < 8) {
                    if ((Object.keys(board[this.x + 1][this.y - 1]).length === 0) && (convertIndex(this.x + 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'black-pawn') && (squaresMoved === 2)) {
                        encompassantIndex = (convertIndex(this.x + 1, this.y - 1))
                    }
                }
            }
        }
        //GET OPEN CELLS
        if (this.firstTurn === true) {
            if (this.color === 'black') {
                for (let i = 1; i < 3; i++) {
                    if (Object.keys(board[this.x][this.y + i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x, this.y + i))
                    } else break
                }
            }
            else if (this.color === 'white') {
                for (let i = 1; i < 3; i++) {
                    if (Object.keys(board[this.x][this.y - i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x, this.y - i))
                    } else break
                }
            }
        } else if (this.firstTurn === false) {
            if (this.color === 'black') {
                if (Object.keys(board[this.x][this.y + 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x, this.y + 1))
                }
            }
            else if (this.color === 'white')
                if (Object.keys(board[this.x][this.y - 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x, this.y - 1))
                }
        }

        const placePiece = passMovePieceParams(piece, originIndex, openCellIndex, captureCellIndex)
        //ADD LISTENER TO THIS FOR UNCLICK
        cells[convertIndex(this.x, this.y)].addEventListener('click', placePiece)
        cells[convertIndex(this.x, this.y)].classList.add('gray')
        //ADD LISTENER/CLASS TO OPEN CELLS 
        for (let i = 0; i < openCellIndex.length; i++) {
            cells[openCellIndex[i]].classList.add('blue')
            cells[openCellIndex[i]].addEventListener('click', placePiece)
        }
        //ADD LISTENER/CLASS TO CAPTURE CELLS
        for (let i = 0; i < captureCellIndex.length; i++) {
            cells[captureCellIndex[i]].classList.add('red')
            cells[captureCellIndex[i]].addEventListener('click', placePiece)
        }
        //ADD LISTENER/CLASS TO EN PASSANT CELL
        if (encompassantIndex !== 0) {
            cells[encompassantIndex].classList.add('pink')
            cells[encompassantIndex].addEventListener('click', placePiece)
        }
    }
}

class Rook extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }
    rookMoves() {
        removeListeners()
        //add listener to its original position
        cells[convertIndex(this.x, this.y)].addEventListener('click', unClicked)
        cells[convertIndex(this.x, this.y)].classList.add('gray')
        function unClicked(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)
            let x = clickedSquareIndex % 8
            let y = (clickedSquareIndex - x) / 8
            // Loop to remove listeners/class
            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.remove("blue")
                cells[i].classList.remove("red")
            }
            for (let i = 0; i < 8; i++) {
                cellBoard[x][i].removeEventListener("click", capture)
                cellBoard[i][y].removeEventListener("click", capture)
            }
            addListenerToOccupiedSquare()
            cells[clickedSquareIndex].removeEventListener('click', unClicked)
            cells[clickedSquareIndex].classList.remove('gray')
        }
        //Capture Function
        const capture = (e) => {
            const targetCell = e.target
            const cellIndex = Array.from(targetCell.parentElement.children).indexOf(targetCell)
            let x = cellIndex % 8
            let y = (cellIndex - x) / 8
            if (blackTurn === true) {
                cellBoard[this.x][this.y].classList.remove("black")
                cellBoard[this.x][y].classList.remove("white")
                cellBoard[x][this.y].classList.remove("white")
                new Rook(x, y, 'rook', 'black')
            } else {
                cellBoard[this.x][this.y].classList.remove("white")
                cellBoard[this.x][y].classList.remove("black")
                cellBoard[x][this.y].classList.remove("black")
                new Rook(x, y, 'rook', 'white')
            }
            board[this.x][this.y] = {}
            cellBoard[this.x][this.y].id = ""

            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()

            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.remove("blue")
                cells[i].classList.remove("red")
                cells[i].classList.remove("gray")
            }
            for (let i = 0; i < 8; i++) {
                cellBoard[this.x][i].removeEventListener("click", capture)
                cellBoard[i][this.y].removeEventListener("click", capture)
            }
        }
        //Bottom
        for (let i = this.y + 1; i < 8; i++) {
            if (blackTurn === true) {
                if (board[this.x][i].color === "black") {
                    break
                } else if (board[this.x][i].color === "white") {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("red")
                    break
                } else {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            } else {
                if (board[this.x][i].color === "white") {
                    break
                } else if (board[this.x][i].color === "black") {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("red")
                    break
                } else {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            }
        }
        //Top
        for (let i = this.y - 1; i > -1; i--) {
            if (blackTurn === true) {
                if (board[this.x][i].color === "black") {
                    break
                } else if (board[this.x][i].color === "white") {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("red")
                    break
                } else {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            } else {
                if (board[this.x][i].color === "white") {
                    break
                } else if (board[this.x][i].color === "black") {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("red")
                    break
                } else {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            }
        }
        //Left
        for (let i = this.x - 1; i > -1; i--) {
            if (blackTurn === true) {
                if (board[i][this.y].color === "black") {
                    break
                } else if (board[i][this.y].color === "white") {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("red")
                    break
                } else {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            } else {
                if (board[i][this.y].color === "white") {
                    break
                } else if (board[i][this.y].color === "black") {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("red")
                    break
                } else {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            }
        }
        //Right
        for (let i = this.x + 1; i < 8; i++) {
            if (blackTurn === true) {
                if (board[i][this.y].color === "black") {
                    break
                } else if (board[i][this.y].color === "white") {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("red")
                    break
                } else {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            } else {
                if (board[i][this.y].color === "white") {
                    break
                } else if (board[i][this.y].color === "black") {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("red")
                    break
                } else {
                    cellBoard[i][this.y].addEventListener("click", capture)
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
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        let openCellIndex = []
        let captureCellIndex = []
        let oppositeColor = this.color === 'black' ? 'white' : 'black'

        //BOTTOM
        if (this.y + 2 < 8) {
            if (this.x - 1 >= 0) {
                if (Object.keys(board[this.x - 1][this.y + 2]).length === 0) {
                    openCellIndex.push(convertIndex(this.x - 1, this.y + 2))
                } else if (board[this.x - 1][this.y + 2].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y + 2))
                }
            }
            if (this.x + 1 < 8) {
                if (Object.keys(board[this.x + 1][this.y + 2]).length === 0) {
                    openCellIndex.push(convertIndex(this.x + 1, this.y + 2))
                } else if (board[this.x + 1][this.y + 2].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y + 2))
                }
            }
        }
        //TOP
        if (this.y - 2 >= 0) {
            if (this.x - 1 >= 0) {
                if (Object.keys(board[this.x - 1][this.y - 2]).length === 0) {
                    openCellIndex.push(convertIndex(this.x - 1, this.y - 2))
                } else if (board[this.x - 1][this.y - 2].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y - 2))
                }
            }
            if (this.x + 1 < 8) {
                if (Object.keys(board[this.x + 1][this.y - 2]).length === 0) {
                    openCellIndex.push(convertIndex(this.x + 1, this.y - 2))
                } else if (board[this.x + 1][this.y - 2].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y - 2))
                }
            }
        }
        //LEFT
        if (this.x - 2 >= 0) {
            if (this.y - 1 >= 0) {
                if (Object.keys(board[this.x - 2][this.y - 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x - 2, this.y - 1))
                } else if (board[this.x - 2][this.y - 1].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x - 2, this.y - 1))
                }
            }
            if (this.y + 1 < 8) {
                if (Object.keys(board[this.x - 2][this.y + 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x - 2, this.y + 1))
                } else if (board[this.x - 2][this.y + 1].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x - 2, this.y + 1))
                }
            }
        }
        //RIGHT
        if (this.x + 2 < 8) {
            if (this.y - 1 >= 0) {
                if (Object.keys(board[this.x + 2][this.y - 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x + 2, this.y - 1))
                } else if (board[this.x + 2][this.y - 1].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x + 2, this.y - 1))
                }
            }
            if (this.y + 1 < 8) {
                if (Object.keys(board[this.x + 2][this.y + 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x + 2, this.y + 1))
                } else if (board[this.x + 2][this.y + 1].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x + 2, this.y + 1))
                }
            }
        }
        const placePiece = passMovePieceParams(piece, originIndex, openCellIndex, captureCellIndex)
        //ADD LISTENER TO THIS FOR UNCLICK
        cells[convertIndex(this.x, this.y)].addEventListener('click', placePiece)
        cells[convertIndex(this.x, this.y)].classList.add('gray')

        for (let i = 0; i < openCellIndex.length; i++) {
            cells[openCellIndex[i]].classList.add('blue')
            cells[openCellIndex[i]].addEventListener('click', placePiece)
        }
        for (let i = 0; i < captureCellIndex.length; i++) {
            cells[captureCellIndex[i]].classList.add('red')
            cells[captureCellIndex[i]].addEventListener('click', placePiece)
        }
    }
}

class Bishop extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    bishopMoves() {
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        let openCellIndex = []
        let captureCellIndex = []
        let oppositeColor = this.color === 'black' ? 'white' : 'black'

        //TOP-LEFT
        for (let i = 1; i < 8; i++) {
            if (this.y - i >= 0) {
                if (this.x - i >= 0) {
                    if (Object.keys(board[this.x - i][this.y - i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - i, this.y - i))
                    } else if (board[this.x - i][this.y - i].color === oppositeColor) {
                        captureCellIndex.push(convertIndex(this.x - i, this.y - i))
                        break
                    } else break
                } else break
            }
        }
        //TOP-RIGHT
        for (let i = 1; i < 8; i++) {
            if (this.y - i >= 0) {
                if (this.x + i < 8) {
                    if (Object.keys(board[this.x + i][this.y - i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + i, this.y - i))
                    } else if (board[this.x + i][this.y - i].color === oppositeColor) {
                        captureCellIndex.push(convertIndex(this.x + i, this.y - i))
                        break
                    } else break
                } else break
            }
        }
        //BOTTOM-LEFT
        for (let i = 1; i < 8; i++) {
            if (this.y + i < 8) {
                if (this.x - i >= 0) {
                    if (Object.keys(board[this.x - i][this.y + i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - i, this.y + i))
                    } else if (board[this.x - i][this.y + i].color === oppositeColor) {
                        captureCellIndex.push(convertIndex(this.x - i, this.y + i))
                        break
                    } else break
                } else break
            }
        }
        //BOTTOM-RIGHT
        for (let i = 1; i < 8; i++) {
            if (this.y + i < 8) {
                if (this.x + i < 8) {
                    if (Object.keys(board[this.x + i][this.y + i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + i, this.y + i))
                    } else if (board[this.x + i][this.y + i].color === oppositeColor) {
                        captureCellIndex.push(convertIndex(this.x + i, this.y + i))
                        break
                    } else break
                } else break
            } else break
        }

        const placePiece = passMovePieceParams(piece, originIndex, openCellIndex, captureCellIndex)
        //ADD LISTENER TO THIS FOR UNCLICK
        cells[convertIndex(this.x, this.y)].addEventListener('click', placePiece)
        cells[convertIndex(this.x, this.y)].classList.add('gray')

        for (let i = 0; i < openCellIndex.length; i++) {
            cells[openCellIndex[i]].classList.add('blue')
            cells[openCellIndex[i]].addEventListener('click', placePiece)
        }
        for (let i = 0; i < captureCellIndex.length; i++) {
            cells[captureCellIndex[i]].classList.add('red')
            cells[captureCellIndex[i]].addEventListener('click', placePiece)
        }
    }
}

class Queen extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    queenMoves() {
        //from RookMoves
        removeListeners()
        cells[convertIndex(this.x, this.y)].addEventListener('click', unClicked)
        cells[convertIndex(this.x, this.y)].classList.add('gray')
        function unClicked(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)
            let x = clickedSquareIndex % 8
            let y = (clickedSquareIndex - x) / 8
            // Loop to remove listeners/class
            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.remove("blue")
                cells[i].classList.remove("red")
            }
            for (let i = 0; i < 8; i++) {
                cellBoard[x][i].removeEventListener("click", capture)
                cellBoard[i][y].removeEventListener("click", capture)
            }
            // from bishop
            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placeBishop)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placeBishop)
            }
            addListenerToOccupiedSquare()
            cells[clickedSquareIndex].removeEventListener('click', unClicked)
            cells[clickedSquareIndex].classList.remove('gray')
        }
        //Capture Function
        const capture = (e) => {
            const targetCell = e.target
            const cellIndex = Array.from(targetCell.parentElement.children).indexOf(targetCell)
            let x = cellIndex % 8
            let y = (cellIndex - x) / 8
            if (blackTurn === true) {
                cellBoard[this.x][this.y].classList.remove("black")
                cellBoard[this.x][y].classList.remove("white")
                cellBoard[x][this.y].classList.remove("white")
                new Queen(x,y,'queen', 'black')
            }else{
                cellBoard[this.x][this.y].classList.remove("white")
                cellBoard[this.x][y].classList.remove("black")
                cellBoard[x][this.y].classList.remove("black")
                new Queen(x,y,'queen', 'white')
            }
            board[this.x][this.y] = {}
            cellBoard[this.x][this.y].id = ""

            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()

            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.remove("blue")
                cells[i].classList.remove("red")
                cells[i].classList.remove("gray")
            }
            for (let i = 0; i < 8; i++) {
                cellBoard[this.x][i].removeEventListener("click", capture)
                cellBoard[i][this.y].removeEventListener("click", capture)
            }
            //bishop remove listener
            for (let i = 0; i < openCellIndex.length; i++) {
                // cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placeBishop)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                // cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placeBishop)
            }
        }
        //Bottom
        for (let i = this.y + 1; i < 8; i++) {
            if (blackTurn === true) {
                if (board[this.x][i].color === "black") {
                    break
                } else if (board[this.x][i].color === "white") {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("red")
                    break
                } else {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            } else {
                if (board[this.x][i].color === "white") {
                    break
                } else if (board[this.x][i].color === "black") {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("red")
                    break
                } else {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            }
        }
        //Top
        for (let i = this.y - 1; i > -1; i--) {
            if (blackTurn === true) {
                if (board[this.x][i].color === "black") {
                    break
                } else if (board[this.x][i].color === "white") {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("red")
                    break
                } else {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            } else {
                if (board[this.x][i].color === "white") {
                    break
                } else if (board[this.x][i].color === "black") {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("red")
                    break
                } else {
                    cellBoard[this.x][i].addEventListener("click", capture)
                    cellBoard[this.x][i].classList.add("blue")
                }
            }
        }
        //Left
        for (let i = this.x - 1; i > -1; i--) {
            if (blackTurn === true) {
                if (board[i][this.y].color === "black") {
                    break
                } else if (board[i][this.y].color === "white") {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("red")
                    break
                } else {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            } else {
                if (board[i][this.y].color === "white") {
                    break
                } else if (board[i][this.y].color === "black") {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("red")
                    break
                } else {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            }
        }
        //Right
        for (let i = this.x + 1; i < 8; i++) {
            if (blackTurn === true) {
                if (board[i][this.y].color === "black") {
                    break
                } else if (board[i][this.y].color === "white") {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("red")
                    break
                } else {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            } else {
                if (board[i][this.y].color === "white") {
                    break
                } else if (board[i][this.y].color === "black") {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("red")
                    break
                } else {
                    cellBoard[i][this.y].addEventListener("click", capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            }
        }
        //From Bishop Moves
        let piece = this
        const originIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        let openCellIndex = []
        let captureCellIndex = []
        let oppositeColor = this.color === 'black' ? 'white' : 'black'

        //Top Going Left
        for (let i = 1; i < 9; i++) {
            if (this.y - i >= 0) {
                if (this.x - i >= 0) {
                    if (Object.keys(board[this.x - i][this.y - i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - i, this.y - i))
                    } else if (board[this.x - i][this.y - i].color === oppositeColor) {
                        captureCellIndex.push(convertIndex(this.x - i, this.y - i))
                        break
                    } else break
                } else break
            }
        }
        //Top Going Right
        for (let i = 1; i < 9; i++) {
            if (this.y - i >= 0) {
                if (this.x + i < 8) {
                    if (Object.keys(board[this.x + i][this.y - i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + i, this.y - i))
                    } else if (board[this.x + i][this.y - i].color === oppositeColor) {
                        captureCellIndex.push(convertIndex(this.x + i, this.y - i))
                        break
                    } else break
                } else break
            }
        }
        //Bottom Going Left
        for (let i = 1; i < 9; i++) {
            if (this.y + i < 8) {
                if (this.x - i >= 0) {
                    if (Object.keys(board[this.x - i][this.y + i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - i, this.y + i))
                    } else if (board[this.x - i][this.y + i].color === oppositeColor) {
                        captureCellIndex.push(convertIndex(this.x - i, this.y + i))
                        break
                    } else break
                } else break
            }
        }
        //Bottom Going Right
        for (let i = 1; i < 9; i++) {
            if (this.y + i < 8) {
                if (this.x + i < 8) {
                    if (Object.keys(board[this.x + i][this.y + i]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + i, this.y + i))
                        console.log(i, openCellIndex)
                        console.log(captureCellIndex)
                    } else if (board[this.x + i][this.y + i].color === oppositeColor) {
                        console.log(i)
                        captureCellIndex.push(convertIndex(this.x + i, this.y + i))
                        console.log(i, captureCellIndex)
                        break
                    } else break
                } else break
            } else break
        }

        for (let i = 0; i < openCellIndex.length; i++) {
            cells[openCellIndex[i]].classList.add('blue')
            cells[openCellIndex[i]].addEventListener('click', placeBishop)
        }

        for (let i = 0; i < captureCellIndex.length; i++) {
            cells[captureCellIndex[i]].classList.add('red')
            cells[captureCellIndex[i]].addEventListener('click', placeBishop)
        }

        function placeBishop(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)

            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placeBishop)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placeBishop)
            }
            //from rook
            for (let i = 0; i < cells.length; i++) {
                cells[i].classList.remove("blue")
                cells[i].classList.remove("red")
            }
            for (let i = 0; i < 8; i++) {
                cellBoard[piece.x][i].removeEventListener("click", capture)
                cellBoard[i][piece.y].removeEventListener("click", capture)
            }

            board[piece.x][piece.y] = {} //epmty the object afte the piece move
            removeID(originIndex) //remove the id from the cell

            //remove classes from cell where the piece came from
            cells[originIndex].classList.remove('black')
            cells[originIndex].classList.remove('white')
            cells[originIndex].classList.remove('gray')

            //Change the class of the cell of the target move spot 
            if (cells[clickedSquareIndex].classList.contains('black')) {
                cells[clickedSquareIndex].classList.replace('black', 'white')
            } else if (cells[clickedSquareIndex].classList.contains('white')) {
                cells[clickedSquareIndex].classList.replace('white', 'black')
            }

            let x = getX(clickedSquareIndex) //get target cell x-coordinate
            let y = getY(clickedSquareIndex, x) //get target cell y-coordinate

            board[x][y] = piece //move the piece into the target board spot
            piece.x = x //change the piece's x into the target x
            piece.y = y //change the piece's y into the target y
            piece.firstTurn = false

            addCellClassAndID(clickedSquareIndex, piece)

            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()
        }
    }
}

class King extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    kingMoves() {
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        let openCellIndex = []
        let captureCellIndex = []
        let oppositeColor = this.color === 'black' ? 'white' : 'black'

        if (this.y - 1 >= 0) {
            //TOP
            if (Object.keys(board[this.x][this.y - 1]).length === 0) {
                openCellIndex.push(convertIndex(this.x, this.y - 1))
            } else if (board[this.x][this.y - 1].color === oppositeColor) {
                captureCellIndex.push(convertIndex(this.x, this.y - 1))
            }
            //TOP-LEFT
            if (this.x - 1 >= 0) {
                if (Object.keys(board[this.x - 1][this.y - 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x - 1, this.y - 1))
                } else if (board[this.x - 1][this.y - 1].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y - 1))
                }
            }
            //TOP-RIGHT
            if (this.x + 1 < 8) {
                if (Object.keys(board[this.x + 1][this.y - 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x + 1, this.y - 1))
                } else if (board[this.x + 1][this.y - 1].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y - 1))
                }
            }
        }

        if (this.y + 1 < 8) {
            //BOTTOM
            if (Object.keys(board[this.x][this.y + 1]).length === 0) {
                openCellIndex.push(convertIndex(this.x, this.y + 1))
            } else if (board[this.x][this.y + 1].color === oppositeColor) {
                captureCellIndex.push(convertIndex(this.x, this.y + 1))
            }
            //BOTTOM-LEFT
            if (this.x - 1 >= 0) {
                if (Object.keys(board[this.x - 1][this.y + 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x - 1, this.y + 1))
                } else if (board[this.x - 1][this.y + 1].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y + 1))
                }
            }
            //BOTTOM-RIGHT
            if (this.x + 1 < 8) {
                if (Object.keys(board[this.x + 1][this.y + 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x + 1, this.y + 1))
                } else if (board[this.x + 1][this.y + 1].color === oppositeColor) {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y + 1))
                }
            }
        }

        //LEFT
        if (this.x - 1 >= 0) {
            if (Object.keys(board[this.x - 1][this.y]).length === 0) {
                openCellIndex.push(convertIndex(this.x - 1, this.y))
            } else if (board[this.x - 1][this.y].color === oppositeColor) {
                captureCellIndex.push(convertIndex(this.x - 1, this.y))
            }
        }
        //RIGHT
        if (this.x + 1 < 8) {
            if (Object.keys(board[this.x + 1][this.y]).length === 0) {
                openCellIndex.push(convertIndex(this.x + 1, this.y))
            } else if (board[this.x + 1][this.y].color === oppositeColor) {
                captureCellIndex.push(convertIndex(this.x + 1, this.y))
            }
        }

        const placePiece = passMovePieceParams(piece, originIndex, openCellIndex, captureCellIndex)
        //ADD LISTENER TO THIS FOR UNCLICK
        cells[convertIndex(this.x, this.y)].addEventListener('click', placePiece)
        cells[convertIndex(this.x, this.y)].classList.add('gray')

        for (let i = 0; i < openCellIndex.length; i++) {
            cells[openCellIndex[i]].classList.add('blue')
            cells[openCellIndex[i]].addEventListener('click', placePiece)
        }
        for (let i = 0; i < captureCellIndex.length; i++) {
            cells[captureCellIndex[i]].classList.add('red')
            cells[captureCellIndex[i]].addEventListener('click', placePiece)
        }
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

function removeListeners() {
    for (let i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', movePiece)
    }
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
    const piece = e.target;
    const pieceIndex = Array.from(piece.parentElement.children).indexOf(piece)
    const x = pieceIndex % 8
    const y = (pieceIndex - x) / 8

    if (board[x][y] === undefined) {
        console.log('error')
    } else if (board[x][y].name === 'pawn') {
        board[x][y].pawnMoves()
    } else if (board[x][y].name === 'rook') {
        board[x][y].rookMoves()
    } else if (board[x][y].name === 'knight') {
        board[x][y].knightMoves()
    } else if (board[x][y].name === 'bishop') {
        board[x][y].bishopMoves()
    } else if (board[x][y].name === 'king') {
        board[x][y].kingMoves()
    } else if (board[x][y].name === 'queen') {
        board[x][y].queenMoves()
    }
}

function changeTurn() {
    blackTurn = !blackTurn
}

const whoseTurn = () => blackTurn ? 'Black' : 'White'
turnIndicator.textContent = `Player ${whoseTurn()} Turn`

document.body.append(turnIndicator, chessBoard)