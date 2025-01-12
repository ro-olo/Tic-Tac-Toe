document.addEventListener("DOMContentLoaded", () => {

    //get di tutti gli elements
    const startScreen = document.getElementById("startScreen");
    const iconScreen = document.getElementById("iconScreen");
    //const gifContainer = document.getElementById("gifContainer");

    const boardContainer = document.getElementById("boardContainer");
    const gameMessage = document.getElementById("gameMessage");

    const vsPlayerButton = document.getElementById("vsPlayer");
    const vsCPUButton = document.getElementById("vsCPU");
    const iconsBtn = document.querySelectorAll(".iconBtn");

    let selectedGameMode = "";
    let selectedIcon = "";

    //Nascondere tutto tranne la schermata iniziale

    iconScreen.style.display = "none";
    //gifContainer.style.display = "none";
    boardContainer.style.display = "none";
    gameMessage.style.display = "none";

    //eventListener per il vs

    vsPlayerButton.addEventListener("click", () => {
        selectedGameMode = "Player vs Player";
        console.log(`Selected Game Mode: ${selectedGameMode}`);
        startScreen.style.display = "none";
        iconScreen.style.display = "block";
    })

    vsCPUButton.addEventListener("click", () => {
        selectedGameMode = "Player vs CPU";
        console.log(`Selected Game Mode: ${selectedGameMode}`);
        startScreen.style.display = "none";
        iconScreen.style.display = "flex";
    })

    iconsBtn.forEach((button) => {
        button.addEventListener("click", (e) => {
            const clickedIcon = e.target.closest("button");
            selectedIcon = clickedIcon.id;
            iconScreen.style.display = "none";
            boardContainer.style.display = "grid";
            gameMessage.style.display = "flex";
        })
    })
})