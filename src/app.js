const turnIndicator = document.createElement('h3')
turnIndicator.setAttribute('id', 'turn-indicator')
const chessBoard = document.createElement('main')
chessBoard.setAttribute('id', 'chess-board')
chessBoard.classList.add('chessboard')
const promoBg = document.createElement('div')
promoBg.classList.add('promo-bg')

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
//Rook variables initialization for castling
let blackLeftRookFirstMove = true
let blackRightRookFirstMove = true
let whiteLeftRookFirstMove = true
let whiteRightRookFirstMove = true
//King variables initialization for castling
let blackKingFirstMove = true
let whiteKingFirstMove = true

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

//ADD CLASS AND ID TO CELL POSITION AFTER MOVE
function addCellClassAndID(index, object) {
    cells[index].id = `${object.color}-${object.name}`
    cells[index].classList.add(object.color)
}

function getAllBlackCaptureCells() {
    let blackCaptureCells = []

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].color === 'black') {
                if (board[i][j].name === 'pawn') {
                    if (board[i][j].getPawnMoveCells().captureCells.length !== 0) {
                        blackCaptureCells.push(board[i][j].getPawnMoveCells().captureCells)
                    }
                }
                if (board[i][j].name === 'rook') {
                    if (board[i][j].getRookMoveCells().captureCells.length !== 0) {
                        blackCaptureCells.push(board[i][j].getRookMoveCells().captureCells)
                    }
                }
                if (board[i][j].name === 'knight') {
                    if (board[i][j].getKnightMoveCells().captureCells.length !== 0) {
                        blackCaptureCells.push(board[i][j].getKnightMoveCells().captureCells)
                    }
                }
                if (board[i][j].name === 'bishop') {
                    if (board[i][j].getBishopMoveCells().captureCells.length !== 0) {
                        blackCaptureCells.push(board[i][j].getBishopMoveCells().captureCells)
                    }
                }
                if (board[i][j].name === 'queen') {
                    if (board[i][j].getQueenMoveCells().captureCells.length !== 0) {
                        blackCaptureCells.push(board[i][j].getQueenMoveCells().captureCells)
                    }
                }
            }
        }
    }

    let flatten = [].concat(...blackCaptureCells) //CONVERT THE ARRAY TO 1D
    return [...new Set(flatten)] //REMOVE DUPLICATES
}

function getAllWhiteCaptureCells() {
    let whiteCaptureCells = []

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].color === 'white') {
                if (board[i][j].name === 'pawn') {
                    if (board[i][j].getPawnMoveCells().captureCells.length !== 0) {
                        whiteCaptureCells.push(board[i][j].getPawnMoveCells().captureCells)
                    }
                }
                if (board[i][j].name === 'rook') {
                    if (board[i][j].getRookMoveCells().captureCells.length !== 0) {
                        whiteCaptureCells.push(board[i][j].getRookMoveCells().captureCells)
                    }
                }
                if (board[i][j].name === 'knight') {
                    if (board[i][j].getKnightMoveCells().captureCells.length !== 0) {
                        whiteCaptureCells.push(board[i][j].getKnightMoveCells().captureCells)
                    }
                }
                if (board[i][j].name === 'bishop') {
                    if (board[i][j].getBishopMoveCells().captureCells.length !== 0) {
                        whiteCaptureCells.push(board[i][j].getBishopMoveCells().captureCells)
                    }
                }
                if (board[i][j].name === 'queen') {
                    if (board[i][j].getQueenMoveCells().captureCells.length !== 0) {
                        whiteCaptureCells.push(board[i][j].getQueenMoveCells().captureCells)
                    }
                }
            }
        }
    }

    let flatten = [].concat(...whiteCaptureCells) //CONVERT THE ARRAY TO 1D
    return [...new Set(flatten)] //REMOVE DUPLICATES
}

function isWhiteKingChecked() {
    let captureCells = getAllBlackCaptureCells()
    let result
    if (captureCells.length !== 0) {
        for (let i = 0; i < captureCells.length; i++) {
            let x = getX(captureCells[i])
            let y = getY(captureCells[i], x)
            if (board[x][y].name === 'king' && board[x][y].color === 'white') {
                result = true
                break
            } else {
                result = false
            }
        }
    } else result = false
    return result
}

function isBlackKingChecked() {
    let captureCells = getAllWhiteCaptureCells()
    let result
    if (captureCells.length !== 0) {
        for (let i = 0; i < captureCells.length; i++) {
            let x = getX(captureCells[i])
            let y = getY(captureCells[i], x)
            if (board[x][y].name === 'king' && board[x][y].color === 'black') {
                result = true
                break
            } else {
                result = false
            }
        }
    } else result = false
    return result
}

