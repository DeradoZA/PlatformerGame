export interface StateMachineService<TStateEnum, TObjectWithState> {
    allowableStateChanges: Map<TStateEnum, TStateEnum[]>;
    validateStateTransition(currentObjectState: TStateEnum, desiredState: TStateEnum): boolean;
    tryPerformStateChange(objectWithState: TObjectWithState, desiredState: TStateEnum): boolean;
}
//# sourceMappingURL=stateMachineService.d.ts.map