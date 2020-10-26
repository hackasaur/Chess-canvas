//TODO:
//[x] draw each piece in the given position
//[x] piece should already be on the board: then picked
//[x] e.g. rank 1 should start from the bottom
//[x] piece should snap to the square when placed on the board
//[x] play sound when piece is kept back
//[ ] pieces should not overlap
//[ ] add rules for placing a piece
//NOTE:
//piecePosition is the algebraic notation piece letter and square e.g Ke1
//pieceCoordinate is only the square e.g e1
//position is an object like {white : ['Ke1', 'Qd1'], black : ['Ke8', 'Qd8']}

import {piecesProps} from './boardConfig.js'
import {alphabetOrder} from './board.js'

//images of pieces
let pieceLetters = ["wK", "wQ", "wR", "wN", "wB", "wP", "bK", "bQ", "bR", "bN", "bB", "bP" ]
let piecesImages = {}
//add keys as pieceLetters and values as images in object piecesImages e.g. {wk : img}
for (let letter of pieceLetters){
  let src = `./img/pieces/${piecesProps.pieceStyle}/${letter}.svg`
  let img = new Image()
  img.src = src
  piecesImages[letter] = img
}

function pieceImage(pieceLetter, color){
  if(color === "white"){
    return piecesImages[`w${pieceLetter}`]
  }
  if(color === "black"){
    return piecesImages[`b${pieceLetter}`]
  }
}

function algebraic2cartesian(boardProps, piecePosition){
  /*returns x and y coordinates of given piecePosition
  e.g say e4 may return [300, 400]
  */
  let x = 0
  let y = 0

  if(piecePosition.length === 2) {
    x = alphabetOrder.indexOf(piecePosition[0])*boardProps.squareSize + boardProps.originX
    y = boardProps.squareSize*(boardProps.rows -piecePosition[1]) + boardProps.originY
  }
  else{
    let pieceCoordinate = piecePosition.slice(1,)
    x = boardProps.squareSize*alphabetOrder.indexOf(pieceCoordinate[0]) + boardProps.originX
    y = boardProps.rows*boardProps.squareSize - boardProps.squareSize*(pieceCoordinate[1]) + boardProps.originY
  }
  return {
    x : x, 
    y : y
  }
}

function drawPiece(ctx, boardProps, x, y, img){
  let squareSize = boardProps.squareSize
  ctx.drawImage(img, x, y, squareSize, squareSize)
}

function drawPiecesFromPosition(ctx, boardProps, position){
  /*draws all the pieces of the given position on the board*/ 
  let pieceLetter = ""
  for(let piecePosition of position.white){
    let coordinate = algebraic2cartesian(boardProps, piecePosition)
    if(piecePosition.length === 2){
      pieceLetter = "P"
    }
    else{
      pieceLetter  = piecePosition[0]
    }
    drawPiece(
      ctx, 
      boardProps, 
      coordinate.x, 
      coordinate.y, 
      pieceImage(pieceLetter, "white")
    )
  }

  for(let piecePosition of position.black){
    let coordinate = algebraic2cartesian(boardProps, piecePosition)
    if(piecePosition.length === 2){
      pieceLetter = "P"
    }
    else{
      pieceLetter  = piecePosition[0]
    }
    drawPiece(
      ctx, 
      boardProps, 
      coordinate.x, 
      coordinate.y, 
      pieceImage(pieceLetter, "black"))
  }
}

function drawPieces(ctx, boardProps, position, grabbed, mouseX = 0, mouseY = 0){
  /*draws pieces depending on the value of grabbed using drawPiecesFromPosition*/
  if(!grabbed.value){
    drawPiecesFromPosition(ctx, boardProps, position)
  }
  else{
    //have to exclude grabbed piece from the position
    if(position.white.includes(grabbed.piecePosition)){
      let index = position.white.indexOf(grabbed.piecePosition)
      position.white.splice(index, 1)
    }
    if(position.black.includes(grabbed.piecePosition)){
      let index = position.black.indexOf(grabbed.piecePosition)
      position.black.splice(index, 1)
    }

    drawPiecesFromPosition(ctx, boardProps, position)
    let pieceLetter = ""
    if(grabbed.piecePosition.length === 2){
      pieceLetter = "P"
    }
    else{
      pieceLetter  = grabbed.piecePosition[0]
    }

    drawPiece(
      ctx,
      boardProps, 
      mouseX - boardProps.squareSize/2, 
      mouseY - boardProps.squareSize/2, 
      pieceImage(pieceLetter, grabbed.color))
  }
}

export { drawPieces, algebraic2cartesian }
