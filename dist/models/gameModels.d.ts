import type { GameObject, ObjectWithState } from "./baseModels.js";
export interface PlayerObject extends GameObject, ObjectWithState<PlayerStateEnum> {
    xPos: number;
    yPos: number;
}
export interface NpcObject extends GameObject {
    isWinningObject: boolean;
}
export interface ObjectBox {
    xBoundaries: number[];
    yBoundaries: number[];
}
export declare enum PlayerStateEnum {
    Idle = 0,
    Collision = 1,
    Jumping = 2
}
export declare enum GameStateEnum {
    BeginningScreen = 0,
    InGame = 1,
    FailedGame = 2,
    GameEndedByPlayer = 3,
    BetweenAttempts = 4,
    CompletedGame = 5
}
export interface JumpingGameObject extends ObjectWithState<GameStateEnum> {
    gameDuration: number;
}
//# sourceMappingURL=gameModels.d.ts.map