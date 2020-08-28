import { drawPieces, algebraic2cartesian} from './pieces.js'
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
let grabbed = {
  value: false, 
  piecePosition:[],
  color: ""
}

let loop
let startingPosition = {
  white: ['Ke1','Qd1','Ra1','Rh1','Nb1','Ng1','Bc1','Bf1','a2','b2','c2','d2','e2','f2','g2','h2'],
  black: ['Ke8','Qd8','Ra8','Rh8','Nb8','Ng8','Bc8','Bf8','a7','b7','c7','d7','e7','f7','g7','h7']
}

let position = startingPosition
let lastSelectedPiece = {}
//pubSub
const createHub = () => {
  //{{{
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
  //}}}
  return {subscribe, unsubscribe, publish}
}

function whichSquareFromCoordinates(boardProps, x, y){
  //returns the file and rank of the nearest square from the given coordinates 
  //e.g 200, 300 it may return {file: 'b', rank : 4}
  //{{{
  let squareSize = boardProps.squareSize
  let originX = boardProps.originX
  let originY = boardProps.originY

  let col = Math.floor((x - originX)/squareSize)
  let row = boardProps.rows - Math.floor((y - originY)/squareSize)
  let rank = row
  let file = alphabetOrder[col]
  //}}}
  return {
    file: file,
    rank: rank
  }
}

function XYOnWhichPieceSquare(boardProps, x, y, position){
  /*returns whether and which piece the x, y are on the board 
    e.g. for 200,300 it may return [true, Qe4]*/
  //{{{
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
  //}}}
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
    grabbed = {value:value, piecePosition: selectedPiece.piecePosition, color: selectedPiece.color}
  }
  else{
    grabbed = {value:value}
  }
  if(grabbed.value){//grabbed set true from false TODO *pubsub needed here
    //exclude grabbed piece from position
    loop = setInterval(()=>{
      drawRectGame(ctx, boardProps, position, grabbed)
    })
    lastSelectedPiece = selectedPiece
  }
  else{//grabbed set false from true
    let boardSquare = whichSquareFromCoordinates(boardProps, mouseX, mouseY)
    if(lastSelectedPiece.piecePosition.length === 2){
      if(lastSelectedPiece.color === "white"){
        position.white.push(`${boardSquare.file}${boardSquare.rank}`)
      }
      else if(lastSelectedPiece.color === "black"){
        position.black.push(`${boardSquare.file}${boardSquare.rank}`)
      }
    }
    else{
      let newPiecePosition = `${lastSelectedPiece.piecePosition[0]}${boardSquare.file}${boardSquare.rank}`
      if(lastSelectedPiece.color === "white"){
        position.white.push(newPiecePosition)
      }
      else{
        position.black.push(newPiecePosition)
      }
    }
    clearInterval(loop)
    //update position here using nearestSquareCoordinates
    drawRectGame(ctx, boardProps, position, grabbed)
  }
}

//listeners
board.addEventListener('mousedown', e => {
  let mouseOnPiece = XYOnWhichPieceSquare(boardProps, e.offsetX, e.offsetY, startingPosition)
  if(mouseOnPiece.value){
    setGrabbed(true, mouseOnPiece)
  }
})

board.addEventListener('mouseup', ()=>{
  if(grabbed.value){
    setGrabbed(false)
  }
})

board.addEventListener('mousemove', (e) => {
  mouseX = e.offsetX
  mouseY = e.offsetY
})

//main
drawRectGame(ctx, boardProps, startingPosition, grabbed)
