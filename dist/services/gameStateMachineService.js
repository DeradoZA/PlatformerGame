import { GameStateEnum } from "../models/gameModels.js";
export class GameStateMachineService {
    allowableStateChanges = new Map([
        [GameStateEnum.BeginningScreen, [GameStateEnum.InGame]],
        [GameStateEnum.FailedGame, [GameStateEnum.BetweenAttempts, GameStateEnum.InGame]],
        [GameStateEnum.GameEndedByPlayer, [GameStateEnum.BetweenAttempts, GameStateEnum.InGame]],
        [GameStateEnum.InGame, [GameStateEnum.FailedGame, GameStateEnum.GameEndedByPlayer, GameStateEnum.CompletedGame]],
        [GameStateEnum.BetweenAttempts, [GameStateEnum.InGame]],
        [GameStateEnum.CompletedGame, []]
    ]);
    validateStateTransition(currentObjectState, desiredState) {
        let availableStateChanges = this.allowableStateChanges.get(currentObjectState);
        return availableStateChanges.includes(desiredState);
    }
    tryPerformStateChange(objectWithState, desiredState) {
        const isStateTransitionAllowed = this.validateStateTransition(objectWithState.state, desiredState);
        if (isStateTransitionAllowed) {
            objectWithState.state = desiredState;
            console.log(`State changed to -> ${desiredState}`);
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=gameStateMachineService.js.map