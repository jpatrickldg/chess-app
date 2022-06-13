const turnIndicator = document.createElement('h3')


const chessBoard = document.createElement('main')
chessBoard.setAttribute('id', 'chess-board')
chessBoard.classList.add('chessboard')

let cells = []
let blackTurn = false;
let lastMoveIndex //To check for encompassant

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

function callBack(piece, existingIndex, openCellIndex, captureCellIndex) {
    return function placePiece(e) {
        console.log('valid')
        const clickedSquare = e.target
        const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)

        for (let i = 0; i < openCellIndex.length; i++) {
            cells[openCellIndex[i]].classList.remove('blue')
            cells[openCellIndex[i]].removeEventListener('click', placePiece)
        }
        for (let i = 0; i < captureCellIndex.length; i++) {
            cells[captureCellIndex[i]].classList.remove('red')
            cells[captureCellIndex[i]].removeEventListener('click', placePiece)
        }

        board[piece.x][piece.y] = {} //epmty the object afte the piece move
        removeID(existingIndex) //remove the id from the cell

        //remove classes from cell where the piece came from
        cells[existingIndex].classList.remove('black')
        cells[existingIndex].classList.remove('white')
        cells[existingIndex].classList.remove('gray')

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

        addIdToCell(clickedSquareIndex, piece)

        removeListeners()
        changeTurn()
        turnIndicator.textContent = `Player ${whoseTurn()} Turn`
        addListenerToOccupiedSquare()
    }
}





class Pawn extends ChessPiece {
    constructor(x, y, name, color, firstTurn) {
        super(x, y, name, color)
        this.firstTurn = firstTurn
    }

    pawnMoves() {
        removeListeners()
        let piece = this
        const existingIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        let yCopy = []
        let openCellIndex = []
        let captureCellIndex = []
        let encompassantIndex = 0

        //add listener to its original position
        cells[convertIndex(this.x, this.y)].addEventListener('click', unClicked)
        cells[convertIndex(this.x, this.y)].classList.add('gray')

        /////////Get Capture Cells
        if (this.color === 'black') {
            if (this.x - 1 >= 0) { //Condition to check if x-coordinate is out of bounds
                if ((Object.keys(board[this.x - 1][this.y + 1]).length !== 0) && (board[this.x - 1][this.y + 1].color === 'white')) {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y + 1))
                }
            }

