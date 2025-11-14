import { PlayerStateEnum, type PlayerObject } from '../models/gameModels.js';
import type { StateMachineService } from './interfaces/stateMachineService.js';
export declare class PlayerObjectStateMachineService implements StateMachineService<PlayerStateEnum, PlayerObject> {
    allowableStateChanges: Map<PlayerStateEnum, PlayerStateEnum[]>;
    validateStateTransition(currentObjectState: PlayerStateEnum, desiredState: PlayerStateEnum): boolean;
    tryPerformStateChange(objectWithState: PlayerObject, desiredState: PlayerStateEnum): boolean;
}
//# sourceMappingURL=playerObjectStateMachineService.d.ts.map