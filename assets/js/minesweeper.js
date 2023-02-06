const mineField = [];
let mineCount = 0;
let flaggedCount = 0;

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
}

window.addEventListener("load", function() {
    const table = document.querySelector("#board");
    if (!table) {
      return;
    }
    const restartButton = document.querySelector("#restart");
    if (!restartButton) {
      return;
    }
    const timerDisplay = document.querySelector("#timer");
    if (!timerDisplay) {
      return;
    }
      
    let timer = 0;
    let gameOver = false;
    let flaggedCount = 0;
        
  for (let i = 0; i < mineField.length; i++) {
    for (let j = 0; j < mineField[i].length; j++) {
      if (mineField[i][j] === 1) {
        mineCount++;
      }
    }
  }    
  
  for (let row = 0; row < mineField.length; row++) {
    const tr = document.createElement("tr");
    for (let col = 0; col < mineField[row].length; col++) {
      const td = document.createElement("td");
      td.style.border = "1px solid black";
      td.style.width = "25px";
      td.style.height = "25px";
      td.setAttribute("data-row", row);
      td.setAttribute("data-col", col);
      td.addEventListener("click", handleClick);
      td.addEventListener("contextmenu", handleRightClick);
      tr.appendChild(td);
    }
    table.appendChild(tr);
  }
  
  restartButton.addEventListener("click", function() {
    location.reload();
  });
  
  setInterval(function() {
    if (!gameOver) {
      timer++;
      timerDisplay.innerHTML = timer;
    }
  }, 1000);
  
  function handleClick() {
    if (gameOver || this.classList.contains("flagged")) {
      return;
    }
    const row = parseInt(this.getAttribute("data-row"));
    const col = parseInt(this.getAttribute("data-col"));
    if (mineField[row][col] === 1) {
      gameOver = true;
      this.innerHTML = "X";    
      this.classList.add("mined");
      showAllMines();
      alert("Game Over!");
    } else {
      let mines = 0;
      for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
          if (
            row + i >= 0 &&
            row + i < mineField.length &&
            col + j >= 0 &&
            col + j < mineField[row].length
          ) {
            if (mineField[row + i][col + j] === 1) {
              mines++;
            }
          }
        }
      }
      this.innerHTML = mines === 0 ? "" : mines;
      this.style.backgroundColor = "lightgrey";
      this.style.pointerEvents = "none";
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
        cell.classList.add("mined");
      }
    }
  }
});