            if (this.x + 1 <= 7) { //Condition to check if x-coordinate is out of bounds
                if ((Object.keys(board[this.x + 1][this.y + 1]).length !== 0) && (board[this.x + 1][this.y + 1].color === 'white')) {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y + 1))
                }
            }

            //En compassant capture
            if (this.y === 4) {
                if (this.x + 1 < 8) {
                    if ((Object.keys(board[this.x + 1][this.y + 1]).length === 0) && (convertIndex(this.x + 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'white-pawn')) {
                        encompassantIndex = (convertIndex(this.x + 1, this.y + 1))
                    }
                }
                if (this.x - 1 >= 0) {
                    if ((Object.keys(board[this.x - 1][this.y + 1]).length === 0) && (convertIndex(this.x - 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'white-pawn')) {
                        encompassantIndex = (convertIndex(this.x - 1, this.y + 1))
                    }
                }
            }

        }

        if (this.color === 'white') {
            if (this.x - 1 >= 0) { //Condition to check if x-coordinate is out of bounds
                if ((Object.keys(board[this.x - 1][this.y - 1]).length !== 0) && (board[this.x - 1][this.y - 1].color === 'black')) {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y - 1))
                }
            }

            if (this.x + 1 <= 7) { //Condition to check if x-coordinate is out of bounds
                if ((Object.keys(board[this.x + 1][this.y - 1]).length !== 0) && (board[this.x + 1][this.y - 1].color === 'black')) {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y - 1))
                }
            }

            //en compassant
            if (this.y === 3) {
                if (this.x + 1 < 8) {
                    if ((Object.keys(board[this.x + 1][this.y - 1]).length === 0) && (convertIndex(this.x + 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'black-pawn')) {
                        encompassantIndex = (convertIndex(this.x + 1, this.y - 1))
                    }
                }
                if (this.x - 1 >= 0) {
                    if ((Object.keys(board[this.x - 1][this.y - 1]).length === 0) && (convertIndex(this.x - 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'black-pawn')) {
                        encompassantIndex = (convertIndex(this.x - 1, this.y - 1))
                    }
                }
            }
        }
        /////////////////

        ///////////Get Open Cells to move
        if (this.firstTurn === true) {
            if (this.color === 'black') {

                for (let i = 1; i < 3; i++) {
                    if (Object.keys(board[this.x][this.y + i]).length === 0) {
                        yCopy.push(this.y + i)
                    } else break
                }
            }
            else if (this.color === 'white') {
                for (let i = 1; i < 3; i++) {
                    if (Object.keys(board[this.x][this.y - i]).length === 0) {
                        yCopy.push(this.y - i)
                    } else break
                }
            }
        } else if (this.firstTurn === false) {
            if (this.color === 'black') {
                if (Object.keys(board[this.x][this.y + 1]).length === 0) {
                    yCopy.push(this.y + 1)
                }
            }
            else if (this.color === 'white')
                if (Object.keys(board[this.x][this.y - 1]).length === 0) {
                    yCopy.push(this.y - 1)
                }
        }

        for (let i = 0; i < yCopy.length; i++) {
            openCellIndex.push(convertIndex(this.x, yCopy[i]))
            cells[openCellIndex[i]].classList.add('blue')
            cells[openCellIndex[i]].addEventListener('click', placePawn)
        }

        for (let i = 0; i < captureCellIndex.length; i++) {
            cells[captureCellIndex[i]].classList.add('red')
            cells[captureCellIndex[i]].addEventListener('click', placePawn)
        }

        if (encompassantIndex !== 0) {
            cells[encompassantIndex].classList.add('pink')
            cells[encompassantIndex].addEventListener('click', placePawn)
        }

        console.log(openCellIndex)

        function placePawn(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)
            lastMoveIndex = clickedSquareIndex
            console.log(lastMoveIndex)


            //Loop to remove listeners/class
            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placePawn)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placePawn)
            }

            board[piece.x][piece.y] = {} //epmty the object afte the piece move
            removeID(existingIndex) //remove the id from the cell

            //remove classes from cell where the piece came from
            cells[existingIndex].classList.remove('black')
            cells[existingIndex].classList.remove('white')
            cells[existingIndex].classList.remove('gray')

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

            //Check if encompassant
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
            }
            cells[clickedSquareIndex].classList.remove('pink')
            cells[clickedSquareIndex].removeEventListener('click', placePawn)

            addIdToCell(clickedSquareIndex, piece)

            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()
        }

        function unClicked(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)

            //Loop to remove listeners/class
            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placePawn)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placePawn)
            }

            addListenerToOccupiedSquare()
            cells[clickedSquareIndex].removeEventListener('click', unClicked)
            cells[clickedSquareIndex].classList.remove('gray')
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
let blackLeftRookFirstMove = true
let blackRightRookFirstMove = true
let whiteLeftRookFirstMove = true
let whiteRightRookFirstMove = true
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
                new Rook(x, y, 'rook', 'black')
            } else {
                cellBoard[this.x][this.y].classList.remove("white")
                cellBoard[this.x][y].classList.remove("black")
                new Rook(x, y, 'rook', 'white')
            }
            board[this.x][this.y] = {}
            cellBoard[this.x][this.y].id = ""

            if(blackTurn===true){
                if(cellBoard[0][0].id === ""){
                    blackLeftRookFirstMove = false
                }else if(cellBoard[7][0].id === ""){
                    blackRightRookFirstMove = false
                }
            }else if(blackTurn===false){
                if(cellBoard[0][7].id === ""){
                    whiteLeftRookFirstMove = false
                }else if(cellBoard[7][7].id === ""){
                    whiteRightRookFirstMove = false
                }
            }
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
        const existingIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        let openCellIndex = []
        let captureCellIndex = []

        //add listener to its original position
        cells[convertIndex(this.x, this.y)].addEventListener('click', unClicked)
        cells[convertIndex(this.x, this.y)].classList.add('gray')

        if (this.color === 'black') {
            //Bottom
            if (this.y + 2 < 8) {
                if (this.x - 1 >= 0) {
                    if (Object.keys(board[this.x - 1][this.y + 2]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 1, this.y + 2))
                    } else if (board[this.x - 1][this.y + 2].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x - 1, this.y + 2))
                    }
                }
                if (this.x + 1 < 8) {
                    if (Object.keys(board[this.x + 1][this.y + 2]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 1, this.y + 2))
                    } else if (board[this.x + 1][this.y + 2].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x + 1, this.y + 2))
                    }
                }
            }
            //Top
            if (this.y - 2 >= 0) {
                if (this.x - 1 >= 0) {
                    if (Object.keys(board[this.x - 1][this.y - 2]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 1, this.y - 2))
                    } else if (board[this.x - 1][this.y - 2].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x - 1, this.y - 2))
                    }
                }
                if (this.x + 1 < 8) {
                    if (Object.keys(board[this.x + 1][this.y - 2]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 1, this.y - 2))
                    } else if (board[this.x + 1][this.y - 2].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x + 1, this.y - 2))
                    }
                }
            }
            //Left
            if (this.x - 2 >= 0) {
                if (this.y - 1 >= 0) {
                    if (Object.keys(board[this.x - 2][this.y - 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 2, this.y - 1))
                    } else if (board[this.x - 2][this.y - 1].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x - 2, this.y - 1))
                    }
                }
                if (this.y + 1 < 8) {
                    if (Object.keys(board[this.x - 2][this.y + 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 2, this.y + 1))
                    } else if (board[this.x - 2][this.y + 1].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x - 2, this.y + 1))
                    }
                }
            }
            //Right
            if (this.x + 2 < 8) {
                if (this.y - 1 >= 0) {
                    if (Object.keys(board[this.x + 2][this.y - 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 2, this.y - 1))
                    } else if (board[this.x + 2][this.y - 1].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x + 2, this.y - 1))
                    }
                }
                if (this.y + 1 < 8) {
                    if (Object.keys(board[this.x + 2][this.y + 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 2, this.y + 1))
                    } else if (board[this.x + 2][this.y + 1].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x + 2, this.y + 1))
                    }
                }
            }
        } else if (this.color === 'white') {
            if (this.y + 2 < 8) {
                if (this.x - 1 >= 0) {
                    if (Object.keys(board[this.x - 1][this.y + 2]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 1, this.y + 2))
                    } else if (board[this.x - 1][this.y + 2].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x - 1, this.y + 2))
                    }
                }
                if (this.x + 1 < 8) {
                    if (Object.keys(board[this.x + 1][this.y + 2]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 1, this.y + 2))
                    } else if (board[this.x + 1][this.y + 2].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x + 1, this.y + 2))
                    }
                }
            }
            //Top
            if (this.y - 2 >= 0) {
                if (this.x - 1 >= 0) {
                    if (Object.keys(board[this.x - 1][this.y - 2]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 1, this.y - 2))
                    } else if (board[this.x - 1][this.y - 2].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x - 1, this.y - 2))
                    }
                }
                if (this.x + 1 < 8) {
                    if (Object.keys(board[this.x + 1][this.y - 2]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 1, this.y - 2))
                    } else if (board[this.x + 1][this.y - 2].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x + 1, this.y - 2))
                    }
                }
            }
            //Left
            if (this.x - 2 >= 0) {
                if (this.y - 1 >= 0) {
                    if (Object.keys(board[this.x - 2][this.y - 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 2, this.y - 1))
                    } else if (board[this.x - 2][this.y - 1].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x - 2, this.y - 1))
                    }
                }
                if (this.y + 1 < 8) {
                    if (Object.keys(board[this.x - 2][this.y + 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 2, this.y + 1))
                    } else if (board[this.x - 2][this.y + 1].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x - 2, this.y + 1))
                    }
                }
            }
            //Right
            if (this.x + 2 < 8) {
                if (this.y - 1 >= 0) {
                    if (Object.keys(board[this.x + 2][this.y - 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 2, this.y - 1))
                    } else if (board[this.x + 2][this.y - 1].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x + 2, this.y - 1))
                    }
                }
                if (this.y + 1 < 8) {
                    if (Object.keys(board[this.x + 2][this.y + 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 2, this.y + 1))
                    } else if (board[this.x + 2][this.y + 1].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x + 2, this.y + 1))
                    }
                }
            }
        }
        console.log(openCellIndex)

        const listener = callBack(piece, existingIndex, openCellIndex, captureCellIndex)

        for (let i = 0; i < openCellIndex.length; i++) {
            cells[openCellIndex[i]].classList.add('blue')
            cells[openCellIndex[i]].addEventListener('click', listener)
        }

        for (let i = 0; i < captureCellIndex.length; i++) {
            cells[captureCellIndex[i]].classList.add('red')
            cells[captureCellIndex[i]].addEventListener('click', listener)
        }

        // function placeKnight(e) {
        //     const clickedSquare = e.target
        //     const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)

        //     for (let i = 0; i < openCellIndex.length; i++) {
        //         cells[openCellIndex[i]].classList.remove('blue')
        //         cells[openCellIndex[i]].removeEventListener('click', placeKnight)
        //     }
        //     for (let i = 0; i < captureCellIndex.length; i++) {
        //         cells[captureCellIndex[i]].classList.remove('red')
        //         cells[captureCellIndex[i]].removeEventListener('click', placeKnight)
        //     }

        //     board[piece.x][piece.y] = {} //epmty the object afte the piece move
        //     removeID(existingIndex) //remove the id from the cell

        //     //remove classes from cell where the piece came from
        //     cells[existingIndex].classList.remove('black')
        //     cells[existingIndex].classList.remove('white')
        //     cells[existingIndex].classList.remove('gray')

        //     //Change the class of the cell of the target move spot 
        //     if (cells[clickedSquareIndex].classList.contains('black')) {
        //         cells[clickedSquareIndex].classList.replace('black', 'white')
        //     } else if (cells[clickedSquareIndex].classList.contains('white')) {
        //         cells[clickedSquareIndex].classList.replace('white', 'black')
        //     }




        //     let x = getX(clickedSquareIndex) //get target cell x-coordinate
        //     let y = getY(clickedSquareIndex, x) //get target cell y-coordinate

        //     board[x][y] = piece //move the piece into the target board spot
        //     piece.x = x //change the piece's x into the target x
        //     piece.y = y //change the piece's y into the target y
        //     piece.firstTurn = false

        //     addIdToCell(clickedSquareIndex, piece)

        //     removeListeners()
        //     changeTurn()
        //     turnIndicator.textContent = `Player ${whoseTurn()} Turn`
        //     addListenerToOccupiedSquare()
        // }

        function unClicked(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)

            //Loop to remove listeners/class
            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placeKnight)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placeKnight)
            }

            addListenerToOccupiedSquare()
            cells[clickedSquareIndex].removeEventListener('click', unClicked)
            cells[clickedSquareIndex].classList.remove('gray')
        }
    }
}

