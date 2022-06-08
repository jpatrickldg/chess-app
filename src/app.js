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
board[6][7].id = "black-rook"
// console.log(board[0][0])

//class black and white for all the pieces
for (let i = 0; i < 8; i++) {
    board[0][i].classList.add("white")
    board[1][i].classList.add("white")
}
for (let i = 0; i < 8; i++) {
    board[6][i].classList.add("black")
    board[7][i].classList.add("black")
}

const peicesFunction = (e) => {
    const piece = e.target
    const pieceIndex = Array.from(piece.parentElement.children).indexOf(piece)
    let x, y;

    const xyIndex = ()=>{
    x = pieceIndex % 8
    y = (pieceIndex - x) / 8
    }
    //Knight
    if (piece.id === "white-knight" || piece.id === "black-knight") {
        xyIndex()
        const move = new Chessmoves(y, x)
        move.knight()
        //Rook
    } else if (piece.id === "black-rook") {
        xyIndex()
        const move = new Chessmoves(y, x)
        move.blackrook()
        //Pawn
    } else if (piece.id === "white-pawn") {
        xyIndex()
        const move = new Chessmoves(y, x)
        move.whitepawn()
    } else if (piece.id === "black-pawn") {
        xyIndex()
        const move = new Chessmoves(y, x)
        move.blackpawn()
    }

}

board.forEach(array => { array.forEach(element => element.addEventListener("click", peicesFunction)) })

class Chessmoves {
    constructor(y, x) {
        this.y = y
        this.x = x
    }
    knight() {
        const negativeYtop = this.y - 2 === -1 || this.y - 2 === -2 ? 0 : this.y - 2
        const negativeYLeftRight = this.y - 1 === -1 ? 0 : this.y - 1
        // const negativeYRight = this.y-1===-1?right1=undefined:this.y-1

        const top1 = board[negativeYtop][this.x - 1]
        const top2 = board[negativeYtop][this.x + 1]
        // Bottom
        const bottom1 = board[this.y + 2][this.x - 1]
        const bottom2 = board[this.y + 2][this.x + 1]
        // Left
        const left1 = board[negativeYLeftRight][this.x - 2]
        const left2 = board[this.y + 1][this.x - 2]
        // Right
        const right1 = board[negativeYLeftRight][this.x + 2]
        const right2 = board[this.y + 1][this.x + 2]

        const filterMOves = [top1, top2, bottom1, bottom2, left1, left2, right1, right2]
        // console.log(filterMOves)
        const knightMoves = filterMOves.filter(element => element !== undefined)
        // console.log(knightMoves)

        knightMoves.forEach(element => element.style.backgroundColor = "blue")
    }
    blackrook() {
        //Vertical Move
        // const verticalMove = [board[0][this.y], board[1][this.y], board[2][this.y], board[3][this.y], board[4][this.y], board[5][this.y], board[6][this.y], board[7][this.y]]
        // verticalMove.forEach(element => element.style.backgroundColor = "blue")
        

    
        for (let i = this.y+1 ; i < 8; i++) {
            if(board[i][this.x].classList.contains("black")){
                break
            }else if(board[i][this.x].classList.contains("white")){
                board[i][this.x].style.backgroundColor = "yellow"
                board[i][this.x].addEventListener("click",capture)
                break
            }else{
                board[i][this.x].style.backgroundColor = "yellow"
            }
        }
        for (let i = this.y-1 ; i > -1; i--) {
            const capture = ()=>{
                board[i][this.x].id = "black-rook"
                board[i][this.x].classList.remove("white")
                board[i][this.x].classList.add("black")

                board[this.y][this.x].id = ""
                board[this.y][this.x].classList.remove("black")
            }

            if(board[i][this.x].classList.contains("black")){
                break
            }else if(board[i][this.x].classList.contains("white")){
                board[i][this.x].style.backgroundColor = "yellow"
                board[i][this.x].addEventListener("click",capture)
                break
            }else{
                board[i][this.x].style.backgroundColor = "yellow"
            }
        }


        //Horizontal Move
        // board[this.x].forEach(element => element.style.backgroundColor = "blue")
    }
    whitepawn() {
        //Vertical Move
        const moveForward = board[this.x + 1][this.y]
        moveForward.style.backgroundColor = "blue"
    }
    blackpawn() {
        //Vertical Move
        const moveForward = board[this.x - 1][this.y]
        moveForward.style.backgroundColor = "blue"
    }
}

