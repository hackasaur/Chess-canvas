// todo:
// [X] display rank and files along the edges
// [ ] display pieces

let alphabetOrder = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

let boardProps = {
  lightColor: "#f8f2ec",
  darkColor: "#739900",
  font: "Arial",
  fontColor: "#000000",
  fontSize: 14,
  padding: 3,
  squareSize: 100,
  cols: 8,
  rows: 8
}


function drawCheckeredBoard(ctx, squareSize, rows, cols) {
  //draws from (0,0)

  for (let j = 0; j < rows; j++)
    for (let i = 0; i < cols; i++) {
      if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) 
        ctx.fillStyle = boardProps.lightColor
      else ctx.fillStyle = boardProps.darkColor
      ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
    }
}

function displayFileAndRank(ctx, squareSize, rows, cols){
  //draws from (0,0)
  let fontSize = boardProps.fontSize
  ctx.font = `${fontSize}px ${boardProps.font}`;
  let fontColor = boardProps.fontColor
  let padding = boardProps.padding

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

export {drawCheckeredBoard, displayFileAndRank, boardProps, alphabetOrder}
