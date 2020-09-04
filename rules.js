// Rules of chess:
// PAWN: can move one square forward(if there is no piece already on the square)
// can move 1 square diagonally only if there is a piece to capture and can be 
// promoted* on the opposite last rank
// also can move 2 squares forward on 1st move also enpassant*.
// KING: can move 1 square in any direction unless that square is being attacked.
// can castle*
// It is checkmate if king is under attack and there is no square to move to.
// BISHOP: can move and capture enemy pieces anywhere diagonally unless a piece is
// in the way
// ROOK: can move anywhere vertically or horizontally unless there is a piece in
// the way. Can castle*
// QUEEN: can move diagnolly, vertically, horizontally to any square unless
// a piece is blocking it.
// KNIGHT: can move to squares that are horizontally or vertically 2 squares away
// and 1 square adjacent to that square.
//disambiguation moves

//TODO:
//[ ] pawn can move 2 steps on it's 1st move
//[ ] rook
//[ ] Bishop
//[ ] queen
//[ ] knight
//[ ] king
//[ ] add rules for capturing
//[ ] make a list of moves made

import { alphabetOrder } from './board.js'

let pieceLettersName  = {
  'K' : 'King',
  'Q' : 'Queen',
  'R' : 'Rook',
  'B' : 'Bishop',
  'N' : 'Knight',
  'P' : 'Pawn'
}

function rectBoardSquares(ncol, nrow){
  /*returns an array containing all the coordinates of the board*/
  let row=[]
  let board = []
  let square = ""
  for(let j=1; j<=nrow; j++){
    for(let i=1; i<=ncol; i++){
      square = `${alphabetOrder[i-1]}${j}`
      row.push(square)
    }
    board.push(row)
    row = []
  }
  return board
}

function isBoardAndPositionLegit(board, position){
  /*checks whether:
   * square in `position` exists on the board
   * there are duplicate values in the position or boardo
  throws error if not*/
  for (let row of board){
    if((new Set(row).size) !== row.length){
      throw `${board} has duplicate values`
    }

  }

  let positionAll = position.white.concat(position.black)

  if((new Set(positionAll)).size !== positionAll.length){
    throw `${position} has duplicate values`
  }

  let legit = false
  let pieceCoordinate = ""
  for(let piecePosition of positionAll){
    pieceCoordinate = (piecePosition.length === 2) ? piecePosition : piecePosition.slice(1,) //since first letter is piece name exception pawns

    legit = false
    let square = ""
    for(let row of board){
      if(row.includes(pieceCoordinate)){
        legit = true
        break
      }
    }
  }
  if(legit === false){
    throw `isBoardAndPositionLegit:'${pieceCoordinate}' square in ${position} doees not exist on the board`
  }
}

function identifyPiece(position, piecePosition){
  /*indentifies piece from piecePosition and position then returns pieceType
  e.g. (Ke1, {white: ['Ke1',...], black: [...]}) will return "wK"*/

  let pieceLetter = ""
  pieceLetter = piecePosition.length === 2 ? 'P' : piecePosition[0]
  if(position.white.includes(piecePosition)){
    return `w${pieceLetter}`
  }
  else if(position.black.includes(piecePosition)){
    return `b${pieceLetter}`
  }
  else{
    throw `${piecePosition} piece was not found in the position`
  }
}

function isSquareEmptyAllyEnemy(position, square, color){
  let occupied = false
  let enemyColor = returnEnemyColor(color)

  for(let piecePosition of position[color]){
    let coord = piecePosition.slice(-2,)
    if(coord === square){
      occupied=true
      break
    }
  }
  if(occupied === true){
    return "ally"
  }

  //if by an enemyColor piece
  for(let piecePosition of position[enemyColor]){
    let coord = piecePosition.slice(-2,)
    if(coord === square){
      occupied=true
      break
    }
  }
  if(occupied === true){
    return "enemy"
  }

  return "empty"
}

function returnEnemyColor(color){
  if(color === "white"){
    return "black"
  }
  else if(color === "black"){
    return "white"
  }
}

function isSquareOnBoard(board, square){
  let exists = false
  for (let row of board){
    for(let sqr of row){
      if(sqr === square){
        exists = true
        break
      }
    }
    if(exists === true){
      break
    }
  }

  return exists
}

