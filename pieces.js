//TODO:
//[ ] piece should be placed at the center of the square
//[ ] draw each piece in the given position

let pieceStyle = 'Lichess/merida'

//images
const wKImg = new Image()
wKImg.src = `./img/pieces/${pieceStyle}/wK.svg`

function drawPieces(ctx, squareSize, mouseX, mouseY){
  ctx.drawImage(wKImg, mouseX - squareSize/2, mouseY - squareSize/2, squareSize, squareSize)
}

//function placePieceInsideSquare(mouseX, mouseY, grabbed){

//}


export { drawPieces }
