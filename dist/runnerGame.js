import { PlayerStateEnum } from './models/gameModels.js';
import { PlayerObjectStateMachineService } from './services/playerObjectStateMachineService.js';
const gameContainer = document.getElementById("gameContainer");
const videoContainer = document.getElementById("videoContainer");
const startButton = document.getElementById("startBtn");
const endButton = document.getElementById("endBtn");
const toggleContentButton = document.getElementById("contentToggleBtn");
const gameTrack = document.getElementById("gameTrack");
const gameInformation = document.getElementById("gameInformation");
gameInformation.textContent = "Welcome to the game! Press F to jump!";
const GAME_TRACK_WIDTH = 1200;
const GAME_TRACK_HEIGHT = 200;
const GROUND_HEIGHT = 125;
const TIME_TO_APEX = 0.40;
const secondsPerFrame = 1 / 60;
const verticalAcceleration = 2 * (GROUND_HEIGHT + 170) / TIME_TO_APEX ^ 2;
const gameTrackContext = gameTrack.getContext("2d");
const playerObjectStateMachineService = new PlayerObjectStateMachineService();
let shouldEndGame = false;
let gameFrame = 0;
let verticalVelocity = 0;
let cactusList = [];
let playerObject = createPlayerObject();
endButton.disabled = true;
videoContainer.classList.add('hidden-div');
toggleContentButton?.addEventListener('click', () => {
    videoContainer.classList.remove('hidden-div');
    gameContainer.classList.add('hidden-div');
});
startButton?.addEventListener('click', () => {
    if (shouldEndGame) {
        shouldEndGame = false;
    }
    gameFrame = 0;
    startButton.disabled = true;
    endButton.disabled = false;
    gameInformation.textContent = "";
    window.requestAnimationFrame(runnerGameLoop);
});
endButton?.addEventListener('click', () => {
    shouldEndGame = true;
});
document.addEventListener('keydown', (event) => {
    if (event.key === 'f') {
        const didStateChange = playerObjectStateMachineService.tryPerformStateChange(playerObject, PlayerStateEnum.Jumping);
        if (didStateChange) {
            verticalVelocity = -(verticalAcceleration) * TIME_TO_APEX;
        }
    }
});
function runnerGameLoop() {
    gameFrame++;
    // Game frame rate is 60fps
    let elapsedGameTimeInSeconds = gameFrame / 60;
    if (elapsedGameTimeInSeconds % 3 === 0) {
        generateObject();
    }
    if (playerObject.playerState === PlayerStateEnum.Jumping) {
        executeJump();
    }
    updateGameObjects();
    drawGameFrame();
    computeCollisions();
    if (!shouldEndGame && !(playerObject.playerState === PlayerStateEnum.Collision)) {
        window.requestAnimationFrame(runnerGameLoop);
    }
    else {
        tearDownGame();
    }
}
function computeCollisions() {
    if (cactusList.length === 0) {
        return;
    }
    let closestObject = cactusList.reduce((prev, current) => {
        return prev.xPos < current.xPos ? prev : current;
    });
    let closestObjectBox = {
        xBoundaries: [closestObject.xPos, closestObject.xPos + 25],
        yBoundaries: [closestObject.yPos, closestObject.yPos + 25]
    };
    let playerBox = {
        xBoundaries: [playerObject.xPos, playerObject.xPos + 25],
        yBoundaries: [playerObject.yPos, playerObject.yPos + 25]
    };
    if (Math.max(closestObjectBox.xBoundaries[0], playerBox.xBoundaries[0])
        <= Math.min(closestObjectBox.xBoundaries[1], playerBox.xBoundaries[1])) {
        if (Math.max(closestObjectBox.yBoundaries[0], playerBox.yBoundaries[0])
            <= Math.min(closestObjectBox.yBoundaries[1], playerBox.yBoundaries[1])) {
            playerObjectStateMachineService.tryPerformStateChange(playerObject, PlayerStateEnum.Collision);
        }
    }
}
function generateObject() {
    createObject();
}
function executeJump() {
    verticalVelocity += verticalAcceleration * secondsPerFrame;
    playerObject.yPos += verticalVelocity * secondsPerFrame;
    if (playerObject.yPos >= GROUND_HEIGHT) {
        playerObject.yPos = GROUND_HEIGHT;
        playerObjectStateMachineService.tryPerformStateChange(playerObject, PlayerStateEnum.Idle);
    }
}
function createObject() {
    const object = document.createElement("img");
    object.src = "src/assets/cactus.png";
    cactusList.push({
        htmlElement: object,
        xPos: GAME_TRACK_WIDTH - 200,
        yPos: GROUND_HEIGHT
    });
}
function createPlayerObject() {
    const object = document.createElement("img");
    object.src = "src/assets/dino.png";
    return {
        htmlElement: object,
        xPos: 100,
        yPos: GROUND_HEIGHT,
        playerState: PlayerStateEnum.Idle
    };
}
function updateGameObjects() {
    cactusList.forEach(object => {
        object.xPos -= 10;
    });
}
function drawGameFrame() {
    gameTrackContext.clearRect(0, 0, GAME_TRACK_WIDTH, GAME_TRACK_HEIGHT);
    gameTrackContext.drawImage(playerObject.htmlElement, playerObject.xPos, playerObject.yPos);
    cactusList = cactusList.filter(cactus => cactus.xPos > 0);
    cactusList.forEach(object => {
        gameTrackContext.drawImage(object.htmlElement, object.xPos, object.yPos);
    });
}
function tearDownGame() {
    // Clear game objects
    gameTrackContext.clearRect(0, 0, GAME_TRACK_WIDTH, GAME_TRACK_HEIGHT);
    cactusList = [];
    // Update button states
    startButton.disabled = false;
    endButton.disabled = true;
    // Reset game frames
    gameFrame = 0;
    // Show ending text;
    gameInformation.textContent = "RIP! You have been hit.";
}
//# sourceMappingURL=runnerGame.js.map