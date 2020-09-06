//TODO: chess should work even for arima like board

import {drawPieces, algebraic2cartesian} from './pieces.js'
import {drawCheckeredBoard, displayFileAndRank, alphabetOrder} from './board.js'
import {boardProps, piecesProps} from './boardConfig.js'
import {canMove2, rectBoardSquares, isBoardAndPositionLegit, isSquareEmptyAllyEnemy, returnEnemyColor} from './rules.js'

document.getElementById("board").style.cursor = "pointer"; //change cursor shape when inside board
const boardCanvas = document.getElementById("board")
const ctx = boardCanvas.getContext("2d")
//ctx.canvas.width = window.innerWidth
//ctx.canvas.height = window.innerHeight
//sounds
const moveSound = new Audio()
const captureSound = new Audio()
moveSound.src = './sounds/Lichess/standard/Move.mp3'
captureSound.src = './sounds/Lichess/standard/Capture.mp3'


//mouse
let mouseX = 0
let mouseY = 0

//game variables
let grabbed = {
  value: false, 
  piecePosition:[],
  color: ""
}
let loop
let board = rectBoardSquares(boardProps.cols, boardProps.rows)
let startingPosition = {
  white: ['Ke1','Qd1','Ra1','Rh1','Nb1','Ng1','Bc1','Bf1','a2','b2','c2','d2','e2','f2','g2','h2'],
  black: ['Ke8','Qd8','Ra8','Rh8','Nb8','Ng8','Bc8','Bf8','a7','b7','c7','d7','e7','f7','g7','h7']
}
let position = startingPosition
let lastSelectedPiece = {}

//pubSub
const createHub = () => {
  const events = {
  }

  const subscribe = (eventName, fn) => {
    events[eventName] = events[eventName] || []
    events[eventName].push(fn)
  }

  const unsubscribe = (eventName, fn) => {
    if(events[eventName]){
      for(let i=0; i<events[eventName].length; i++){
        if(events[eventName][i] === fn){
          events[eventName].splice(i,1)
        }
      }
    }
  }

  const publish = (eventName, data) => {
    if(events[eventName]){
      events[eventName].forEach((fn) => {
        fn(data)
      })
    }
  }
  return {subscribe, unsubscribe, publish}
}

function lastPiecePosition2newSquare(lastPiecePosition, newSquare){
  /*returns the piecePosition using the lastPiecePsition and the newSquare
  e.g. ('Rh1', 'h5') will return 'Rh5'*/

  //for pawn
  if(lastPiecePosition.length === 2){
    return newSquare
  }

  //for non-pawn pieces
  else if(lastPiecePosition.length === 3){
    let newPiecePosition = `${lastSelectedPiece.piecePosition[0]}${newSquare}`
    return newPiecePosition
  }
}

function grabbedIsTrue(ctx, board, boardProps, position, grabbed){
  /*draws game when grabbed is set to true*/
  loop = setInterval(()=>{
    drawRectGame(ctx, boardProps, position, grabbed)
  })
}

function grabbedIsFalse(ctx, board, boardProps, position, grabbed){
  /*draws game when grabbed is set to false*/

  let boardSquare = whichSquareFromCoordinates(boardProps, mouseX, mouseY)
  let newSquare = `${boardSquare.file}${boardSquare.rank}`

  //push lastSelectedPiece's piecePosition in `position` for canMove2
  position[lastSelectedPiece.color].push(lastSelectedPiece.piecePosition)

  //check if the piece can move to newSquare
  if(canMove2(board, position, lastSelectedPiece.piecePosition).includes(newSquare)){    
    let capturing = false
    // if a piece is being captured splice its piecePosition out of position
    if(isSquareEmptyAllyEnemy(position, newSquare, lastSelectedPiece.color) === "enemy"){//TODO: can be optimized since isSquareEmptyAllyEnemy already iterates over piecePositions
      let enemyColor = returnEnemyColor(lastSelectedPiece.color)
      let piecePosition = ""
      for(piecePosition of position[enemyColor]){
        let coord = piecePosition.slice(-2,)
        if(coord === newSquare){
          break
        }
      }
      let index = position[enemyColor].indexOf(piecePosition)
      position[enemyColor].splice(index, 1)
      captureSound.play()
      capturing = true
    }
    //splice the previous piecePosition out of the position
    let index = position[lastSelectedPiece.color].indexOf(lastSelectedPiece.piecePosition)
    position[lastSelectedPiece.color].splice(index, 1)
    //push the new piecePosition of the moved piece into position[white/black]
    let newPiecePosition = lastPiecePosition2newSquare(lastSelectedPiece.piecePosition, newSquare)
    position[lastSelectedPiece.color].push(newPiecePosition)
    if(!capturing){
      moveSound.play()
    }
  }

  drawRectGame(ctx, boardProps, position, grabbed)
}

