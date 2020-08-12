import { drawPieces } from './pieces.js'
import {drawCheckeredBoard, displayFileAndRank, boardProps, alphabetOrder} from './board.js'

const board = document.getElementById("board")
const ctx = board.getContext("2d")

//sounds
const moveSound = new Audio()
moveSound.src = './sounds/Lichess/standard/Move.mp3'

//mouse
let mouseX = 0
let mouseY = 0

//game
let grabbed = false
let loop

function drawRectGame(ctx,rows, cols, squareSize){
  drawCheckeredBoard(ctx, squareSize, rows, cols)
  displayFileAndRank(ctx, squareSize, rows, cols)
  drawPieces(ctx, squareSize, mouseX, mouseY)
  console.log('loop is running')
}

function setGrabbed(value){
  grabbed = value
  if(grabbed === true){
    loop  = setInterval(() => {drawRectGame(ctx, boardProps.rows, boardProps.cols, boardProps.squareSize)}, 10)
  }
  else if(grabbed === false){
    clearInterval(loop)
    moveSound.play()
  }
}

board.addEventListener('mousedown', ()=>{setGrabbed(true)})
board.addEventListener('mouseup', ()=>{setGrabbed(false)})
board.addEventListener('mousemove', (e)=>{
    mouseX = e.offsetX
    mouseY = e.offsetY
})

//main

drawCheckeredBoard(ctx, boardProps.squareSize, boardProps.rows, boardProps.cols)
displayFileAndRank(ctx, boardProps.squareSize, boardProps.rows, boardProps.cols)
