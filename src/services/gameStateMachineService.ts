import { GameStateEnum, type JumpingGameObject } from "../models/gameModels.js";
import type { StateMachineService } from "./interfaces/stateMachineService.js";

export class GameStateMachineService implements StateMachineService<GameStateEnum, JumpingGameObject> {

    allowableStateChanges: Map<GameStateEnum, GameStateEnum[]> = new Map([
        [GameStateEnum.BeginningScreen, [GameStateEnum.InGame]],
        [GameStateEnum.FailedGame, [GameStateEnum.BeginningScreen]],
        [GameStateEnum.GameEndedByPlayer, [GameStateEnum.BeginningScreen]],
        [GameStateEnum.InGame, [GameStateEnum.FailedGame, GameStateEnum.GameEndedByPlayer, GameStateEnum.CompletedGame]],
        [GameStateEnum.CompletedGame, []]
    ])

    validateStateTransition(currentObjectState: GameStateEnum, desiredState: GameStateEnum): boolean {
        let availableStateChanges = this.allowableStateChanges.get(currentObjectState);

        return availableStateChanges.includes(desiredState);
    }

    tryPerformStateChange(objectWithState: JumpingGameObject, desiredState: GameStateEnum): boolean {
        const isStateTransitionAllowed = this.validateStateTransition(objectWithState.state, desiredState);

        if (isStateTransitionAllowed)
        {
            objectWithState.state = desiredState;
            console.log(`State changed to -> ${desiredState}`)
            return true;
        }

        return false;
    }
    
}