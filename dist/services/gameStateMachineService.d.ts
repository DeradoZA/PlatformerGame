import { GameStateEnum, type JumpingGameObject } from "../models/gameModels.js";
import type { StateMachineService } from "./interfaces/stateMachineService.js";
export declare class GameStateMachineService implements StateMachineService<GameStateEnum, JumpingGameObject> {
    allowableStateChanges: Map<GameStateEnum, GameStateEnum[]>;
    validateStateTransition(currentObjectState: GameStateEnum, desiredState: GameStateEnum): boolean;
    tryPerformStateChange(objectWithState: JumpingGameObject, desiredState: GameStateEnum): boolean;
}
//# sourceMappingURL=gameStateMachineService.d.ts.map