function addCheckIndicatorBlack() {
    if (isBlackKingChecked()) {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].id === 'black-king') {
                cells[i].classList.add('orange')
                break
            }
        }
    } else {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains('orange')) {
                cells[i].classList.remove('orange')
                break
            }
        }
    }
}

function addCheckIndicatorWhite() {
    if (isWhiteKingChecked()) {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].id === 'white-king') {
                cells[i].classList.add('orange')
                break
            }
        }
    } else {
        for (let i = 0; i < cells.length; i++) {
            if (cells[i].classList.contains('orange')) {
                cells[i].classList.remove('orange')
                break
            }
        }
    }
}

//GET ALL VALID MOVES AFTER CONSIDERING KING'S POSITION AND OPPONENTS CAPTURE CELLS
function getBlackValidMoves() {
    let blackValidMoves = []
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].color === 'black') {
                if (board[i][j].name === 'pawn') {
                    if (board[i][j].filterPawnMoves().openCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterPawnMoves().openCells)
                    }
                    if (board[i][j].filterPawnMoves().captureCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterPawnMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'rook') {
                    if (board[i][j].filterRookMoves().openCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterRookMoves().openCells)
                    }
                    if (board[i][j].filterRookMoves().captureCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterRookMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'knight') {
                    if (board[i][j].filterKnightMoves().openCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterKnightMoves().openCells)
                    }
                    if (board[i][j].filterKnightMoves().captureCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterKnightMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'bishop') {
                    if (board[i][j].filterBishopMoves().openCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterBishopMoves().openCells)
                    }
                    if (board[i][j].filterBishopMoves().captureCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterBishopMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'queen') {
                    if (board[i][j].filterQueenMoves().openCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterQueenMoves().openCells)
                    }
                    if (board[i][j].filterQueenMoves().captureCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterQueenMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'king') {
                    if (board[i][j].filterKingMoves().openCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterKingMoves().openCells)
                    }
                    if (board[i][j].filterKingMoves().captureCells.length !== 0) {
                        blackValidMoves.push(board[i][j].filterKingMoves().captureCells)
                    }
                }
            }
        }
    }
    let flatten = [].concat(...blackValidMoves)
    return [...new Set(flatten)]
}

//GET ALL VALID MOVES AFTER CONSIDERING KING'S POSITION AND OPPONENTS CAPTURE CELLS
function getWhiteValidMoves() {
    let whiteValidMoves = []
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (board[i][j].color === 'white') {
                if (board[i][j].name === 'pawn') {
                    if (board[i][j].filterPawnMoves().openCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterPawnMoves().openCells)
                    }
                    if (board[i][j].filterPawnMoves().captureCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterPawnMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'rook') {
                    if (board[i][j].filterRookMoves().openCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterRookMoves().openCells)
                    }
                    if (board[i][j].filterRookMoves().captureCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterRookMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'knight') {
                    if (board[i][j].filterKnightMoves().openCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterKnightMoves().openCells)
                    }
                    if (board[i][j].filterKnightMoves().captureCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterKnightMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'bishop') {
                    if (board[i][j].filterBishopMoves().openCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterBishopMoves().openCells)
                    }
                    if (board[i][j].getBishopMoveCells().captureCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterBishopMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'queen') {
                    if (board[i][j].filterQueenMoves().openCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterQueenMoves().openCells)
                    }
                    if (board[i][j].filterQueenMoves().captureCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterQueenMoves().captureCells)
                    }
                }
                if (board[i][j].name === 'king') {
                    if (board[i][j].filterKingMoves().openCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterKingMoves().openCells)
                    }
                    if (board[i][j].filterKingMoves().captureCells.length !== 0) {
                        whiteValidMoves.push(board[i][j].filterKingMoves().captureCells)
                    }
                }
            }
        }
    }
    let flatten = [].concat(...whiteValidMoves)
    return [...new Set(flatten)]
}

function isBlackCheckedMate() {
    if (getBlackValidMoves().length === 0) {
        return true
    } else return false
}

function isWhiteCheckedMate() {
    if (getWhiteValidMoves().length === 0) {
        return true
    } else return false
}

