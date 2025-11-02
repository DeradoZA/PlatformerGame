import { GAME_TRACK_HEIGHT, GAME_TRACK_WIDTH, GROUND_HEIGHT, secondsPerFrame, TIME_TO_APEX, verticalAcceleration } from './constants/gameConstants.js';
import { GameStateEnum, PlayerStateEnum, type JumpingGameObject, type NpcObject, type ObjectBox, type PlayerObject } from './models/gameModels.js';
import { GameStateMachineService } from './services/gameStateMachineService.js';
import { PlayerObjectStateMachineService } from './services/playerObjectStateMachineService.js';

// HTML Elements
const gameContainer = <HTMLDivElement>document.getElementById("gameContainer");
const videoContainer = <HTMLDivElement>document.getElementById("videoContainer");
const startButton = <HTMLButtonElement>document.getElementById("startBtn");
const endButton = <HTMLButtonElement>document.getElementById("endBtn");
const toggleContentButton = <HTMLButtonElement>document.getElementById("contentToggleBtn");
const gameTrack = <HTMLCanvasElement>document.getElementById("gameTrack");
const gameInformation = <HTMLElement>document.getElementById("gameInformation");

// Game Constants
const gameTrackContext = gameTrack!.getContext("2d")
const playerObjectStateMachineService = new PlayerObjectStateMachineService();
const jumpingGameObjectStateMachineService = new GameStateMachineService();

// Mutable Game Variables
let gameFrame = 0;
let verticalVelocity = 0;
let npcObjectList : NpcObject[] = [];
let playerObject : PlayerObject = createPlayerObject();
let jumpingGameObject : JumpingGameObject = createNewJumpingGameObject();

// Initial Game Setup
gameInformation.textContent = "Welcome to the game! Press F to jump!";
endButton.disabled = true;
videoContainer.classList.add('hidden-div');

startButton?.addEventListener('click', () => {
    jumpingGameObjectStateMachineService.tryPerformStateChange(jumpingGameObject, GameStateEnum.InGame);

    performGameStateChangeActions(jumpingGameObject.state);
})

endButton?.addEventListener('click', () => {
    jumpingGameObjectStateMachineService.tryPerformStateChange(jumpingGameObject, GameStateEnum.GameEndedByPlayer);

    performGameStateChangeActions(jumpingGameObject.state);
})

document.addEventListener('keydown', (event) => {

    if (event.key === 'f')
    {
        const didStateChange = playerObjectStateMachineService.tryPerformStateChange(playerObject, PlayerStateEnum.Jumping);

        if (didStateChange)
        {
            verticalVelocity = -(verticalAcceleration) * TIME_TO_APEX;
        }
    }
});

function runnerGameLoop() {
    if (jumpingGameObject.state === GameStateEnum.InGame)
    {
        gameFrame++;

        // Game frame rate is 60fps
        let elapsedGameTimeInSeconds = gameFrame / 60;

        if (elapsedGameTimeInSeconds % 3 === 0)
        {
            generateObject();
        }

        if (playerObject.state === PlayerStateEnum.Jumping)
        {
            executeJump();
        }

        if (elapsedGameTimeInSeconds % 20 === 0)
        {
            createWinningObject();
        }

        updateGameObjects();
        drawGameFrame();
        computeCollisions();

        window.requestAnimationFrame(runnerGameLoop);
    }
}

function computeCollisions() {

    if (npcObjectList.length === 0)
    {
        return;
    }

    let closestObject = npcObjectList.reduce((prev, current) => {
        return prev.xPos < current.xPos ? prev : current
    })


    let closestObjectBox : ObjectBox = {
        xBoundaries: [closestObject.xPos, closestObject.xPos + 25],
        yBoundaries: [closestObject.yPos, closestObject.yPos + 25]
    }

    let playerBox : ObjectBox = {
        xBoundaries: [playerObject.xPos, playerObject.xPos + 25],
        yBoundaries: [playerObject.yPos, playerObject.yPos + 25]
    }

    if (Math.max(closestObjectBox.xBoundaries[0], playerBox.xBoundaries[0])
        <= Math.min(closestObjectBox.xBoundaries[1], playerBox.xBoundaries[1]))
    {
        if (Math.max(closestObjectBox.yBoundaries[0], playerBox.yBoundaries[0])
            <= Math.min(closestObjectBox.yBoundaries[1], playerBox.yBoundaries[1]))
        {
            handleObjectCollision(closestObject);
        }
    }
}

