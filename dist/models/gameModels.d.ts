export interface GameObject {
    htmlElement: HTMLElement;
    xPos: number;
    yPos: number;
    playerState?: PlayerStateEnum;
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
    CompletedGame = 4
}
//# sourceMappingURL=gameModels.d.ts.map