//EVENT LISTENER FOR WHEN A PAWN IS CLICKED
function passMovePieceParamsPawn(piece, originIndex, openCellIndex, captureCellIndex) {
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
            cells[clickedSquareIndex].removeEventListener('click', movePiece)
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].classList.contains('pink')) {
                    cells[i].classList.remove('pink')
                    break
                }
            }

            // isBlackKingChecked()
            // isWhiteKingChecked()
            addListenerToOccupiedSquare()
        } else {
            lastMoveIndex = clickedSquareIndex
            piece.firstTurn = false
            if (clickedSquareIndex - originIndex === 8 || originIndex - clickedSquareIndex === 8) {
                squaresMoved = 1
            } else squaresMoved = 2

            //PAWN EXCLUSIVE
            //REMOVE CELL/BOARD DATA FOR EN PASSANT
            if (cells[clickedSquareIndex].classList.contains('pink')) {
                if (piece.color === 'black') {
                    board[x][y - 1] = {} //REMOVE ENPASSANT CAPTURED PAWN
                    removeID(convertIndex(x, y - 1))
                    cells[convertIndex(x, y - 1)].classList.remove('white')
                } else if (piece.color === 'white') {
                    board[x][y + 1] = {} //REMOVE ENPASSANT CAPTURED PAWN
                    removeID(convertIndex(x, y + 1))
                    cells[convertIndex(x, y + 1)].classList.remove('black')
                }
                cells[clickedSquareIndex].classList.remove('pink')
                cells[clickedSquareIndex].removeEventListener('click', movePiece) //REMOVE LISTENER OF EN PASSANT CELL FROM PAWNMOVES()
            }

            //REMOVE ALL ADDED CLASS/LISTENERS FROM CAPTURE AND OPEN CELLS
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

            //DEFAULTS TO BE EXECUTED AT THE END OF EVERY CLICK 
            function setDefault() {
                if (piece.color === 'white') {
                    if (isBlackCheckedMate()) {
                        turnIndicator.textContent = `Checked Mate. White Won!`
                        zeroClock()
                    } else {
                        whiteTime.pauseTimer()
                        timeDisplay.textContent = blackTime.displayTime()
                        blackTime.startTimer()
                        whiteTimeDisplay.textContent = whiteTime.displayTime()

                        changeTurn()
                        turnIndicator.textContent = `${whoseTurn()} Turn`
                        addListenerToOccupiedSquare()
                    }
                    addCheckIndicatorBlack()
                } else if (piece.color === 'black') {
                    if (isWhiteCheckedMate()) {
                        turnIndicator.textContent = `Checked Mate. White Won!`
                        zeroClock()
                    } else {
                        blackTime.pauseTimer()
                        timeDisplay.textContent = whiteTime.displayTime()
                        whiteTime.startTimer()
                        blackTimeDisplay.textContent = blackTime.displayTime()

                        changeTurn()
                        turnIndicator.textContent = `${whoseTurn()} Turn`
                        addListenerToOccupiedSquare()
                    }
                    addCheckIndicatorWhite()
                }
            }

            if (piece.y === 0 || piece.y === 7) { //CONDITION TO CHECK FOR PROMOTION
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

                if (piece.y === 0) { //WHITE PROMOTION POSITION
                    rookBox.setAttribute('id', 'white-rook')
                    knightBox.setAttribute('id', 'white-knight')
                    bishopBox.setAttribute('id', 'white-bishop')
                    queenBox.setAttribute('id', 'white-queen')
                    document.body.append(promoBg)

                    rookBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Rook(x, y, 'rook', 'white')
                        promoContainer.remove()
                        promoBg.remove()
                        setDefault()
                    })

                    knightBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Knight(x, y, 'knight', 'white')
                        promoContainer.remove()
                        promoBg.remove()
                        setDefault()
                    })

                    bishopBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Bishop(x, y, 'bishop', 'white')
                        promoContainer.remove()
                        promoBg.remove()
                        setDefault()
                    })

                    queenBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Queen(x, y, 'queen', 'white')
                        promoContainer.remove()
                        promoBg.remove()
                        setDefault()
                    })
                } else if (piece.y === 7) { //BLACK PROMOTION POSITION
                    rookBox.setAttribute('id', 'black-rook')
                    knightBox.setAttribute('id', 'black-knight')
                    bishopBox.setAttribute('id', 'black-bishop')
                    queenBox.setAttribute('id', 'black-queen')
                    document.body.append(promoBg)

                    rookBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Rook(x, y, 'rook', 'black')
                        promoContainer.remove()
                        promoBg.remove()
                        setDefault()
                    })

                    knightBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Knight(x, y, 'knight', 'black')
                        promoContainer.remove()
                        promoBg.remove()
                        setDefault()
                    })

                    bishopBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Bishop(x, y, 'bishop', 'black')
                        promoContainer.remove()
                        promoBg.remove()
                        setDefault()
                    })

                    queenBox.addEventListener('click', function () {
                        board[x][y] = {}
                        new Queen(x, y, 'queen', 'black')
                        promoContainer.remove()
                        promoBg.remove()
                        setDefault()
                    })
                }
            } else {
                addCellClassAndID(clickedSquareIndex, piece)
                setDefault()
            }
        }
    }
}


