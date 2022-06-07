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

const board = [[],[],[],[],[],[],[],[]]

cells.forEach((element,index) =>{
    if(index<8){
        board[0].push(element)
    }else if(index<16){
        board[1].push(element)
    }else if(index<24){
        board[2].push(element)
    }else if(index<32){
        board[3].push(element)
    }else if(index<40){
        board[4].push(element)
    }else if(index<48){
        board[5].push(element)
    }else if(index<56){
        board[6].push(element)
    }else{
        board[7].push(element)
    }
})
// console.log(board)

const peicesFunction =(e)=>{
    const piece = e.target

    // console.log(Array.from(piece.parentElement.children))

    const pieceIndex = Array.from(piece.parentElement.children).indexOf(piece)
    console.log(pieceIndex)
    if(pieceIndex<8){
        const move = new Chessmoves(pieceIndex,0)
        move.knight()
    }else if(pieceIndex<16){
        const move = new Chessmoves(pieceIndex-8,1)
        move.knight()
    }else if(pieceIndex<24){
        const move = new Chessmoves(pieceIndex-16,2)
        move.knight()
    }else if(pieceIndex<32){
        const move = new Chessmoves(pieceIndex-24,3)
        move.knight()
    }else if(pieceIndex<40){
        const move = new Chessmoves(pieceIndex-32,4)
        move.knight()
    }else if(pieceIndex<48){
        const move = new Chessmoves(pieceIndex-40,5)
        move.knight()
    }else if(pieceIndex<56){
        const move = new Chessmoves(pieceIndex-48,6)
        move.knight()
    }else{
        const move = new Chessmoves(pieceIndex-56,7)
        move.knight()
    }
}

board.forEach(array=>{array.forEach(element=>element.addEventListener("click",peicesFunction))})

class Chessmoves{
    constructor(x,y){
        this.x = x
        this.y = y
    }
    knight() {
        const negativeYtop = this.y-2===-1 || this.y-2===-2 ?0:this.y-2
        const negativeYLeftRight = this.y-1===-1?0:this.y-1
        // const negativeYRight = this.y-1===-1?right1=undefined:this.y-1

        const top1 = board[negativeYtop][this.x-1]
        const top2 = board[negativeYtop][this.x+1]
        // Bottom
        const bottom1 = board[this.y+2][this.x-1] 
        const bottom2 = board[this.y+2][this.x+1]
        // Left
        const left1 = board[negativeYLeftRight][this.x-2]
        const left2 = board[this.y+1][this.x-2]
        // Right
        const right1 = board[negativeYLeftRight][this.x+2]
        const right2 = board[this.y+1][this.x+2]
        
        const filterMOves = [top1,top2,bottom1,bottom2,left1,left2,right1,right2]
        // console.log(filterMOves)
        const knightMoves = filterMOves.filter(element => element!==undefined) 
        // console.log(knightMoves)

        knightMoves.forEach(element => element.style.backgroundColor = "blue")

    }
}