function whichSquareFromCoordinates(boardProps, x, y){
  //returns the file and rank of the nearest square from the given coordinates 
  //e.g 200, 300 it may return {file: 'b', rank : 4}
  let squareSize = boardProps.squareSize
  let originX = boardProps.originX
  let originY = boardProps.originY

  let col = Math.floor((x - originX)/squareSize)
  let row = boardProps.rows - Math.floor((y - originY)/squareSize)
  let rank = row
  let file = alphabetOrder[col]
  return {
    file: file,
    rank: rank
  }
}

function XYOnWhichPieceSquare(boardProps, position, x, y){
  /*returns whether and which piece the x, y are on the board 
    e.g. for 200,300 it may return [true, Qe4]*/
  let color = ""
  for(let piecePosition of position.white){
    let pieceCoordinate = algebraic2cartesian(boardProps, piecePosition)
    color = "white" 
    if((x > pieceCoordinate.x && x < (pieceCoordinate.x + boardProps.squareSize)) && (y > pieceCoordinate.y && y < (pieceCoordinate.y + boardProps.squareSize))){
      return {value: true, color : color, piecePosition : piecePosition}
    }
  }
  for(let piecePosition of position.black){
    let pieceCoordinate = algebraic2cartesian(boardProps, piecePosition)
    color = "black"  
    if((x > pieceCoordinate.x && x < (pieceCoordinate.x + boardProps.squareSize)) && (y > pieceCoordinate.y && y < (pieceCoordinate.y + boardProps.squareSize))){
      return {value: true, color : color, piecePosition : piecePosition}
    }
  }
  return {value: false}
}

function drawRectGame(ctx, boardProps, position, grabbed){
  /*draws the board, file and rank, pieces*/
  //console.log(position) //TODO proper algebraic moves
  drawCheckeredBoard(ctx, boardProps)
  displayFileAndRank(ctx, boardProps)
  drawPieces(ctx, boardProps, position, grabbed, mouseX, mouseY)
}

function setGrabbed(value, selectedPiece = null){
  if(value){
    grabbed = {
      value:value,
      piecePosition: selectedPiece.piecePosition,
      color: selectedPiece.color
    }
  }
  else{
    grabbed = {value:value}
  }

  if(grabbed.value){//grabbed set true from false TODO *pubsub needed here
    grabbedIsTrue(ctx, board, boardProps, position, grabbed)
    lastSelectedPiece = selectedPiece
  }

  else{//grabbed set false from true
    clearInterval(loop)
    // moveSound.play()
    grabbedIsFalse(ctx, board, boardProps, position, grabbed)
  }
}

//listeners
boardCanvas.addEventListener('mousedown', e => {
  let mouseOnPiece = XYOnWhichPieceSquare(boardProps, startingPosition, e.offsetX, e.offsetY)
  if(mouseOnPiece.value){
    setGrabbed(true, mouseOnPiece)
  }
})

boardCanvas.addEventListener('mouseup', ()=>{
  if(grabbed.value){
    setGrabbed(false)
  }
})

boardCanvas.addEventListener('mousemove', (e) => {
  mouseX = e.offsetX
  mouseY = e.offsetY
})

//main
isBoardAndPositionLegit(board, position)
drawRectGame(ctx, boardProps, startingPosition, grabbed)