//Bottom

class Bishop extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    bishopMoves() {
        removeListeners()
        let piece = this
        const existingIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        let openCellIndex = []
        let captureCellIndex = []

        //add listener to its original position
        cells[convertIndex(this.x, this.y)].addEventListener('click', unClicked)
        cells[convertIndex(this.x, this.y)].classList.add('gray')

        if (this.color === 'black') {
            //Top Going Left
            for (let i = 1; i < 9; i++) {
                if (this.y - i >= 0) {
                    if (this.x - i >= 0) {
                        if (Object.keys(board[this.x - i][this.y - i]).length === 0) {
                            openCellIndex.push(convertIndex(this.x - i, this.y - i))
                        } else if (board[this.x - i][this.y - i].color === 'white') {
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
                        } else if (board[this.x + i][this.y - i].color === 'white') {
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
                        } else if (board[this.x - i][this.y + i].color === 'white') {
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
                        } else if (board[this.x + i][this.y + i].color === 'white') {
                            console.log(i)
                            captureCellIndex.push(convertIndex(this.x + i, this.y + i))
                            console.log(i, captureCellIndex)
                            break
                        } else break
                    } else break
                } else break
            }
        } else if (this.color === 'white') {
            for (let i = 1; i < 9; i++) {
                if (this.y - i >= 0) {
                    if (this.x - i >= 0) {
                        if (Object.keys(board[this.x - i][this.y - i]).length === 0) {
                            openCellIndex.push(convertIndex(this.x - i, this.y - i))
                        } else if (board[this.x - i][this.y - i].color === 'black') {
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
                        } else if (board[this.x + i][this.y - i].color === 'black') {
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
                        } else if (board[this.x - i][this.y + i].color === 'black') {
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
                        } else if (board[this.x + i][this.y + i].color === 'black') {
                            captureCellIndex.push(convertIndex(this.x + i, this.y + i))
                            break
                        } else break
                    } else break
                }
            }
        }
        console.log(openCellIndex)
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

