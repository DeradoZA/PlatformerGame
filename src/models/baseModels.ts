export interface ObjectWithState<TStateEnum> {
    state: TStateEnum
}

export interface GameObject {
    htmlElement: HTMLElement,
    xPos: number,
    yPos: number
}