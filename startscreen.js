document.addEventListener("DOMContentLoaded", () => {

    const game = {
        mode: null,
        player1: { name: null, token: null },
        player2: { name: null, token: null },
        board: Gameboard(), 
        isGameOver: () => false,
        playRound: (row, col) => {
            console.log(`Mossa giocata: riga ${row}, colonna ${col}`);
        },
        updateActivePlayerMessage: () => {
            console.log("Aggiorno messaggio giocatore attivo.");
        },
        getActivePlayer: () => (this.mode === "Player vs Player" ? this.player1 : this.player1), // Modifica per il giocatore attivo
    };

    //get di tutti gli elements
    const startScreen = document.getElementById("startScreen");
    const iconScreen = document.getElementById("iconScreen");
    const boardContainer = document.getElementById("boardContainer");
    const gameMessage = document.getElementById("gameMessage");

    const vsPlayerButton = document.getElementById("vsPlayer");
    const vsCPUButton = document.getElementById("vsCPU");
    const iconsBtn = document.querySelectorAll(".iconBtn");

    let selectedGameMode = null;
    let selectedIcon = null;
    let cpuTurn = null; // Variabile per la modalità di gioco

    function showScreen(screen) {
        const screens = [startScreen, iconScreen, boardContainer];
        screens.forEach(s => s.style.display = "none");
        
        if (screen === boardContainer) {
            screen.style.display = "grid"; 
            gameMessage.style.display = "flex";
        } else {
            screen.style.display = "flex"; 
            gameMessage.style.display = "none";
        }
    }

    showScreen(startScreen);

    //eventListener per il vs

    vsPlayerButton.addEventListener("click", () => {
        selectedGameMode = "Player vs Player";
        console.log(`Selected Game Mode: ${selectedGameMode}`);
        setupPlayerVsPlayer();
        showScreen(iconScreen);
    });

    vsCPUButton.addEventListener("click", () => {
        selectedGameMode = "Player vs CPU";
        console.log(`Selected Game Mode: ${selectedGameMode}`);
        setupPlayervsCPU();
        showScreen(iconScreen);
    });

    let currentPlayerSelecting = 1;

    iconsBtn.forEach((button) => {
        button.addEventListener("click", (e) => {
            e.stopPropagation();
            e.preventDefault();
            
            const clickedIcon = e.target.closest("button").querySelector("img");
            const selectedIcon = clickedIcon.getAttribute("data-icon");
            console.log(`Selected Icon: ${selectedIcon}`);
            console.log(`Player : ${currentPlayerSelecting}`)
            if (!selectedIcon) {
                console.log("No icon selected!");
                return; // Previene l'ulteriore esecuzione del codice se nessuna icona è selezionata
            }

            if (currentPlayerSelecting === 1) {
                button.disabled = true;
                game.player1.token = `img/${selectedIcon}`; // Assegna l'icona a Player 1
                console.log(`Player 1 selected icon: ${selectedIcon}`);
                currentPlayerSelecting = 2; // Passa al giocatore 2
                document.getElementById("iconScreen").querySelector("h2").textContent =
                    "Player 2 selection";
            } else if (currentPlayerSelecting === 2) {
                button.disabled = true;
                game.player2.token = `img/${selectedIcon}`; // Assegna l'icona a Player 2
                console.log(`Player 2 selected icon: ${selectedIcon}`);
                showScreen(boardContainer);
                initializeGame();
            } else {
                console.log("No icon selected for Player 2!");
            } 
            
        });
    });

    function setupPlayerVsPlayer() {
        game.mode = "Player vs Player";
        game.player1 = {name: "Player 1", token: "" };
        game.player2 = {name: "Player 2", token: "" };
    }

    function setupPlayervsCPU() {
        game.mode = "Player vs CPU";
        game.player1 = {name: "Player", token: null };
        game.player2 = {name: "CPU", token: "./img/poop.png" };

        cpuTurn = () => {
            console.log("CPU turn started");

            const board = game.board.getBoard();
            console.log("Current Board State:", board);

            const emptyCells = [];
            for (let row = 0; row < board.length; row++) {
                for (let col = 0; col < board[row].length; col++) {
                    if (board[row][col].getValue() === 0) {
                        emptyCells.push({ row, col });
                    }
                }
            }

            if (emptyCells.length > 0) {
                const randomIndex = Math.floor(Math.random() * emptyCells.length);
                const { row, col } = emptyCells[randomIndex];
                console.log(`CPU placing token at row: ${row}, column: ${col}`);

                const cells = document.querySelectorAll(".cell");
                const cellIndex = row * 3 + col;
                const selectedCell = cells[cellIndex];

                // Aggiorna la UI
                const img = document.createElement("img");
                img.src = game.player2.token; // Icona del CPU
                img.alt = "CPU Move";
                selectedCell.appendChild(img);

                // Aggiorna lo stato del gioco
                game.playRound(row, col);
            } else {
                console.log("No empty cells available for CPU.");
            }
        }

        cpuTurn();
    }

    function initializeGame() {
        console.log("Inizializzazione del gioco...");
        console.log("GAME INITIALIZER")
        console.log("Player 1" + game.player1.token  + game.player1.token)
        
        console.log("Player 2" + game.player2.token  + game.player2.token)
        // Logica per iniziare una nuova partita (crea il tabellone, azzera lo stato, ecc.)
    }

});