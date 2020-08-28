// todo:
// [X] display rank and files along the edges
// [ ] display pieces

import {boardProps} from './boardConfig.js'
let alphabetOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

function drawCheckeredBoard(ctx, boardProps) {

  for (let j = 0; j < boardProps.rows; j++)
    for (let i = 0; i < boardProps.cols; i++) {
      if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0))
        ctx.fillStyle = boardProps.lightColor
      else ctx.fillStyle = boardProps.darkColor
      ctx.fillRect(i * boardProps.squareSize + boardProps.originX, j * boardProps.squareSize + boardProps.originY, boardProps.squareSize, boardProps.squareSize)
    }
}

function displayFileAndRank(ctx, boardProps){
  //draws from (0,0)
  let fontSize = boardProps.fontSize
  ctx.font = `${fontSize}px ${boardProps.font}`;
  let fontColor = boardProps.fontColor
  let padding = boardProps.padding
  let squareSize = boardProps.squareSize
  let rows = boardProps.rows
  let cols = boardProps.cols
  let originX = boardProps.originX
  let originY = boardProps.originY

  ctx.fillStyle = fontColor
  //display files
  for(let i=0; i<cols; i++){
    ctx.fillText(`${alphabetOrder[i]}`, i * squareSize + padding + originX, rows * squareSize - padding + originY);
  }
  //display ranks
  for(let j=0; j<rows; j++){
    ctx.fillText(parseInt(j+1), padding + originX, (rows-j-1)*squareSize + fontSize + originY);
  }
}

export {drawCheckeredBoard, displayFileAndRank, boardProps, alphabetOrder}