function pawnCanMove2(board, position, piecePosition, color){
  /*returns an array of squares the pawn can move to.
    e.g. ('e2', 'white', position) might return ['e3']*/
  let moves = []
  let frontSquare = ""

  if(color === "white"){
    //check if pawn can move 1 step forward if there is no piece in front of it
    frontSquare = `${piecePosition[0]}${parseInt(piecePosition[1]) + 1}`
  }
  // in case pawn is black the front square is of lower number
  else if(color === "black"){
    frontSquare = `${piecePosition[0]}${parseInt(piecePosition[1]) - 1}`
  }
  let positionAll = position.white.concat(position.black)
  let emptyAllyEnemy = isSquareEmptyAllyEnemy(position, frontSquare, color)
  if(emptyAllyEnemy === "empty"){ 
    moves.push(frontSquare)
  }

  //check if pawn can capture 1 step right diagonally
  let letterIndex = alphabetOrder.indexOf(piecePosition[0])
  let rightFile = alphabetOrder[letterIndex+1]
  let rightDiagonalSquare = ""

  if(color === "white"){
    rightDiagonalSquare = `${rightFile}${parseInt(piecePosition[1]) + 1}`
  }
  else if(color === "black"){
    rightDiagonalSquare = `${rightFile}${parseInt(piecePosition[1]) - 1}`
  }
  emptyAllyEnemy = isSquareEmptyAllyEnemy(position, rightDiagonalSquare, color)
  if(emptyAllyEnemy === "enemy"){
    moves.push(rightDiagonalSquare)
  } 

  let leftFile = alphabetOrder[letterIndex-1]
  let leftDiagonalSquare = `${leftFile}${parseInt(piecePosition[1]) + 1}`

  if(color === "white"){
    leftDiagonalSquare = `${leftFile}${parseInt(piecePosition[1]) + 1}`
  }
  else if(color === "black"){
    leftDiagonalSquare = `${leftFile}${parseInt(piecePosition[1]) - 1}`
  }
  emptyAllyEnemy = isSquareEmptyAllyEnemy(position, leftDiagonalSquare, color)
  if(emptyAllyEnemy === "enemy"){
    moves.push(leftDiagonalSquare)
  } 
  return moves
}

function rookCanMove2(board, position, pieceCoordinate, color) {
  /*returns an array of square the rook can move to*/
  let moves = []
  let occupied = false
  let square = ""
  let enemyColor = ""

  let checkPieceOnSquareAndExists = () => {
    let emptyAllyEnemy = isSquareEmptyAllyEnemy(position, square, color)
    if(emptyAllyEnemy === "Ally"){
      return false
    }

    else if(emptyAllyEnemy === "enemy"){
      moves.push(square)
      return false
    }

    //check whether square exists on the board
    let exists = isSquareOnBoard(board, square)
    if(exists === true){
      moves.push(square)
    }
    else if(exists === false){
      return false
    }
  }

  //add all squares to 'moves' going up in the column, stop if another piece blocks
  for(let i = parseInt(pieceCoordinate[1]) + 1; ; i++){
    square = `${pieceCoordinate[0]}${i}`
    if(checkPieceOnSquareAndExists() === false){
      break
    }
  }

  //add all squares to 'moves' going down in the column, stop if another piece blocks
  for(let i = parseInt(pieceCoordinate[1]) - 1; ; i--){
    square = `${pieceCoordinate[0]}${i}`
    if(checkPieceOnSquareAndExists() === false){
      break
    }
  }

  //add all squares to 'moves' going right in the row, stop if another piece blocks
  for(let i = parseInt(alphabetOrder.indexOf(pieceCoordinate[0])) + 1; ; i++){
    square = `${alphabetOrder[i]}${pieceCoordinate[1]}`
    if(checkPieceOnSquareAndExists() === false){
      break
    }
  }

  //add all squares to 'moves' going left in the row, stop if another piece blocks
  for(let i = parseInt(alphabetOrder.indexOf(pieceCoordinate[0])) - 1; ; i--){
    square = `${alphabetOrder[i]}${pieceCoordinate[1]}`
    if(checkPieceOnSquareAndExists() === false){
      break
    }
  }
  return moves
}

function canMove2(board, position, piecePosition){
  /*returns array of squares to which the piece on specified square can move to*/
  let moves = []
  let pieceType = ""
  let pieceCoordinate = piecePosition.slice(-2,)

  pieceType = identifyPiece(position, piecePosition)
  if(typeof(pieceType) === 'undefined'){
    console.log('canMove2: pieceType is not defined')
    return
  }

  //for pawn
  //white pawn
  if(pieceType === 'wP'){
    moves = pawnCanMove2(board, position, piecePosition, "white")
  }

  //black pawn
  else if(pieceType === "bP"){
    moves = pawnCanMove2(board, position, piecePosition, "black")
  }

  //for rook
  //white rook
  else if(pieceType === 'wR'){
    moves = rookCanMove2(board, position, pieceCoordinate, "white")
  }

  //black rook
  else if(pieceType === 'bR'){
    moves = rookCanMove2(board, position, pieceCoordinate, "black")
  }
  return moves
}

export{canMove2, rectBoardSquares, isBoardAndPositionLegit, isSquareEmptyAllyEnemy, returnEnemyColor}