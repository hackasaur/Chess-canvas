// Rules of chess:
// PAWN: can move one square forward(if there is no piece  already on the square)
// can move 1 square diagnolly only if there is a piece to capture and can be 
// promoted* on the opposite last rank
// also can move 2 squares forward on 1st move also enpassant*.
// KING: can move 1 square in any direction unless that square is being attacked.
// can castle*
// It is checkmate if king is under attack and there is no square to move to.
// BISHOP: can move and capture enemy pieces anywhere diagnolly unless a piece is
// in the way
// ROOK: can move anywhere vertically or horizontally unless there is a piece in
// the way. Can castle*
// QUEEN: can move diagnolly, vertically, horizontally to any square unless
// a piece is blocking it.
// KNIGHT: can move to squares that are horizontally or vertcally 2 squares away
// and 1 square adjacent to that square.

//disambiguation moves

alphabetOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

PieceLetters  = {
  'K' : 'King',
  'Q' : 'Queen',
  'R' : 'Rook',
  'B' : 'Bishop',
  'N' : 'Knight',
}

ncol = 8
nrow = 8
function rectBoardCoordinates(ncol, nrow){
//{{{
 /*returns an array containing all the coordinates of the board*/
  let row=[]
  let board = []
  for(let j=1; j<=nrow; j++){
    for(let i=1; i<=ncol; i++){
      coordinate = `${alphabetOrder[i-1]}${j}`
      row.push(coordinate)
    }
    board.push(row)
    row = []
  }
  return board

//}}}

function isBoardAndPositionLegit(board, position){
 //{{{
 /*checks whether:
   * square in `position` exists on the board
   * there are duplicate values in the position or board*/

  let positionAll = position.white.concat(position.black)
  let legit = false

  for(let piecePosition of positionAll){
    let pieceCoordinate = (piecePosition.length === 2) ? piecePosition : piecePosition.slice(1,) //since first letter is piece name exception pawns

    legit = false
    for(row of board){
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
      console.log(`no such sqaure as: ${pieceCoordinate}`)
      break
    }
  }
  return(legit)
}
//}}}

function canMove2(board, position, coordinate){
 //{{{
 /*returns array of squares to which the piece on specified square can move to*/

  let moves = []
  let pieceType
  //identify piece type at the 'coordinate'
  for(let piecePosition of position.white){
    if(piecePosition.slice(-2,) === coordinate){
      if(piecePosition.length === 2){
        pieceType = 'wP'
        break
      }
      else{
        if(piecePosition[0] === 'K'){
          pieceType = 'wK'
          break
        }
        else if(piecePosition[0] === 'Q'){
          pieceType = 'wQ'
          break
        }
        else if(piecePosition[0] === 'R'){
          pieceType = 'wR'
          break
        }
        else if(piecePosition[0] === 'N'){
          pieceType = 'wN'
          break
        }
        else if(piecePosition[0] === 'B'){
          pieceType = 'wB'
          break
        }
      }
    }
  }

  for(let piecePosition of position.black){
    if(piecePosition.slice(-2,) === coordinate){
      if(piecePosition.length === 2){
        pieceType = 'bP'
        break
      }
      else{
        if(piecePosition[0] === 'K'){
          pieceType = 'bK'
          break
        }
        else if(piecePosition[0] === 'Q'){
          pieceType = 'bQ'
          break
        }
        else if(piecePosition[0] === 'R'){
          pieceType = 'bR'
          break
        }
        else if(piecePosition[0] === 'N'){
          pieceType = 'bN'
          break
        }
        else if(piecePosition[0] === 'B'){
          pieceType = 'bB'
          break
        }
      }
    }
  }

  //for pawn
  if(pieceType === 'wP'){

    //check if pawn can move 1 step forward
    let frontSquare = `${coordinate[0]}${parseInt(coordinate[1]) + 1}`
    let positionAll = position.white.concat(position.black)
    let occupied = false
    for(let piecePosition of positionAll){
      if(piecePosition.slice(-2,) === frontSquare){
        console.log("there is a piece in front of the pawn")
        inFront = true
        break
      }
    }
    if(occupied === false){
      moves.push(frontSquare)
    }

    //check if pawn can capture 1 step right diagonally
    let rightFile
    let letterAt = -1
    for(let i=0; i < alphabetOrder.length; i++){
      if(coordinate[0] === alphabetOrder[i]){
        letterAt = i
      }
    }
    rightFile = alphabetOrder[letterAt+1]
    let rightDiagnolSquare = `${rightFile}${parseInt(coordinate[1]) + 1}`
    occupied = false
    for(let piecePosition of position.black){ //i.e there is a black piece diagnolly 1 square to the right of the pawn
      if(piecePosition.slice(-2,) === rightDiagnolSquare){
        occupied = true
        break
      }

    }
    if(occupied === true){
      moves.push(rightDiagnolSquare)
    }

    let leftFile
    letterAt = -1
    for(let i=0; i < alphabetOrder.length; i++){
      if(coordinate[0] === alphabetOrder[i]){
        letterAt = i
      }
    }
    leftFile = alphabetOrder[letterAt-1]
    let leftDiagnolSquare = `${leftFile}${parseInt(coordinate[1]) + 1}`
    occupied = false
    for(let piecePosition of position.black){ //i.e there is a black piece diagnolly 1 square to the right of the pawn
      if(piecePosition.slice(-2,) === leftDiagnolSquare){
        occupied = true
        break
      }

    }
    if(occupied === true){
      moves.push(leftDiagnolSquare)
    }
return moves
  }
}
//}}}

board = rectBoardCoordinates(7,8)
//console.log(board)
startingPosition = {
  white: ['Ke1','Qd1', 'e2'],
  black: ['Ke8', 'Qd8', 'f3', 'd3']
}

isBoardAndPositionLegit(board, startingPosition)
console.log(canMove2(board, startingPosition, 'e2'))
