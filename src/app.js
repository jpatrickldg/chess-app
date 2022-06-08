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
board[4][4].id = "black-bishop"
board[7][3].id = "black-queen"
board[7][4].id = "black-king"
board[7][5].id = "black-bishop"
board[7][6].id = "black-knight"
board[5][7].id = "black-rook"

board[6][0].id = "black-pawn"
board[6][1].id = "black-pawn"
board[6][2].id = "black-pawn"
board[6][3].id = "black-pawn"
board[6][4].id = "black-pawn"
board[6][5].id = "black-pawn"
board[6][6].id = "black-pawn"
board[6][7].id = "black-pawn"
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
        //Black Rook
    } else if (piece.id === "black-rook") {
        xyIndex()
        const move = new Chessmoves(y, x)
        move.blackRook()
        //Pawn
    } else if (piece.id === "white-pawn") {
        xyIndex()
        const move = new Chessmoves(y, x)
        move.whitepawn()
    } else if (piece.id === "black-pawn") {
        xyIndex()
        const move = new Chessmoves(y, x)
        move.blackpawn()
        //BlackBishop
    } else if (piece.id === "black-bishop") {
        xyIndex()
        const move = new Chessmoves(y, x)
        move.blackBishop()
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
    blackRook() {
        //Vertical Move
        //Bottom
        for (let i = this.y+1 ; i < 8; i++) {
            const capture = (e)=>{
                const targetBox = e.target
                targetBox.id = "black-rook"
                targetBox.classList.remove("white")
                targetBox.classList.add("black")
    
                board[this.y][this.x].id = ""
                board[this.y][this.x].classList.remove("black")
            }
            if(board[i][this.x].classList.contains("black")){
                break
            }else if(board[i][this.x].classList.contains("white")){
                // board[i][this.x].style.backgroundColor = "yellow"
                board[i][this.x].addEventListener("click",capture)
                break
            }else{
                board[i][this.x].addEventListener("click",capture)
            }
        }
        //Top
        for (let i = this.y-1 ; i > -1; i--) {
            const capture = (e)=>{
                const targetBox = e.target
                targetBox.id = "black-rook"
                targetBox.classList.remove("white")
                targetBox.classList.add("black")
    
                board[this.y][this.x].id = ""
                board[this.y][this.x].classList.remove("black")
            }
            if(board[i][this.x].classList.contains("black")){
                break
            }else if(board[i][this.x].classList.contains("white")){
                // board[i][this.x].style.backgroundColor = "yellow"
                board[i][this.x].addEventListener("click",capture)
                break
            }else{
                board[i][this.x].addEventListener("click",capture)
            }
        }
        //Horizontal Move
        //Left
        for (let i = this.x-1 ; i > -1; i--) {
            const capture = (e)=>{
                const targetBox = e.target
                targetBox.id = "black-rook"
                targetBox.classList.remove("white")
                targetBox.classList.add("black")
    
                board[this.y][this.x].id = ""
                board[this.y][this.x].classList.remove("black")
            }
            if(board[this.y][i].classList.contains("black")){
                break
            }else if(board[this.y][i].classList.contains("white")){
                // board[this.y][i].style.backgroundColor = "yellow"
                board[this.y][i].addEventListener("click",capture)
                break
            }else{
                board[this.y][i].addEventListener("click",capture)
            }
        }
        //Right
        for (let i = this.x+1 ; i < 8; i++) {
            const capture = (e)=>{
                const targetBox = e.target
                targetBox.id = "black-rook"
                targetBox.classList.remove("white")
                targetBox.classList.add("black")
    
                board[this.y][this.x].id = ""
                board[this.y][this.x].classList.remove("black")
            }
            if(board[this.y][i].classList.contains("black")){
                break
            }else if(board[this.y][i].classList.contains("white")){
                board[this.y][i].addEventListener("click",capture)
                break
            }else{
                board[this.y][i].addEventListener("click",capture)
            }
        }
    }
    blackBishop() {
        
        let addTopRight = 1
        for (let i = this.y-1 ; i > -1; i--) {
            const capture = (e)=>{
                const targetBox = e.target
                targetBox.id = "black-bishop"
                targetBox.classList.remove("white")
                targetBox.classList.add("black")
    
                board[this.y][this.x].id = ""
                board[this.y][this.x].classList.remove("black")
            }
            if(board[i][this.x+addTopRight].classList.contains("black")){
                break
            }else if(board[i][this.x+addTopRight].classList.contains("white")){
                board[i][this.x+addTopRight].style.backgroundColor = "blue"
                board[i][this.x+addTopRight].addEventListener("click",capture)
                break
            }else{
                board[i][this.x+addTopRight].style.backgroundColor = "yellow"
                board[i][this.x+addTopRight].addEventListener("click",capture)
            }
            addTopRight += 1
        }
    
    }
    whitepawn() {
        //Vertical Move
        const moveForward = board[this.y + 1][this.x]
        moveForward.style.backgroundColor = "blue"
    }
    blackpawn() {
        //Vertical Move
        const moveForward = board[this.y - 1][this.x]
        moveForward.style.backgroundColor = "blue"
    }
}

