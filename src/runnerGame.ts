import { GAME_TRACK_HEIGHT, GAME_TRACK_WIDTH, GROUND_HEIGHT, secondsPerFrame, TIME_TO_APEX, verticalAcceleration } from './constants/gameConstants.js';
import { GameStateEnum, PlayerStateEnum, type JumpingGameObject, type NpcObject, type ObjectBox, type PlayerObject } from './models/gameModels.js';
import { GameStateMachineService } from './services/gameStateMachineService.js';
import { PlayerObjectStateMachineService } from './services/playerObjectStateMachineService.js';

// HTML Elements
const gameContainer = <HTMLDivElement>document.getElementById("gameContainer");
const gameScreen = <HTMLDivElement>document.getElementById("gameScreen");
const btnGroup = <HTMLDivElement>document.getElementById("btnGroup");
const videoContainer = <HTMLDivElement>document.getElementById("videoContainer");
const startButton = <HTMLButtonElement>document.getElementById("startBtn");
const endButton = <HTMLButtonElement>document.getElementById("endBtn");
const restartBtn = <HTMLButtonElement>document.getElementById("restartBtn");
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

showTextSequence(
    [
        "Heyyyy Cuki! I've set up a small, frog walk inspired game for you.",
        "All you have to do is press space bar to jump, your obstacles would be frogs.",
        "Run into me and Ballie for a little extra surprise ❤️"
    ]
)

restartBtn.classList.add('hidden');
endButton.classList.add('hidden');
endButton.disabled = true;


videoContainer.classList.add('hidden');

startButton?.addEventListener('click', () => {
    jumpingGameObjectStateMachineService.tryPerformStateChange(jumpingGameObject, GameStateEnum.InGame);

    playerObjectStateMachineService.tryPerformStateChange(playerObject, PlayerStateEnum.Idle);

    performGameStateChangeActions(jumpingGameObject.state);
})

restartBtn?.addEventListener('click', () => {
    jumpingGameObjectStateMachineService.tryPerformStateChange(jumpingGameObject, GameStateEnum.InGame);

    playerObjectStateMachineService.tryPerformStateChange(playerObject, PlayerStateEnum.Idle);

    performGameStateChangeActions(jumpingGameObject.state);
})

endButton?.addEventListener('click', () => {
    jumpingGameObjectStateMachineService.tryPerformStateChange(jumpingGameObject, GameStateEnum.GameEndedByPlayer);

    performGameStateChangeActions(jumpingGameObject.state);
})