//EVENT LISTENER TO WHEN OTHER PIECE ASIDE FROM PAWN IS CLICKED
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
            cells[clickedSquareIndex].removeEventListener('click', movePiece)
            for (let i = 0; i < cells.length; i++) {
                if (cells[i].classList.contains('pink')) {
                    cells[i].classList.remove('pink')
                    break
                }
            }

            // isBlackKingChecked()
            // isWhiteKingChecked()
            addListenerToOccupiedSquare()
        } else {
            lastMoveIndex = clickedSquareIndex

            // //Castling
            cellBoard[4][0].id === "" ? blackKingFirstMove = false : {}
            cellBoard[4][7].id === "" ? whiteKingFirstMove = false : {}

            cellBoard[0][0].id === "" ? blackLeftRookFirstMove = false : {}
            cellBoard[7][0].id === "" ? blackRightRookFirstMove = false : {}
            cellBoard[0][7].id === "" ? whiteLeftRookFirstMove = false : {}
            cellBoard[7][7].id === "" ? whiteRightRookFirstMove = false : {}

            let kingTopLeft = convertIndex(2, 0)
            let kingTopRight = convertIndex(6, 0)
            let kingBottomLeft = convertIndex(2, 7)
            let kingBottomRight = convertIndex(6, 7)

            if (blackKingFirstMove === true && piece.name === "king") {
                if (clickedSquareIndex === kingTopLeft) {
                    //remove rook
                    board[0][0] = {}
                    removeID(0)
                    cells[0].classList.remove("black")
                    //Place Rook
                    new Rook(3, 0, 'rook', 'black')
                }
                if (clickedSquareIndex === kingTopRight) {
                    //remove rook
                    board[7][0] = {}
                    removeID(7)
                    cells[7].classList.remove("black")
                    //Place Rook
                    new Rook(5, 0, 'rook', 'black')
                }
            }
            if (whiteKingFirstMove === true && piece.name === "king") {
                if (clickedSquareIndex === kingBottomLeft) {
                    //remove rook
                    board[0][7] = {}
                    removeID(convertIndex(0, 7))
                    cells[convertIndex(0, 7)].classList.remove("white")
                    //Place Rook
                    new Rook(3, 7, 'rook', 'white')
                }
                if (clickedSquareIndex === kingBottomRight) {
                    //remove rook
                    board[7][7] = {}
                    removeID(convertIndex(7, 7))
                    cells[convertIndex(7, 7)].classList.remove("white")
                    //Place Rook
                    new Rook(5, 7, 'rook', 'white')
                }
            }

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
            addCellClassAndID(clickedSquareIndex, piece)

            if (piece.color === 'white') {
                if (isBlackCheckedMate()) {
                    turnIndicator.textContent = `Checked Mate. White Won!`
                    zeroClock()
                } else {
                    whiteTime.pauseTimer()
                    timeDisplay.textContent = blackTime.displayTime()
                    blackTime.startTimer()
                    whiteTimeDisplay.textContent = whiteTime.displayTime()

                    changeTurn()
                    turnIndicator.textContent = `${whoseTurn()} Turn`
                    addListenerToOccupiedSquare()
                }
                addCheckIndicatorBlack()
            } else if (piece.color === 'black') {
                if (isWhiteCheckedMate()) {
                    turnIndicator.textContent = `Checked Mate. White Won!`
                    zeroClock()
                } else {
                    blackTime.pauseTimer()
                    timeDisplay.textContent = whiteTime.displayTime()
                    whiteTime.startTimer()
                    blackTimeDisplay.textContent = blackTime.displayTime()

                    changeTurn()
                    turnIndicator.textContent = `${whoseTurn()} Turn`
                    addListenerToOccupiedSquare()
                }
                addCheckIndicatorWhite()
            }
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

    getPawnMoveCells() {
        let openCellIndex = []
        let captureCellIndex = []
        let enpassantIndex = 0

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
                        enpassantIndex = (convertIndex(this.x - 1, this.y + 1))
                    }
                }
                if (this.x + 1 < 8) { //CHECK IF X IS OUT OF BOUNDS
                    if ((Object.keys(board[this.x + 1][this.y + 1]).length === 0) && (convertIndex(this.x + 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'white-pawn') && (squaresMoved === 2)) {
                        enpassantIndex = (convertIndex(this.x + 1, this.y + 1))
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
                        enpassantIndex = (convertIndex(this.x - 1, this.y - 1))
                    }
                }
                if (this.x + 1 < 8) {
                    if ((Object.keys(board[this.x + 1][this.y - 1]).length === 0) && (convertIndex(this.x + 1, this.y) === lastMoveIndex) &&
                        (cells[lastMoveIndex].id === 'black-pawn') && (squaresMoved === 2)) {
                        enpassantIndex = (convertIndex(this.x + 1, this.y - 1))
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

        let pawnMoveCells = {
            captureCells: captureCellIndex,
            openCells: openCellIndex,
            enpassantCell: enpassantIndex
        }

        return pawnMoveCells
    }

    filterPawnMoves() {
        const pawnMoveCells = this.getPawnMoveCells()
        let openCellIndex = pawnMoveCells.openCells
        let captureCellIndex = pawnMoveCells.captureCells
        let newOpenCellIndex = []
        let newCaptureCellIndex = []
        board[this.x][this.y] = {}

        for (let i = 0; i < openCellIndex.length; i++) {

            let x = getX(openCellIndex[i])
            let y = getY(openCellIndex[i], x)
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            board[x][y] = {}
        }

        for (let i = 0; i < captureCellIndex.length; i++) {

            let x = getX(captureCellIndex[i])
            let y = getY(captureCellIndex[i], x)
            let copy = board[x][y]
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            board[x][y] = copy
        }

        board[this.x][this.y] = this

        let filteredMoves = {
            openCells: newOpenCellIndex,
            captureCells: newCaptureCellIndex,
            enpassantCell: pawnMoveCells.enpassantCell
        }

        return filteredMoves
    }

    pawnMoves() {
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y)
        const pawnMoveCells = this.filterPawnMoves()
        let openCellIndex = pawnMoveCells.openCells
        let captureCellIndex = pawnMoveCells.captureCells
        let enpassantIndex = pawnMoveCells.enpassantCell


        const placePiece = passMovePieceParamsPawn(piece, originIndex, openCellIndex, captureCellIndex)
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
        if (enpassantIndex !== 0) {
            cells[enpassantIndex].classList.add('pink')
            cells[enpassantIndex].addEventListener('click', placePiece)
        }
    }
}

