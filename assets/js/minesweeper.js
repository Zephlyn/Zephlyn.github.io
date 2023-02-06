const mineField = [
    [0, 0, 0, 0, 1],
    [0, 1, 0, 0, 0],
    [0, 0, 1, 0, 0],
    [0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0]
  ];
  
  const table = document.querySelector("#board");
  const restartButton = document.querySelector("#restart");
  const timerDisplay = document.querySelector("#timer");
  let timer = 0;
  let gameOver = false;
  let flaggedCount = 0;
  let mineCount = 0;
  
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
      flaggedCount++;
      if (mineField[parseInt(this.getAttribute("data-row"))][parseInt(this.getAttribute("data-col"))] === 1) {
        mineCount--;
      }
    } else {
      this.classList.remove("flagged");
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