            board[piece.x][piece.y] = {} //epmty the object afte the piece move
            removeID(existingIndex) //remove the id from the cell

            //remove classes from cell where the piece came from
            cells[existingIndex].classList.remove('black')
            cells[existingIndex].classList.remove('white')
            cells[existingIndex].classList.remove('gray')

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

            addIdToCell(clickedSquareIndex, piece)

            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()
        }

        function unClicked(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)

            //Loop to remove listeners/class
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
    }
}


function placePiece() {

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
        const capture = (e)=>{
            const targetCell = e.target
            const cellIndex = Array.from(targetCell.parentElement.children).indexOf(targetCell)
            let x = cellIndex % 8
            let y = (cellIndex - x)/8
            if(blackTurn === true){
                cellBoard[this.x][this.y].classList.remove("black")
                cellBoard[this.x][y].classList.remove("white")
                new Queen(x,y,'queen', 'black')
            }else{
                cellBoard[this.x][this.y].classList.remove("white")
                cellBoard[this.x][y].classList.remove("black")
                new Queen(x,y,'queen', 'white')
            }
            board[this.x][this.y]={}
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
            for (let i = 0 ; i < 8; i++) {
                cellBoard[this.x][i].removeEventListener("click",capture)
                cellBoard[i][this.y].removeEventListener("click",capture)
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
        for (let i = this.y+1 ; i < 8; i++) {
            if(blackTurn === true){
                if(board[this.x][i].color === "black"){
                    break
                }else if(board[this.x][i].color === "white"){
                    cellBoard[this.x][i].addEventListener("click",capture)
                    cellBoard[this.x][i].classList.add("red")
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
                    cellBoard[this.x][i].classList.add("red")
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
                    cellBoard[this.x][i].classList.add("red")
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
                    cellBoard[this.x][i].classList.add("red")
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
                    cellBoard[i][this.y].classList.add("red")
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
                    cellBoard[i][this.y].classList.add("red")
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
                    cellBoard[i][this.y].classList.add("red")
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
                    cellBoard[i][this.y].classList.add("red")
                    break
                }else{
                    cellBoard[i][this.y].addEventListener("click",capture)
                    cellBoard[i][this.y].classList.add("blue")
                }
            }
        }
        //From Bishop Moves
        let piece = this
        const existingIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        let openCellIndex = []
        let captureCellIndex = []

        if (this.color === 'black') {
            //Top Going Left
            for (let i = 1; i < 9; i++) {
                if (this.y - i >= 0) {
                    if (this.x - i >= 0) {
                        if (Object.keys(board[this.x - i][this.y - i]).length === 0) {
                            openCellIndex.push(convertIndex(this.x - i, this.y - i))
                        } else if (board[this.x - i][this.y - i].color === 'white') {
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
                        } else if (board[this.x + i][this.y - i].color === 'white') {
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
                        } else if (board[this.x - i][this.y + i].color === 'white') {
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
                        } else if (board[this.x + i][this.y + i].color === 'white') {
                            console.log(i)
                            captureCellIndex.push(convertIndex(this.x + i, this.y + i))
                            console.log(i, captureCellIndex)
                            break
                        } else break
                    } else break
                } else break
            }
        } else if (this.color === 'white') {
            for (let i = 1; i < 9; i++) {
                if (this.y - i >= 0) {
                    if (this.x - i >= 0) {
                        if (Object.keys(board[this.x - i][this.y - i]).length === 0) {
                            openCellIndex.push(convertIndex(this.x - i, this.y - i))
                        } else if (board[this.x - i][this.y - i].color === 'black') {
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
                        } else if (board[this.x + i][this.y - i].color === 'black') {
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
                        } else if (board[this.x - i][this.y + i].color === 'black') {
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
                        } else if (board[this.x + i][this.y + i].color === 'black') {
                            captureCellIndex.push(convertIndex(this.x + i, this.y + i))
                            break
                        } else break
                    } else break
                }
            }
        }
        console.log(openCellIndex)
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
            for (let i = 0 ; i < 8; i++) {
                cellBoard[piece.x][i].removeEventListener("click",capture)
                cellBoard[i][piece.y].removeEventListener("click",capture)
            }

            board[piece.x][piece.y] = {} //epmty the object afte the piece move
            removeID(existingIndex) //remove the id from the cell

            //remove classes from cell where the piece came from
            cells[existingIndex].classList.remove('black')
            cells[existingIndex].classList.remove('white')
            cells[existingIndex].classList.remove('gray')

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

            addIdToCell(clickedSquareIndex, piece)

            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()
        }

    }
}
let blackKingFirstMove = true
let whiteKingFirstMove = true
class King extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    kingMoves() {
        removeListeners()
        let piece = this
        const existingIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        let openCellIndex = []
        let captureCellIndex = []