class Rook extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    getRookMoveCells() {
        let openCellIndex = []
        let captureCellIndex = []
        let oppositeColor = this.color === 'black' ? 'white' : 'black'

        //TOP
        for (let i = (this.y - 1); i > -1; i--) {
            if (board[this.x][i].color === oppositeColor) {
                captureCellIndex.push(convertIndex(this.x, i))
                break
            } else if (board[this.x][i].color === this.color) {
                break
            } else {
                openCellIndex.push(convertIndex(this.x, i))
            }
        }
        //BOTTOM
        for (let i = (this.y + 1); i < 8; i++) {
            if (board[this.x][i].color === oppositeColor) {
                captureCellIndex.push(convertIndex(this.x, i))
                break
            } else if (board[this.x][i].color === this.color) {
                break
            } else {
                openCellIndex.push(convertIndex(this.x, i))
            }
        }
        //LEFT
        for (let i = (this.x - 1); i > -1; i--) {
            if (board[i][this.y].color === oppositeColor) {
                captureCellIndex.push(convertIndex(i, this.y))
                break
            } else if (board[i][this.y].color === this.color) {
                break
            } else {
                openCellIndex.push(convertIndex(i, this.y))
            }
        }
        // RIGHT
        for (let i = (this.x + 1); i < 8; i++) {
            if (board[i][this.y].color === oppositeColor) {
                captureCellIndex.push(convertIndex(i, this.y))
                break
            } else if (board[i][this.y].color === this.color) {
                break
            } else {
                openCellIndex.push(convertIndex(i, this.y))
            }
        }

        let rookMoveCells = {
            captureCells: captureCellIndex,
            openCells: openCellIndex,
        }

