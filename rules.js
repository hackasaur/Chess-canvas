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
   * there are duplicate values in the position or board*/
  let positionAll = position.white.concat(position.black)
  let legit = false
  for(let piecePosition of positionAll){
    let pieceCoordinate = (piecePosition.length === 2) ? piecePosition : piecePosition.slice(1,) //since first letter is piece name exception pawns

    legit = false
    let square = ""
    for(let row of board){
      for(square of row){
        if(pieceCoordinate === square){
          legit = true
          break
        }
      }
      if(legit === true){
        break
      }
    }
    if(legit === false){
      throw `isBoardAndPositionLegit:' ${pieceCoordinate}' square doees not exist on the board`
    }
  }
  return(legit)
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

function pawnCanMove2(board, position, piecePosition, color){
  /*returns an array of squares the pawn can move to.
    e.g. ('e2', 'white', position) might return ['e3']*/
  let moves = []

  if(color === "white"){
    //check if pawn can move 1 step forward if there is no piece in front of it
    let frontSquare = `${piecePosition[0]}${parseInt(piecePosition[1]) + 1}`
    let positionAll = position.white.concat(position.black)
    let occupied = false
    for(let piecePosition of positionAll){
      if(piecePosition.slice(-2,) === frontSquare){
        console.log("there is a piece in front of the pawn")
        occupied = true
        break
      }
    }
    if(occupied === false){ 
      moves.push(frontSquare)
    }
    //check if pawn can capture 1 step right diagonally
    occupied = false
    let rightFile
    let letterIndex = alphabetOrder.indexOf(piecePosition[0])
    rightFile = alphabetOrder[letterIndex+1]
    let rightDiagonalSquare = `${rightFile}${parseInt(piecePosition[1]) + 1}`
    for(let piecePosition of position.black){ //check is there a black piece diagonally 1 square to the right of the pawn
      if(piecePosition.slice(-2,) === rightDiagonalSquare){
        occupied = true
        break
      }
    }
    if(occupied === true){
      moves.push(rightDiagonalSquare)
    }
    //check if pawn can capture 1 step left diagonally
    occupied = false
    let leftFile
    letterIndex = alphabetOrder.indexOf(piecePosition[0])
    leftFile = alphabetOrder[letterIndex-1]
    let leftDiagonalSquare = `${leftFile}${parseInt(piecePosition[1]) + 1}`
    for(let piecePosition of position.black){ //i.e there is a black piece diagnolly 1 square to the right of the pawn
      if(piecePosition.slice(-2,) === leftDiagonalSquare){
        occupied = true
        break
      }
    }
    if(occupied === true){
      moves.push(leftDiagonalSquare)
    }
  }

  //black pawn
  else if(color === "black"){
    //check if pawn can move 1 step forward if there is no piece in front of it
    let frontSquare = `${piecePosition[0]}${parseInt(piecePosition[1]) - 1}`
    let positionAll = position.white.concat(position.black)
    let occupied = false
    for(let piecePosition of positionAll){
      if(piecePosition.slice(-2,) === frontSquare){
        console.log("there is a piece in front of the pawn")
        occupied = true
        break
      }
    }

    if(occupied === false){ 
      moves.push(frontSquare)
    }
    //check if pawn can capture 1 step right diagonally
    occupied = false
    let rightFile
    let letterIndex = alphabetOrder.indexOf(piecePosition[0])
    rightFile = alphabetOrder[letterIndex+1]
    let rightDiagonalSquare = `${rightFile}${parseInt(piecePosition[1]) - 1}`
    for(let piecePosition of position.white){ //check is there a black piece diagonally 1 square to the right of the pawn
      if(piecePosition.slice(-2,) === rightDiagonalSquare){
        occupied = true
        break
      }
    }
    if(occupied === true){
      moves.push(rightDiagonalSquare)
    }
    //check if pawn can capture 1 step left diagonally
    occupied = false
    let leftFile
    letterIndex = alphabetOrder.indexOf(piecePosition[0])
    leftFile = alphabetOrder[letterIndex-1]
    let leftDiagonalSquare = `${leftFile}${parseInt(piecePosition[1]) - 1}`
    for(let piecePosition of position.white){ //i.e there is a black piece diagnolly 1 square to the right of the pawn
      if(piecePosition.slice(-2,) === leftDiagonalSquare){
        occupied = true
        break
      }
    }
    if(occupied === true){
      moves.push(leftDiagonalSquare)
    }
  }
  return moves
}

function isSquareEmptyAllyEnemy(position, square, color){
  let occupied = false
  let enemyColor = ""

  if(color === "white"){
    enemyColor = "black"
  }
  else if(color === "black"){
    enemyColor = "white"
  }

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

function rookCanMove2(board, position, pieceCoordinate, color) {
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

// let board = rectBoardSquares(ncol, nrow)
// console.log(board)
// let startingPosition = {
//   white: ['Ke1','Qd1', 'Bf8', 'Re2'],
//   black: ['Ke8', 'Qd8', 'f7', 'd7']
// }
//
// //console.log(isBoardAndPositionLegit(board, startingPosition))
// console.log(canMove2(board, startingPosition, 'Re2'))

export{canMove2, rectBoardSquares}
