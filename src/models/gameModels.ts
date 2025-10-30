export interface GameObject {
    htmlElement: HTMLElement,
    xPos: number,
    yPos: number
    playerState?: PlayerStateEnum
}

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