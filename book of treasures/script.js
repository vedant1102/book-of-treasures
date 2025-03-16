let playerName;
let currentScore = 0;
let timer;
let timeRemaining = 180; // 3 minutes
let currentWord = "";
let usedWords = [];
let puzzlePieces = 0;
let requiredScore = 23; // Score required to complete a level
let currentLevel = 1;
let highScores = [];

// Dictionary API for word validation
async function validateWord(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    return response.ok;
}

// Initialize the game
function startGame() {
    playerName = prompt("Enter your name:");
    if (playerName) {
        document.getElementById("playerName").innerText = `Welcome, ${playerName}`;
        resetGame();
        showPage("game");
        startTimer();
        setupGrid();
        generateLetters();
    }
}

function resetGame() {
    currentScore = 0;
    timeRemaining = 180;
    currentWord = "";
    usedWords = [];
    updateScore();
    updatePuzzlePieceCounter();
    updateLevelCounter();
    updateRequiredScore();
    clearInterval(timer);
}

function startTimer() {
    timer = setInterval(() => {
        timeRemaining--;
        updateTimerDisplay();
        if (timeRemaining <= 0) {
            clearInterval(timer);
            gameOver();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    document.getElementById("timeRemaining").innerText = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

function showPage(pageId) {
    document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
    document.getElementById(pageId).classList.add("active");
}

function setupGrid() {
    const gameGrid = document.getElementById("gameGrid");
    gameGrid.innerHTML = "";

    // Grid structure: 3 three-letter, 2 four-letter, 1 five-letter, 1 six-letter
    const wordLengths = [3, 3, 3, 4, 4, 5, 6];
    wordLengths.forEach(length => {
        const row = document.createElement("div");
        row.classList.add("grid-row");
        for (let i = 0; i < length; i++) {
            const cell = document.createElement("div");
            cell.classList.add("letter-box");
            cell.innerText = "";
            row.appendChild(cell);
        }
        gameGrid.appendChild(row);
    });
}

function generateLetters() {
    const lettersContainer = document.getElementById("lettersContainer");
    lettersContainer.innerHTML = "";
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    for (let i = 0; i < 12; i++) {
        const letter = document.createElement("div");
        letter.classList.add("letter");
        letter.innerText = letters.charAt(Math.floor(Math.random() * letters.length));
        letter.addEventListener("click", () => selectLetter(letter));
        lettersContainer.appendChild(letter);
    }
}

function selectLetter(letterElement) {
    if (!letterElement.classList.contains("selected-box")) {
        currentWord += letterElement.innerText;
        letterElement.classList.add("selected-box");
        updateSelectedWordDisplay();
    }
}

function updateSelectedWordDisplay() {
    document.getElementById("selectedWord").innerText = currentWord;
}

async function submitWord() {
    if (currentWord.length > 0 && !usedWords.includes(currentWord)) {
        const isValid = await validateWord(currentWord);
        if (isValid) {
            usedWords.push(currentWord);
            currentScore += currentWord.length;
            updateScore();
            displayWordOnGrid(currentWord);
            clearWord();
            checkLevelCompletion();
        } else {
            alert("Invalid word! Please try again.");
            clearWord();
        }
    }
}

function displayWordOnGrid(word) {
    const gameGrid = document.getElementById("gameGrid");
    const emptyCells = gameGrid.querySelectorAll(".letter-box:empty");
    if (emptyCells.length >= word.length) {
        for (let i = 0; i < word.length; i++) {
            emptyCells[i].innerText = word[i];
        }
    }
}

function clearWord() {
    currentWord = "";
    document.querySelectorAll(".selected-box").forEach(el => el.classList.remove("selected-box"));
    updateSelectedWordDisplay();
}

function shuffleLetters() {
    generateLetters();
}

function updateScore() {
    document.getElementById("currentScore").innerText = currentScore;
}

function updatePuzzlePieceCounter() {
    document.getElementById("puzzlePiecesCollected").innerText = puzzlePieces;
}

function updateLevelCounter() {
    document.getElementById("currentLevel").innerText = currentLevel;
}

function updateRequiredScore() {
    document.getElementById("requiredScoreValue").innerText = requiredScore;
}

function checkLevelCompletion() {
    if (currentScore >= requiredScore) {
        puzzlePieces++;
        updatePuzzlePieceCounter();
        document.getElementById("puzzlePiecesCollectedDisplay").innerText = puzzlePieces;
        showPage("levelComplete");
    }
}

function finishLevel() {
    if (currentScore >= requiredScore) {
        checkLevelCompletion();
    } else {
        alert("You need to reach the required score to finish the level!");
    }
}

function gameOver() {
    showPage("gameOver");
    document.getElementById("finalScore").innerText = currentScore;
    saveHighScore();
}

function startNextLevel() {
    currentLevel++;
    requiredScore += 10; // Increase required score for the next level
    resetGame();
    showPage("game");
    startTimer();
    setupGrid();
    generateLetters();
}

function restartGame() {
    resetGame();
    showPage("home");
}

function saveHighScore() {
    highScores.push({ name: playerName, score: currentScore });
    highScores.sort((a, b) => b.score - a.score);
    updateHighScores();
}

function updateHighScores() {
    const highScoresList = document.getElementById("highScoresList");
    highScoresList.innerHTML = "";
    highScores.forEach(entry => {
        const li = document.createElement("li");
        li.textContent = `${entry.name}: ${entry.score}`;
        highScoresList.appendChild(li);
    });
}

function viewHighScores() {
    updateHighScores();
    showPage("highScores");
}