document.addEventListener('keydown', (event) => {

    if (event.key === " ")
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

function imgSize(img: HTMLImageElement, fallback = { w: 25, h: 45 }) {
  // Try natural size first (if image loaded), then element width/height, then fallback
  const w = img.naturalWidth || img.width || fallback.w;
  const h = img.naturalHeight || img.height || fallback.h;
  return { w, h };
}

function computeCollisions() {
  if (npcObjectList.length === 0) return;

  // ---- FORCED HITBOX SIZES FOR EVERYTHING ----
  const PLAYER_HITBOX = { w: 50, h: 50 };
  const NPC_HITBOX = { w: 100, h: 150 };
  const WIN_HITBOX = { w: 100, h: 150 }; // (same size, but separate if you ever want to change)

  // Player forced box
  const playerBox: ObjectBox = {
    xBoundaries: [playerObject.xPos, playerObject.xPos + PLAYER_HITBOX.w],
    yBoundaries: [playerObject.yPos, playerObject.yPos + PLAYER_HITBOX.h]
  };

  for (const npc of npcObjectList) {

    const hitbox = npc.isWinningObject ? WIN_HITBOX : NPC_HITBOX;

    const npcBox: ObjectBox = {
      xBoundaries: [npc.xPos, npc.xPos + hitbox.w],
      yBoundaries: [npc.yPos, npc.yPos + hitbox.h]
    };

    // Skip if behind player
    if (npc.xPos + hitbox.w < playerObject.xPos) continue;

    const overlapX =
      Math.max(playerBox.xBoundaries[0], npcBox.xBoundaries[0]) <=
      Math.min(playerBox.xBoundaries[1], npcBox.xBoundaries[1]);

    const overlapY =
      Math.max(playerBox.yBoundaries[0], npcBox.yBoundaries[0]) <=
      Math.min(playerBox.yBoundaries[1], npcBox.yBoundaries[1]);

    if (overlapX && overlapY) {
      handleObjectCollision(npc);
      break;
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

    if (playerObject.yPos >= GROUND_HEIGHT - 105)
    {
        playerObject.yPos = GROUND_HEIGHT - 105;
        playerObjectStateMachineService.tryPerformStateChange(playerObject, PlayerStateEnum.Idle);
    }
}

function createObject() {
    const object = document.createElement("img");
    object.src = "src/assets/angryfrog.png";

    npcObjectList.push(
        {
            htmlElement: object,
            xPos: GAME_TRACK_WIDTH - 200,
            yPos: GROUND_HEIGHT - 105,
            isWinningObject: false
        }
    )
}

function createPlayerObject() : PlayerObject {
    const object = document.createElement("img");
    object.src = "src/assets/Milla.png";

    return {
        htmlElement: object,
        xPos: 100,
        yPos: GROUND_HEIGHT - 105,
        state: PlayerStateEnum.Idle
    }
}

function createWinningObject()  {
    const object = document.createElement("img");
    object.src = "src/assets/DanBallie.png";

    const winningNpcObject = {
        htmlElement: object,
        xPos: GAME_TRACK_WIDTH - 200,
        yPos: GROUND_HEIGHT - 155,
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
        object.xPos -= 6;
    })
}

async function fadeText() : Promise<void> {
    gameInformation.classList.remove("fade-text");

    void gameInformation.offsetWidth;

    gameInformation.classList.add("fade-text");

    return await new Promise(res => setTimeout(res, 4000))
}

async function showTextSequence(textSequence: string[])
{
    for (const text of textSequence)
    {
        gameInformation.textContent = text;

        await fadeText();
    }
}

function drawGameFrame() {
    gameTrackContext.clearRect(0, 0, GAME_TRACK_WIDTH, GAME_TRACK_HEIGHT);

    gameTrackContext.beginPath();

    gameTrackContext.moveTo(0, GROUND_HEIGHT + 45);

    gameTrackContext.lineTo(GAME_TRACK_WIDTH - 500, GROUND_HEIGHT + 45);

    gameTrackContext.lineWidth = 2;

    gameTrackContext.stroke();

    //Test

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
            showTextSequence(["The frog probably does pass the vibe check, \n press Restart Game to run more vibe checks"]);

            npcObjectList = [];

            // Update button states
            startButton.disabled = false;
            endButton.disabled = true;
            restartBtn.disabled = false;

            restartBtn.classList.remove("hidden");
            startButton.classList.add("hidden");
            endButton.classList.add("hidden");

            // Reset game frame counter
            gameFrame = 0;

            break;
        }
        case GameStateEnum.GameEndedByPlayer:
        {
            // Show ending text;
            showTextSequence(["Just press on Restart Game when you want to continue playing 😎"]);

            npcObjectList = [];

            // Update button states
            startButton.disabled = false;
            endButton.disabled = true;
            restartBtn.disabled = false;

            restartBtn.classList.remove("hidden");
            startButton.classList.add("hidden");
            endButton.classList.add("hidden");

            // Reset game frame counter
            gameFrame = 0;

            break;
        }
        case GameStateEnum.InGame:
        {
            jumpingGameObject.gameDuration = 0;

            gameFrame = 0;

            // Update button states
            startButton.disabled = true;
            endButton.disabled = false;
            restartBtn.disabled = true;

            startButton.classList.add("hidden");
            restartBtn.classList.add("hidden");
            endButton.classList.remove("hidden");

            gameInformation.textContent = "";

            window.requestAnimationFrame(runnerGameLoop);

            break;
        }
        case GameStateEnum.CompletedGame: {
            // Show next screen
            videoContainer.classList.remove('hidden');

            gameScreen.classList.add('hidden');
            btnGroup.classList.add('hidden');

            break;
        }
        default: {
            // Do nothing
            break;
        }
    }
}
