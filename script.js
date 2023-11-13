document.addEventListener('DOMContentLoaded', function () {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('resetButton');
    const singlePlayerBtn = document.getElementById('singlePlayerBtn');
    const multiPlayerBtn = document.getElementById('multiPlayerBtn');

    let currentPlayer = 'X';
    let gameBoard = ['', '', '', '', '', '', '', '', ''];
    let gameActive = false;
    let isSinglePlayer = false;

    function renderBoard() {
        board.innerHTML = '';
        gameBoard.forEach((cell, index) => {
            const cellElement = document.createElement('div');
            cellElement.classList.add('cell');
            if (cell) {
                cellElement.classList.add(cell);
            }
            cellElement.textContent = cell;
            cellElement.addEventListener('click', () => handleCellClick(index));
            board.appendChild(cellElement);
        });
    }
    

    function handleCellClick(index) {
        if (!gameActive || gameBoard[index] !== '' || (isSinglePlayer && currentPlayer === 'O')) return;

        gameBoard[index] = currentPlayer;
        renderBoard();
        if (checkWinner()) {
            status.textContent = `${currentPlayer} wins!`;
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== '')) {
            status.textContent = 'It\'s a tie!';
            gameActive = false;
        } else {
            currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
            status.textContent = isSinglePlayer ? (currentPlayer === 'X' ? 'Your turn' : 'AI\'s turn') : `Current player: ${currentPlayer}`;

            if (isSinglePlayer && currentPlayer === 'O') {
                setTimeout(() => makeAIMove(), 500); // Introduce a delay for better user experience
            }
        }
    }

    function makeAIMove() {
        const emptyCells = gameBoard.reduce((acc, cell, index) => (cell === '' ? [...acc, index] : acc), []);
        const randomIndex = Math.floor(Math.random() * emptyCells.length);
        const aiMove = emptyCells[randomIndex];
        gameBoard[aiMove] = 'O';
        renderBoard();

        if (checkWinner()) {
            status.textContent = 'AI wins!';
            gameActive = false;
        } else if (gameBoard.every(cell => cell !== '')) {
            status.textContent = 'It\'s a tie!';
            gameActive = false;
        } else {
            currentPlayer = 'X';
            status.textContent = 'Your turn';
        }
    }

    function checkWinner() {
        const winPatterns = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
        ];

        return winPatterns.some(pattern => {
            const [a, b, c] = pattern;
            return gameBoard[a] !== '' && gameBoard[a] === gameBoard[b] && gameBoard[a] === gameBoard[c];
        });
    }

    function resetGame() {
        currentPlayer = 'X';
        gameBoard = ['', '', '', '', '', '', '', '', ''];
        gameActive = false;
        status.textContent = 'Choose a mode to start';
        renderBoard();
    }

    resetButton.addEventListener('click', resetGame);
    singlePlayerBtn.addEventListener('click', () => startGame(true));
    multiPlayerBtn.addEventListener('click', () => startGame(false));

    function startGame(isSingle) {
        isSinglePlayer = isSingle;
        resetGame();
        gameActive = true;
        status.textContent = isSinglePlayer ? 'Your turn' : `Current player: ${currentPlayer}`;
    }

    // Initial board rendering
    renderBoard();
});
