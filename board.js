const board = document.getElementById("board")
const ctx = board.getContext("2d")

let cols = 4
let rows = 8
let squareSize = 100

function drawCheckeredBoard(ctx, squareSize, rows, cols) {
    let whiteSquareColor = "#ffe6cc"
    let blackSquareColor = "#cc6600"

    for (let j = 0; j < rows; j++)
        for (let i = 0; i < cols; i++) {
            if ((i % 2 == 0 && j % 2 == 0) || (i % 2 != 0 && j % 2 != 0)) 
                ctx.fillStyle = whiteSquareColor
            else ctx.fillStyle = blackSquareColor
            ctx.fillRect(i * squareSize, j * squareSize, squareSize, squareSize)
        }
}

drawCheckeredBoard(ctx, squareSize, rows, cols)
