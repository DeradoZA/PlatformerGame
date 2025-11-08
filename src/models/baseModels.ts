export interface ObjectWithState<TStateEnum> {
    state: TStateEnum
}

export interface GameObject {
    htmlElement: HTMLImageElement,
    xPos: number,
    yPos: number
}