const chessBoard = document.createElement('main')
chessBoard.setAttribute('id', 'chess-board')
chessBoard.classList.add('chessboard')

let cells = []

function createBoard() {
    let changePattern = false
    let classToAdd = 'light'
    for (let i = 0; i < 64; i++) {
        cells[i] = document.createElement('div')
        // cells[i].setAttribute('id', `${i}`)
        cells[i].classList.add('cell')
        changePattern = (i % 8 === 0 || i === 0)
        classToAdd = changePattern ? classToAdd : classToAdd === 'light' ? 'dark' : 'light'
        cells[i].classList.add(classToAdd)
        chessBoard.appendChild(cells[i])
    }
}

createBoard()

document.body.append(chessBoard)

const board = [[], [], [], [], [], [], [], []]

cells.forEach((element, index) => {
    if (index < 8) {
        board[0].push(element)
    } else if (index < 16) {
        board[1].push(element)
    } else if (index < 24) {
        board[2].push(element)
    } else if (index < 32) {
        board[3].push(element)
    } else if (index < 40) {
        board[4].push(element)
    } else if (index < 48) {
        board[5].push(element)
    } else if (index < 56) {
        board[6].push(element)
    } else {
        board[7].push(element)
    }
})

board[0][0].id = "white-rook"
board[0][1].id = "white-knight"
board[0][2].id = "white-bishop"
board[0][3].id = "white-queen"
board[0][4].id = "white-king"
board[0][5].id = "white-bishop"
board[0][6].id = "white-knight"
board[0][7].id = "white-rook"

board[1][0].id = "white-pawn"
board[1][1].id = "white-pawn"
board[1][2].id = "white-pawn"
board[1][3].id = "white-pawn"
board[1][4].id = "white-pawn"
board[1][5].id = "white-pawn"
board[1][6].id = "white-pawn"
board[1][7].id = "white-pawn"

board[7][0].id = "black-rook"
board[7][1].id = "black-knight"
board[7][2].id = "black-bishop"
board[7][3].id = "black-queen"
board[7][4].id = "black-king"
board[7][5].id = "black-bishop"
board[7][6].id = "black-knight"
board[7][7].id = "black-rook"

board[6][0].id = "black-pawn"
board[6][1].id = "black-pawn"
board[6][2].id = "black-pawn"
board[6][3].id = "black-pawn"
board[6][4].id = "black-pawn"
board[6][5].id = "black-pawn"
board[6][6].id = "black-pawn"
board[6][7].id = "black-pawn"
// console.log(board[0][0])

const peicesFunction = (e) => {
    const piece = e.target
    const pieceIndex = Array.from(piece.parentElement.children).indexOf(piece)
    let x, y;

    x = pieceIndex % 8
    y = (pieceIndex - x) / 8

    console.log(x, y)

    //Knight
    if (piece.id === "white-knight" || piece.id === "black-knight") {
        // xyIndex()
        const move = new Chessmoves(y, x)
        move.knight()
        //Rook
    } else if (piece.id === "white-rook" || piece.id === "black-rook") {
        // xyIndex()
        const move = new Chessmoves(y, x)
        move.rook()
        //Pawn
    } else if (piece.id === "white-pawn") {
        // xyIndex()
        const move = new Chessmoves(y, x)
        move.whitepawn()
        piece.id = ''
    } else if (piece.id === "black-pawn") {
        // xyIndex()
        const move = new Chessmoves(y, x)
        move.blackpawn()
    }



}

board.forEach(array => { array.forEach(element => element.addEventListener("click", peicesFunction)) })


class Chessmoves {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    knight() {
        // const negativeYtop = this.y - 2 === -1 || this.y - 2 === -2 ? 0 : this.y - 2
        // const negativeYLeftRight = this.y - 1 === -1 ? 0 : this.y - 1
        // const negativeYRight = this.y-1===-1?right1=undefined:this.y-1

        const top1 = board[this.y - 2][this.x - 1]
        const top2 = board[this.y - 2][this.x + 1]
        // Bottom
        const bottom1 = board[this.y + 2][this.x - 1]
        const bottom2 = board[this.y + 2][this.x + 1]
        // Left
        const left1 = board[this.y - 1][this.x - 2]
        const left2 = board[this.y + 1][this.x - 2]
        // Right
        const right1 = board[this.y - 1][this.x + 2]
        const right2 = board[this.y + 1][this.x + 2]

        const filterMOves = [top1, top2, bottom1, bottom2, left1, left2, right1, right2]
        // console.log(filterMOves)
        const knightMoves = filterMOves.filter(element => element !== undefined)
        // console.log(knightMoves)

        knightMoves.forEach(element => element.style.backgroundColor = "blue")
    }
    rook() {
        //Vertical Move
        const verticalMove = [board[0][this.y], board[1][this.y], board[2][this.y], board[3][this.y], board[4][this.y], board[5][this.y], board[6][this.y], board[7][this.y]]
        verticalMove.forEach(element => element.style.backgroundColor = "blue")
        //Horizontal Move
        board[this.x].forEach(element => element.style.backgroundColor = "blue")
    }
    whitepawn() {
        //Vertical Move
        const moveForward = board[this.x + 1][this.y]
        moveForward.style.backgroundColor = "blue"
        // moveForward.addEventListener('click', function () {
        //     moveForward.id = 'white-pawn'
        // })
    }
    blackpawn() {
        //Vertical Move
        const moveForward = board[this.x - 1][this.y]
        moveForward.style.backgroundColor = "blue"
    }
}

