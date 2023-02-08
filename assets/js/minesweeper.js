window.addEventListener("load", function () {
  const restartButton = document.querySelector("#restart");
  if (!restartButton) {
    return;
  }

  restartButton.addEventListener("click", function () {
    location.reload();
  });

  const _length = parseInt(document.getElementById("length").value);
});

const mineField = [];
const colors = ["white", "red", "#FFA500", "green", "blue", "purple", "black", "gray"];
let mineCount = 0;
let flaggedCount = 0;
let timer = 0;
let gameOver = false;
let firstClick = true;

function spreadEmpty(row, col) {
  console.log("Spread empty");
  console.log(`Row: ${row}`);
  console.log(`Col: ${col}`);
  console.log(`Value of mineField[row][col]: ${mineField[row][col]}`);
  console.log(`Length: ${_length}`);
  console.log(`Width: ${width}`);
  if (row < 0 || row >= _length || col < 0 || col >= width) {
    console.log("Invalid row");
    return;
  }
  if (table.rows[row + 1].cells[col].innerHTML !== "") {
    console.log("Cell already clicked");
    return;
  }
  table.rows[row + 1].cells[col].style.backgroundColor = colors[0];
  if (mineField[row][col] === 0) {
    let _mines = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          row + i >= 0 &&
          row + i < mineField.length &&
          col + j >= 0 &&
          col + j < mineField[row].length
        ) {
          if (mineField[row + i][col + j] === 1) {
            _mines++;
          }
        }
      }
    }
    table.rows[row + 1].cells[col].innerHTML = _mines;
    table.rows[row + 1].cells[col].style.backgroundColor = colors[_mines];
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        spreadEmpty(row + i, col + j);
      }
    }
  } else {
    let _mines = 0;
    for (let i = -1; i <= 1; i++) {
      for (let j = -1; j <= 1; j++) {
        if (
          row + i >= 0 &&
          row + i < mineField.length &&
          col + j >= 0 &&
          col + j < mineField[row].length
        ) {
          if (mineField[row + i][col + j] === 1) {
            _mines++;
          }
        }
      }
    }
    table.rows[row + 1].cells[col].innerHTML = _mines;
    table.rows[row + 1].cells[col].style.backgroundColor = colors[_mines];
  }
}

function handleClick(event) {
  if (event.button === 0) {
    const row = parseInt(event.srcElement.getAttribute("data-row"));
    const col = parseInt(event.srcElement.getAttribute("data-col"));
    if (gameOver || event.srcElement.classList.contains("flagged")) {
      return;
    }

    /*if (firstClick) {
      firstClick = false;
      let row = event.srcElement.parentElement.rowIndex;
      let col = event.srcElement.cellIndex;
      spreadEmpty(row, col);
    } else if (mineField[event.srcElement.parentElement.rowIndex][event.srcElement.cellIndex] === 0) {
      spreadEmpty(event.srcElement.parentElement.rowIndex, event.srcElement.cellIndex);
    } else */if (mineField[event.srcElement.parentElement.rowIndex][event.srcElement.cellIndex] === 1) {
      gameOver = true;
      event.srcElement.innerHTML = "X";    
      event.srcElement.classList.add("mined");
      showAllMines();
      alert("Game Over!");      
      event.srcElement.innerHTML = "X";
      event.srcElement.style.backgroundColor = colors[1];
    } else {
        if(mineField[event.srcElement.parentElement.rowIndex][event.srcElement.cellIndex] === 0) {
            spreadEmpty(row, col);
        }
        let _mines = 0;
        for (let i = -1; i <= 1; i++) {
          for (let j = -1; j <= 1; j++) {
            if (
              row + i >= 0 &&
              row + i < mineField.length &&
              col + j >= 0 &&
              col + j < mineField[row].length
            ) {
              if (mineField[row + i][col + j] === 1) {
                _mines++;
              }
            }
          }
        }
        event.srcElement.innerHTML = _mines;
        event.srcElement.style.backgroundColor = colors[_mines];
    }
  }
}

function handleRightClick(event) {
  event.preventDefault();
  if (gameOver) {
    return;
  }
  if (!this.classList.contains("flagged")) {
    this.classList.add("flagged");
    this.innerHTML = "&#9873;";
    flaggedCount++;
    if (mineField[parseInt(this.getAttribute("data-row"))][parseInt(this.getAttribute("data-col"))] === 1) {
      mineCount--;
    }
  } else {
    this.classList.remove("flagged");
    this.innerHTML = "";
    flaggedCount--;
    if (mineField[parseInt(this.getAttribute("data-row"))][parseInt(this.getAttribute("data-col"))] === 1) {
      mineCount++;
    }
  }
  if (mineCount === 0 && flaggedCount === mineField.length * mineField[0].length) {
    gameOver = true;
    alert("You win!");
  }
}

function showAllMines() {
  const cells = document.querySelectorAll("td");
  for (const cell of cells) {
    if (mineField[parseInt(cell.getAttribute("data-row"))][parseInt(cell.getAttribute("data-col"))] === 1) {
      cell.style.backgroundColor = colors[1];
      cell.innerHTML = "X";
    }
  }
}

function generateMineField(rows, cols, mines) {
  mineCount = mines;
  for (let i = 0; i < rows; i++) {
    mineField[i] = [];
    for (let j = 0; j < cols; j++) {
      mineField[i][j] = 0;
    }
  }
  while (mines > 0) {
    const row = Math.floor(Math.random() * rows);
    const col = Math.floor(Math.random() * cols);
    if (mineField[row][col] === 0) {
      mineField[row][col] = 1;
      mines--;
    }
  }

  for (let k = 0; k < mineField.length; k++) {
    const tr = document.createElement("tr");
    for (let l = 0; l < mineField[k].length; l++) {
      const td = document.createElement("td");
      td.style.border = "1px solid black";
      td.style.width = "25px";
      td.style.height = "25px";
      td.setAttribute("data-row", k);
      td.setAttribute("data-col", l);
      td.addEventListener("click", function (event) {
        handleClick(event);
      });
      td.addEventListener("contextmenu", handleRightClick);
      tr.appendChild(td);
    }
    document.querySelector("#board").appendChild(tr);
  }

  setInterval(function () {
    if (!gameOver) {
      timer++;
      document.querySelector("#timer").innerHTML = timer;
    }
  }, 1000);
}