        return rookMoveCells
    }

    filterRookMoves() {
        const rookMoveCells = this.getRookMoveCells()
        let openCellIndex = rookMoveCells.openCells
        let captureCellIndex = rookMoveCells.captureCells
        let newOpenCellIndex = []
        let newCaptureCellIndex = []
        board[this.x][this.y] = {}

        for (let i = 0; i < openCellIndex.length; i++) {

            let x = getX(openCellIndex[i])
            let y = getY(openCellIndex[i], x)
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            board[x][y] = {}
        }

        for (let i = 0; i < captureCellIndex.length; i++) {

            let x = getX(captureCellIndex[i])
            let y = getY(captureCellIndex[i], x)
            let copy = board[x][y]
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            board[x][y] = copy
        }

        board[this.x][this.y] = this

        let filteredMoves = {
            openCells: newOpenCellIndex,
            captureCells: newCaptureCellIndex
        }

        return filteredMoves
    }

    rookMoves() {
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        const rookMoveCells = this.filterRookMoves()
        let openCellIndex = rookMoveCells.openCells
        let captureCellIndex = rookMoveCells.captureCells

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
class Knight extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    getKnightMoveCells() {
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


        let knightMoveCells = {
            captureCells: captureCellIndex,
            openCells: openCellIndex,
        }

        return knightMoveCells
    }

    filterKnightMoves() {
        const knightMoveCells = this.getKnightMoveCells()
        let openCellIndex = knightMoveCells.openCells
        let captureCellIndex = knightMoveCells.captureCells
        let newOpenCellIndex = []
        let newCaptureCellIndex = []
        board[this.x][this.y] = {}

        for (let i = 0; i < openCellIndex.length; i++) {

            let x = getX(openCellIndex[i])
            let y = getY(openCellIndex[i], x)
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            board[x][y] = {}
        }

        for (let i = 0; i < captureCellIndex.length; i++) {

            let x = getX(captureCellIndex[i])
            let y = getY(captureCellIndex[i], x)
            let copy = board[x][y]
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            board[x][y] = copy
        }

        board[this.x][this.y] = this

        let filteredMoves = {
            openCells: newOpenCellIndex,
            captureCells: newCaptureCellIndex
        }

        return filteredMoves
    }

    knightMoves() {
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        const knightMoveCells = this.filterKnightMoves()
        let openCellIndex = knightMoveCells.openCells
        let captureCellIndex = knightMoveCells.captureCells

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

    getBishopMoveCells() {
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
            }
        }

        let bishopMoveCells = {
            captureCells: captureCellIndex,
            openCells: openCellIndex,
        }

        return bishopMoveCells
    }

    filterBishopMoves() {
        const bishopMoveCells = this.getBishopMoveCells()
        let openCellIndex = bishopMoveCells.openCells
        let captureCellIndex = bishopMoveCells.captureCells
        let newOpenCellIndex = []
        let newCaptureCellIndex = []
        board[this.x][this.y] = {}

        for (let i = 0; i < openCellIndex.length; i++) {

            let x = getX(openCellIndex[i])
            let y = getY(openCellIndex[i], x)
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            board[x][y] = {}
        }

        for (let i = 0; i < captureCellIndex.length; i++) {

            let x = getX(captureCellIndex[i])
            let y = getY(captureCellIndex[i], x)
            let copy = board[x][y]
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            board[x][y] = copy
        }

        board[this.x][this.y] = this

        let filteredMoves = {
            openCells: newOpenCellIndex,
            captureCells: newCaptureCellIndex
        }

        return filteredMoves
    }

    bishopMoves() {
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        const bishopMoveCells = this.filterBishopMoves()
        let openCellIndex = bishopMoveCells.openCells
        let captureCellIndex = bishopMoveCells.captureCells

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

    getQueenMoveCells() {
        let openCellIndex = []
        let captureCellIndex = []
        let oppositeColor = this.color === 'black' ? 'white' : 'black'
        //From BISHOP MOVES
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
            }
        }
        // From ROOK MOVES
        //TOP
        for (let i = (this.y - 1); i > -1; i--) {
            if (board[this.x][i].color === oppositeColor) {
                captureCellIndex.push(convertIndex(this.x, i))
                break
            } else if (board[this.x][i].color === this.color) {
                break
            } else {
                openCellIndex.push(convertIndex(this.x, i))
            }
        }
        //BOTTOM
        for (let i = (this.y + 1); i < 8; i++) {
            if (board[this.x][i].color === oppositeColor) {
                captureCellIndex.push(convertIndex(this.x, i))
                break
            } else if (board[this.x][i].color === this.color) {
                break
            } else {
                openCellIndex.push(convertIndex(this.x, i))
            }
        }
        //LEFT
        for (let i = (this.x - 1); i > -1; i--) {
            if (board[i][this.y].color === oppositeColor) {
                captureCellIndex.push(convertIndex(i, this.y))
                break
            } else if (board[i][this.y].color === this.color) {
                break
            } else {
                openCellIndex.push(convertIndex(i, this.y))
            }
        }
        // RIGHT
        for (let i = (this.x + 1); i < 8; i++) {
            if (board[i][this.y].color === oppositeColor) {
                captureCellIndex.push(convertIndex(i, this.y))
                break
            } else if (board[i][this.y].color === this.color) {
                break
            } else {
                openCellIndex.push(convertIndex(i, this.y))
            }
        }

        let queenMoveCells = {
            captureCells: captureCellIndex,
            openCells: openCellIndex,
        }

        return queenMoveCells
    }

    filterQueenMoves() {
        const queenMoveCells = this.getQueenMoveCells()
        let openCellIndex = queenMoveCells.openCells
        let captureCellIndex = queenMoveCells.captureCells
        let newOpenCellIndex = []
        let newCaptureCellIndex = []
        board[this.x][this.y] = {}

        for (let i = 0; i < openCellIndex.length; i++) {

            let x = getX(openCellIndex[i])
            let y = getY(openCellIndex[i], x)
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            board[x][y] = {}
        }

        for (let i = 0; i < captureCellIndex.length; i++) {

            let x = getX(captureCellIndex[i])
            let y = getY(captureCellIndex[i], x)
            let copy = board[x][y]
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            board[x][y] = copy
        }

        board[this.x][this.y] = this

        let filteredMoves = {
            openCells: newOpenCellIndex,
            captureCells: newCaptureCellIndex
        }

        return filteredMoves
    }

    queenMoves() {
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        const queenMoveCells = this.filterQueenMoves()
        let openCellIndex = queenMoveCells.openCells
        let captureCellIndex = queenMoveCells.captureCells

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
class King extends ChessPiece {
    constructor(x, y, name, color) {
        super(x, y, name, color)
    }

    getKingMoveCells() {
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
        //Castling
        for (let i = this.x - 1; i > -1; i--) {
            if (cellBoard[i][this.y].id === "black-rook" || cellBoard[i][this.y].id === "white-rook") {
                if (blackKingFirstMove && blackLeftRookFirstMove && blackTurn) {
                    captureCellIndex.push(convertIndex(2, this.y))
                } else if (whiteKingFirstMove && whiteLeftRookFirstMove && !blackTurn) {
                    captureCellIndex.push(convertIndex(2, this.y))
                }
            } else if (cellBoard[i][this.y].classList.contains("white") || cellBoard[i][this.y].classList.contains("black")) {
                break
            }
        }
        for (let i = this.x + 1; i < 8; i++) {
            if (cellBoard[i][this.y].id === "black-rook" || cellBoard[i][this.y].id === "white-rook") {
                if (blackKingFirstMove && blackRightRookFirstMove && blackTurn) {
                    captureCellIndex.push(convertIndex(6, this.y))
                } else if (whiteKingFirstMove && whiteRightRookFirstMove && !blackTurn) {
                    captureCellIndex.push(convertIndex(6, this.y))
                }
            } else if (cellBoard[i][this.y].classList.contains("white") || cellBoard[i][this.y].classList.contains("black")) {
                break
            }
        }

        let kingMoveCells = {
            captureCells: captureCellIndex,
            openCells: openCellIndex
        }

        return kingMoveCells
    }

    filterKingMoves() {
        const kingMoveCells = this.getKingMoveCells()
        let openCellIndex = kingMoveCells.openCells
        let captureCellIndex = kingMoveCells.captureCells
        let newOpenCellIndex = []
        let newCaptureCellIndex = []
        board[this.x][this.y] = {}

        for (let i = 0; i < openCellIndex.length; i++) {

            let x = getX(openCellIndex[i])
            let y = getY(openCellIndex[i], x)
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newOpenCellIndex.push(openCellIndex[i])
            }
            board[x][y] = {}
        }

        for (let i = 0; i < captureCellIndex.length; i++) {

            let x = getX(captureCellIndex[i])
            let y = getY(captureCellIndex[i], x)
            let copy = board[x][y]
            board[x][y] = this
            if (this.color === 'black' && isBlackKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            if (this.color === 'white' && isWhiteKingChecked() === false) {
                newCaptureCellIndex.push(captureCellIndex[i])
            }
            board[x][y] = copy
        }

        board[this.x][this.y] = this

        let filteredMoves = {
            openCells: newOpenCellIndex,
            captureCells: newCaptureCellIndex
        }

        return filteredMoves
    }

    kingMoves() {
        removeListeners()
        let piece = this
        const originIndex = convertIndex(this.x, this.y) //Index of the Piece's Original position
        const kingnMoveCells = this.filterKingMoves()
        let openCellIndex = kingnMoveCells.openCells
        let captureCellIndex = kingnMoveCells.captureCells

        const placePiece = passMovePieceParams(piece, originIndex, openCellIndex, captureCellIndex)
        //ADD LISTENER TO THIS FOR UNCLICK
        cells[convertIndex(this.x, this.y)].addEventListener('click', placePiece)
        if (!cells[convertIndex(this.x, this.y)].classList.contains('orange')) {
            cells[convertIndex(this.x, this.y)].classList.add('gray')
        }
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

// renderPieces()

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

const bottomContainer = document.createElement('div')
bottomContainer.setAttribute('id', 'bottom-container')

const setTimeLabel = document.createElement('h3')
setTimeLabel.setAttribute('id', 'set-time-label')
setTimeLabel.textContent = 'Time Limit (mins): '
const setTimeInput = document.createElement('input')
setTimeInput.setAttribute('type', 'number')
setTimeInput.setAttribute('id', 'set-time-input')
const whiteBox = document.createElement('div')
whiteBox.setAttribute('id', 'white-box')
whiteBox.classList.add('bottom-box')
const whiteHeading = document.createElement('h2')
whiteHeading.textContent = 'White'
const whiteTimeDisplay = document.createElement('h3')
const timeBox = document.createElement('div')
timeBox.setAttribute('id', 'time-box')
timeBox.classList.add('bottom-box')
const timeDisplay = document.createElement('h1')
const blackBox = document.createElement('div')
blackBox.setAttribute('id', 'black-box')
blackBox.classList.add('bottom-box')
const blackHeading = document.createElement('h2')
blackHeading.textContent = 'Black'
const blackTimeDisplay = document.createElement('h3')
const setTimeContainer = document.createElement('div')
setTimeContainer.classList.add('set-time-container')
setTimeContainer.append(setTimeLabel, setTimeInput)

whiteBox.append(whiteHeading, whiteTimeDisplay)
timeBox.append(timeDisplay)
blackBox.append(blackHeading, blackTimeDisplay)

const startBtn = document.createElement('button')
startBtn.classList.add('start-btn')
startBtn.textContent = 'Start Game'

const timeError = document.createElement('span')
timeError.setAttribute('id', 'time-error')
timeError.style.color = 'red'

const gameTitle = document.createElement('h2')
gameTitle.setAttribute('id', 'game-title')
gameTitle.textContent = `Vanilla JS Chess`

const preGameContainer = document.createElement('div')
preGameContainer.setAttribute('id', 'pregame-container')

preGameContainer.append(gameTitle, setTimeContainer, timeError, startBtn)
promoBg.append(preGameContainer)

startBtn.addEventListener('click', startGame)

let timed

class Timer {
    constructor(duration) {
        this.duration = duration
    }

    startTimer() {
        let time = this
        let timer = this.duration, minutes, seconds

        function timeStart() {
            minutes = parseInt(timer / 60, 10)
            seconds = parseInt(timer % 60, 10)
            minutes = minutes < 10 ? `0${minutes}` : minutes
            seconds = seconds < 10 ? `0${seconds}` : seconds
            if (timer >= 0) {
                timeDisplay.textContent = `${minutes}:${seconds}`
                time.duration = timer
            }
            timer--
        }
        timeStart()
        timed = setInterval(timeStart, 1000)
    }

    pauseTimer() {
        clearInterval(timed)
    }

    displayTime() {
        let minutes = parseInt(this.duration / 60, 10)
        let seconds = parseInt(this.duration % 60, 10)
        minutes = minutes < 10 ? `0${minutes}` : minutes
        seconds = seconds < 10 ? `0${seconds}` : seconds
        return `${minutes}:${seconds}`
    }
}

let blackTime = new Timer()
let whiteTime = new Timer()

let checkTimeVariable

function startGame() {
    if (setTimeInput.value === '' || setTimeInput.value === '0') {
        timeError.textContent = 'Please input valid time'
    } else {
        preGameContainer.remove()
        promoBg.remove()
        renderPieces()
        addListenerToOccupiedSquare()
        let seconds = setTimeInput.value * 60
        blackTime.duration = seconds
        whiteTime.duration = seconds
        setTimeLabel.remove()
        setTimeInput.remove()

        timeDisplay.textContent = whiteTime.displayTime()

        whiteTimeDisplay.textContent = whiteTime.displayTime()
        blackTimeDisplay.textContent = blackTime.displayTime()

        bottomContainer.append(whiteBox, timeBox, blackBox)
        turnIndicator.textContent = `${whoseTurn()} Turn`
        turnIndicator.style.cursor = 'default'
        whiteTime.startTimer()
        turnIndicator.removeEventListener('click', startGame)
        checkTime()
        checkTimeVariable = setInterval(checkTime, 1000)
    }
}

function checkTime() {
    if (whiteTime.duration === 0) {
        removeListeners()
        turnIndicator.textContent = `Black Won!`
        whiteTimeDisplay.textContent = whiteTime.displayTime()
        clearInterval(checkTimeVariable)
    } else if (blackTime.duration === 0) {
        removeListeners()
        turnIndicator.textContent = `White Won!`
        blackTimeDisplay.textContent = blackTime.displayTime()
        clearInterval(checkTimeVariable)
    }
}

function zeroClock() {
    timeDisplay.textContent = '00:00'
    blackTimeDisplay.textContent = '00:00'
    whiteTimeDisplay.textContent = '00:00'
    whiteTime.pauseTimer()
    blackTime.pauseTimer()
    clearInterval(checkTimeVariable)
}

document.body.append(promoBg, turnIndicator, chessBoard, bottomContainer)