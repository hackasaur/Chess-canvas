// todo:
// [X] display rank and files along the edges
// [ ] display pieces

const wKImg = new Image()
wKImg.src = './img/pieces/wikipedia/wK.png'

const board = document.getElementById("board")
const ctx = board.getContext("2d")
alphabetOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

//board dimensions
let cols = 8
let rows = 8
let squareSize = 100

//mouse
let mouseX = 0
let mouseY = 0

function drawCheckeredBoard(ctx, squareSize, rows, cols) {
  //draws from (0,0)
  let lightColor = "#ffe6cc"
  let darkColor = "#cc6600"

  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) 
        ctx.fillStyle = lightColor
      else ctx.fillStyle = darkColor
      ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
    }
}

function displayFileAndRank(ctx, squareSize, rows, cols){
  //draws from (0,0)
  let fontSize = 12
  ctx.font = `${fontSize}px Arial`;
  let fontColor = "#000000"
  let padding = 3
  ctx.fillStyle = fontColor
  //display files
  for(let i=0; i<cols; i++){
    ctx.fillText(`${alphabetOrder[i]}`, i * squareSize + padding, rows * squareSize - padding);
  }
  //display ranks
  for(let j=0; j<rows; j++){
    ctx.fillText(parseInt(j+1), padding, (rows-j-1)*squareSize + fontSize);
  }
}

function drawPieces(){
  ctx.drawImage(wKImg, mouseX - squareSize/2, mouseY - squareSize/2, squareSize, squareSize)
}

function drawRectGame(ctx,rows, cols, squareSize){
  drawCheckeredBoard(ctx, squareSize, rows, cols)
  displayFileAndRank(ctx, squareSize, rows, cols)
  drawPieces()
}

function setGrabbed(value){
  let grabbed = value
  if(grabbed === true){
    loop  = setInterval(() => {drawRectGame(ctx, rows, cols, squareSize)}, 10)
  }
  else if(grabbed === false){
    clearInterval(loop)
  }
}
board.addEventListener('mousemove', (e)=>{
    mouseX = e.offsetX
    mouseY = e.offsetY
})
board.addEventListener('mousedown', ()=>{setGrabbed(true)})
board.addEventListener('mouseup', ()=>{setGrabbed(false)})

//main
//game_loop = setInterval(()=> {drawRectGame()}, 100)

drawCheckeredBoard(ctx, squareSize, rows, cols)
displayFileAndRank(ctx, squareSize, rows, cols)