function handleObjectCollision(closestObject: NpcObject) {
    playerObjectStateMachineService.tryPerformStateChange(playerObject, PlayerStateEnum.Collision);

    if (closestObject.isWinningObject)
    {
        jumpingGameObjectStateMachineService.tryPerformStateChange(jumpingGameObject, GameStateEnum.CompletedGame);
    }
    else
    {
        jumpingGameObjectStateMachineService.tryPerformStateChange(jumpingGameObject, GameStateEnum.FailedGame);
    }

    performGameStateChangeActions(jumpingGameObject.state);
}

function generateObject() {
    createObject();
}

function executeJump() {

    verticalVelocity += verticalAcceleration * secondsPerFrame;
    playerObject.yPos += verticalVelocity * secondsPerFrame;

    if (playerObject.yPos >= GROUND_HEIGHT)
    {
        playerObject.yPos = GROUND_HEIGHT;
        playerObjectStateMachineService.tryPerformStateChange(playerObject, PlayerStateEnum.Idle)
    }
}

function createObject() {
    const object = document.createElement("img");
    object.src = "src/assets/cactus.png";

    npcObjectList.push(
        {
            htmlElement: object,
            xPos: GAME_TRACK_WIDTH - 200,
            yPos: GROUND_HEIGHT,
            isWinningObject: false
        }
    )
}

function createPlayerObject() : PlayerObject {
    const object = document.createElement("img");
    object.src = "src/assets/dino.png";

    return {
        htmlElement: object,
        xPos: 100,
        yPos: GROUND_HEIGHT,
        state: PlayerStateEnum.Idle
    }
}

function createWinningObject()  {
    const object = document.createElement("img");
    object.src = "src/assets/panda-bear.png";

    const winningNpcObject = {
        htmlElement: object,
        xPos: GAME_TRACK_WIDTH - 200,
        yPos: GROUND_HEIGHT,
        isWinningObject: true
    }

    npcObjectList.push(winningNpcObject);
}

function createNewJumpingGameObject() : JumpingGameObject {

    return {
        gameDuration: 0,
        state: GameStateEnum.BeginningScreen
    }
}

function updateGameObjects() {
    npcObjectList.forEach(object => {
        object.xPos -= 10;
    })
}

function drawGameFrame() {
    gameTrackContext.clearRect(0, 0, GAME_TRACK_WIDTH, GAME_TRACK_HEIGHT);

    gameTrackContext.drawImage(<CanvasImageSource>playerObject.htmlElement, playerObject.xPos, playerObject.yPos)

    npcObjectList = npcObjectList.filter(npcObject => npcObject.xPos > 0);

    npcObjectList.forEach(object => {
        gameTrackContext.drawImage(<CanvasImageSource>object.htmlElement, object.xPos, object.yPos)
    })
}

function performGameStateChangeActions(newGameState: GameStateEnum) {
    switch (newGameState)
    {
        case GameStateEnum.FailedGame:
        {
            // Show ending text;
            gameInformation.textContent = "RIP! You have been hit."

            npcObjectList = [];

            // Update button states
            startButton.disabled = false;
            endButton.disabled = true;

            // Reset game frame counter
            gameFrame = 0;

            break;
        }
        case GameStateEnum.GameEndedByPlayer:
        {
            // Show ending text;
            gameInformation.textContent = "Why end it all yourself?"

            npcObjectList = [];

            // Update button states
            startButton.disabled = false;
            endButton.disabled = true;

            // Reset game frame counter
            gameFrame = 0;

            break;
        }
        case GameStateEnum.InGame:
        {
            jumpingGameObject.gameDuration = 0;

            gameFrame = 0;

            startButton.disabled = true;
            endButton.disabled = false;

            gameInformation.textContent = "";

            window.requestAnimationFrame(runnerGameLoop);

            break;
        }
        case GameStateEnum.CompletedGame: {
            // Show next screen
            videoContainer.classList.remove('hidden-div');

            gameContainer.classList.add('hidden-div');

            break;
        }
        default: {
            // Do nothing
            break;
        }
    }
}
