import type { GameObject, ObjectWithState } from "./baseModels.js"

export interface PlayerObject extends GameObject, ObjectWithState<PlayerStateEnum> {
    htmlElement: HTMLElement,
    xPos: number,
    yPos: number
}

export interface NpcObject extends GameObject {}

export interface ObjectBox {
    xBoundaries: number[],
    yBoundaries: number[]
}

export enum PlayerStateEnum {
    Idle,
    Collision,
    Jumping
}

export enum GameStateEnum {
    BeginningScreen,
    InGame,
    FailedGame,
    GameEndedByPlayer,
    CompletedGame
}

export interface JumpingGameObject extends ObjectWithState<GameStateEnum> {
    gameDuration: number;
}