        //add listener to its original position
        cells[convertIndex(this.x, this.y)].addEventListener('click', unClicked)
        cells[convertIndex(this.x, this.y)].classList.add('gray')

        if (this.color === 'black') {
            //TOP
            if (this.y - 1 >= 0) {
                //Top
                if (Object.keys(board[this.x][this.y - 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x, this.y - 1))
                } else if (board[this.x][this.y - 1].color === 'white') {
                    captureCellIndex.push(convertIndex(this.x, this.y - 1))
                }
                //Top Left
                if (this.x - 1 >= 0) {
                    if (Object.keys(board[this.x - 1][this.y - 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 1, this.y - 1))
                    } else if (board[this.x - 1][this.y - 1].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x - 1, this.y - 1))
                    }
                }
                //Top Right
                if (this.x + 1 < 8) {
                    if (Object.keys(board[this.x + 1][this.y - 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 1, this.y - 1))
                    } else if (board[this.x + 1][this.y - 1].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x + 1, this.y - 1))
                    }
                }
            }
            //BOTTOM
            if (this.y + 1 < 8) {
                //Bot
                if (Object.keys(board[this.x][this.y + 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x, this.y + 1))
                } else if (board[this.x][this.y + 1].color === 'white') {
                    captureCellIndex.push(convertIndex(this.x, this.y + 1))
                }
                //Bot Left
                if (this.x - 1 >= 0) {
                    if (Object.keys(board[this.x - 1][this.y + 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 1, this.y + 1))
                    } else if (board[this.x - 1][this.y + 1].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x - 1, this.y + 1))
                    }
                }
                //Bot Right
                if (this.x + 1 < 8) {
                    if (Object.keys(board[this.x + 1][this.y + 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 1, this.y + 1))
                    } else if (board[this.x + 1][this.y + 1].color === 'white') {
                        captureCellIndex.push(convertIndex(this.x + 1, this.y + 1))
                    }
                }
            }
            //LEFT
            if (this.x - 1 >= 0) {
                if (Object.keys(board[this.x - 1][this.y]).length === 0) {
                    openCellIndex.push(convertIndex(this.x - 1, this.y))
                } else if (board[this.x - 1][this.y].color === 'white') {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y))
                }
            }
            //RIGHT
            if (this.x + 1 < 8) {
                if (Object.keys(board[this.x + 1][this.y]).length === 0) {
                    openCellIndex.push(convertIndex(this.x + 1, this.y))
                } else if (board[this.x + 1][this.y].color === 'white') {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y))
                }
            }

        } else if (this.color === 'white') {
            //TOP
            if (this.y - 1 >= 0) {
                //Top
                if (Object.keys(board[this.x][this.y - 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x, this.y - 1))
                } else if (board[this.x][this.y - 1].color === 'black') {
                    captureCellIndex.push(convertIndex(this.x, this.y - 1))
                }
                //Top Left
                if (this.x - 1 >= 0) {
                    if (Object.keys(board[this.x - 1][this.y - 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 1, this.y - 1))
                    } else if (board[this.x - 1][this.y - 1].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x - 1, this.y - 1))
                    }
                }
                //Top Right
                if (this.x + 1 < 8) {
                    if (Object.keys(board[this.x + 1][this.y - 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 1, this.y - 1))
                    } else if (board[this.x + 1][this.y - 1].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x + 1, this.y - 1))
                    }
                }
            }
            //BOTTOM
            if (this.y + 1 < 8) {
                //Bot
                if (Object.keys(board[this.x][this.y + 1]).length === 0) {
                    openCellIndex.push(convertIndex(this.x, this.y + 1))
                } else if (board[this.x][this.y + 1].color === 'black') {
                    captureCellIndex.push(convertIndex(this.x, this.y + 1))
                }
                //Bot Left
                if (this.x - 1 >= 0) {
                    if (Object.keys(board[this.x - 1][this.y + 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x - 1, this.y + 1))
                    } else if (board[this.x - 1][this.y + 1].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x - 1, this.y + 1))
                    }
                }
                //Bot Right
                if (this.x + 1 < 8) {
                    if (Object.keys(board[this.x + 1][this.y + 1]).length === 0) {
                        openCellIndex.push(convertIndex(this.x + 1, this.y + 1))
                    } else if (board[this.x + 1][this.y + 1].color === 'black') {
                        captureCellIndex.push(convertIndex(this.x + 1, this.y + 1))
                    }
                }
            }
            //LEFT
            if (this.x - 1 >= 0) {
                if (Object.keys(board[this.x - 1][this.y]).length === 0) {
                    openCellIndex.push(convertIndex(this.x - 1, this.y))
                } else if (board[this.x - 1][this.y].color === 'black') {
                    captureCellIndex.push(convertIndex(this.x - 1, this.y))
                }
            }
            //RIGHT
            if (this.x + 1 < 8) {
                if (Object.keys(board[this.x + 1][this.y]).length === 0) {
                    openCellIndex.push(convertIndex(this.x + 1, this.y))
                } else if (board[this.x + 1][this.y].color === 'black') {
                    captureCellIndex.push(convertIndex(this.x + 1, this.y))
                }
            }
        }

        for (let i = 0; i < openCellIndex.length; i++) {
            cells[openCellIndex[i]].classList.add('blue')
            cells[openCellIndex[i]].addEventListener('click', placeKing)
        }

        for (let i = 0; i < captureCellIndex.length; i++) {
            cells[captureCellIndex[i]].classList.add('red')
            cells[captureCellIndex[i]].addEventListener('click', placeKing)
        }
        //Castling
       
        const castlingLeft =(e)=>{
            const targetCell = e.target
            const targetCellIndex = Array.from(targetCell.parentElement.children).indexOf(targetCell)
            let x = targetCellIndex % 8	
            let y = (targetCellIndex - x) / 8
        
             if (blackTurn === true) {
                        cellBoard[this.x][this.y].classList.remove("black")
                        new King(x, y, 'king', 'black')
            //Place Rook
            new Rook(3, 0, 'rook', 'black')
            cellBoard[0][0].id = ""
            cellBoard[0][0].classList.remove("black")
            board[0][0] = {}
            
                    } else {
                        cellBoard[this.x][this.y].classList.remove("white")
                        new King(x, y, 'king', 'white')
            //Place Rook
            new Rook(3, 7, 'rook', 'white')
            cellBoard[0][7].id = ""
            cellBoard[0][7].classList.remove("white")
            board[0][7] = {}
                    }
            board[this.x][this.y] = {}
                    cellBoard[this.x][this.y].id = ""
        
            for (let i = 0; i < 8; i++) {
                        cellBoard[i][this.y].classList.remove('blue')
                        cellBoard[i][this.y].removeEventListener("click",castlingLeft)
                        cellBoard[i][this.y].removeEventListener("click",castlingRight)
                    }
            
            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placeKing)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placeKing)
            }
            cells[existingIndex].classList.remove('gray')
    
            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()
        }
        const castlingRight =(e)=>{
            const targetCell = e.target
            const targetCellIndex = Array.from(targetCell.parentElement.children).indexOf(targetCell)
            let x = targetCellIndex % 8	
            let y = (targetCellIndex - x) / 8
        
             if (blackTurn === true) {
                        cellBoard[this.x][this.y].classList.remove("black")
                        new King(x, y, 'king', 'black')
            //Place Rook
            new Rook(5, 0, 'rook', 'black')
            cellBoard[7][0].id = ""
            cellBoard[7][0].classList.remove("black")
            board[7][0] = {}
            
            } else {
                cellBoard[this.x][this.y].classList.remove("white")
                new King(x, y, 'king', 'white')
            //Place Rook
            new Rook(5, 7, 'rook', 'white')
            cellBoard[7][7].id = ""
            cellBoard[7][7].classList.remove("white")
            board[7][7] = {}
                    }
            board[this.x][this.y] = {}
                    cellBoard[this.x][this.y].id = ""
        
            for (let i = 0; i < 8; i++) {
                        cellBoard[i][this.y].classList.remove('blue')
                        cellBoard[i][this.y].removeEventListener("click",castlingLeft)
                        cellBoard[i][this.y].removeEventListener("click",castlingRight)
                    }
            
            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placeKing)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placeKing)
            }
            cells[existingIndex].classList.remove('gray')
    
            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()
        }
        for (let i = this.x - 1; i > -1; i--) {
            if(cellBoard[i][this.y].id === "black-rook" || cellBoard[i][this.y].id === "white-rook"){
                if(!blackTurn && whiteKingFirstMove && whiteLeftRookFirstMove){
                    cellBoard[2][this.y].classList.add("blue")
                    cellBoard[2][this.y].addEventListener("click", castlingLeft)
                }else if(blackTurn && blackKingFirstMove && blackLeftRookFirstMove){
                    cellBoard[2][this.y].classList.add("blue")
                    cellBoard[2][this.y].addEventListener("click", castlingLeft)
                }else{
                    break
                }

            }else if(cellBoard[i][this.y].classList.contains("white")||cellBoard[i][this.y].classList.contains("black")){
                console.log("break")
                break
            }
        }
        for (let i = this.x +1; i < 8; i++) {
            if(cellBoard[i][this.y].id === "black-rook" || cellBoard[i][this.y].id === "white-rook"){
                if(!blackTurn && whiteKingFirstMove && whiteRightRookFirstMove){
                    cellBoard[6][this.y].classList.add("blue")
                    cellBoard[6][this.y].addEventListener("click", castlingRight)
                }else if(blackTurn && blackKingFirstMove && blackRightRookFirstMove){
                    cellBoard[6][this.y].classList.add("blue")
                    cellBoard[6][this.y].addEventListener("click", castlingRight)
                }else{
                    break
                }
            }else if(cellBoard[i][this.y].classList.contains("white")||cellBoard[i][this.y].classList.contains("black")){
                console.log("break")
                break
            }
        }
        function placeKing(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)

            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placeKing)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placeKing)
            }

            board[piece.x][piece.y] = {} //epmty the object afte the piece move
            removeID(existingIndex) //remove the id from the cell

            //remove classes from cell where the piece came from
            cells[existingIndex].classList.remove('black')
            cells[existingIndex].classList.remove('white')
            cells[existingIndex].classList.remove('gray')

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

            //remove Castling listener ,bgcolor & change firstKingMove to false
            for (let i = 0; i < 8; i++) {
                cellBoard[i][0].removeEventListener("click",castlingLeft)
                cellBoard[i][0].removeEventListener("click",castlingRight)
                cellBoard[i][7].removeEventListener("click",castlingLeft)
                cellBoard[i][7].removeEventListener("click",castlingRight)
                cellBoard[i][0].classList.remove("blue")
                cellBoard[i][7].classList.remove("blue")
            }
            blackTurn?blackKingFirstMove = false:whiteKingFirstMove = false

            addIdToCell(clickedSquareIndex, piece)

            removeListeners()
            changeTurn()
            turnIndicator.textContent = `Player ${whoseTurn()} Turn`
            addListenerToOccupiedSquare()
        }

        function unClicked(e) {
            const clickedSquare = e.target
            const clickedSquareIndex = Array.from(clickedSquare.parentElement.children).indexOf(clickedSquare)

            //Loop to remove listeners/class
            for (let i = 0; i < openCellIndex.length; i++) {
                cells[openCellIndex[i]].classList.remove('blue')
                cells[openCellIndex[i]].removeEventListener('click', placeKing)
            }
            for (let i = 0; i < captureCellIndex.length; i++) {
                cells[captureCellIndex[i]].classList.remove('red')
                cells[captureCellIndex[i]].removeEventListener('click', placeKing)
            }
            //remove Castling listener & bgcolor
            for (let i = 0; i < 8; i++) {
                cellBoard[i][0].removeEventListener("click",castlingLeft)
                cellBoard[i][0].removeEventListener("click",castlingRight)
                cellBoard[i][7].removeEventListener("click",castlingLeft)
                cellBoard[i][7].removeEventListener("click",castlingRight)
                cellBoard[i][0].classList.remove("blue")
                cellBoard[i][7].classList.remove("blue")
            }

            addListenerToOccupiedSquare()
            cells[clickedSquareIndex].removeEventListener('click', unClicked)
            cells[clickedSquareIndex].classList.remove('gray')
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
    new Knight(1, 5, 'knight', 'white')
    new Knight(6, 5, 'knight', 'white')
    new Bishop(2, 5, 'bishop', 'white')
    new Bishop(5, 5, 'bishop', 'white')
    new Queen(3, 5, 'queen', 'white')
    new King(4, 7, 'king', 'white')

    new Rook(0, 0, 'rook', 'black')
    new Rook(7, 0, 'rook', 'black')
    new Knight(1, 0, 'knight', 'black')
    new Knight(6, 2, 'knight', 'black')
    new Bishop(2, 2, 'bishop', 'black')
    new Bishop(5, 2, 'bishop', 'black')
    new Queen(3, 2, 'queen', 'black')
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
    } else if (board[x][y].name === 'knight') {
        board[x][y].knightMoves()
    } else if (board[x][y].name === 'bishop') {
        board[x][y].bishopMoves()
    } else if (board[x][y].name === 'king') {
        board[x][y].kingMoves()
    }else if (board[x][y].name === 'queen') {
        board[x][y].queenMoves()
    }
}


function changeTurn() {
    blackTurn = !blackTurn
}

const whoseTurn = () => blackTurn ? 'Black' : 'White'
turnIndicator.textContent = `Player ${whoseTurn()} Turn`

document.body.append(turnIndicator, chessBoard)


function capture(e) {
    const a = e.target
}

function moves() {
    let x, y, z
    let cells

    cells.addEventListener('click', capture)
}