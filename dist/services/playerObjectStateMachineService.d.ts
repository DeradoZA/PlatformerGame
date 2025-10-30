import { PlayerStateEnum, type GameObject } from '../models/gameModels.js';
import type { StateMachineService } from './interfaces/stateMachineService.js';
export declare class PlayerObjectStateMachineService implements StateMachineService<PlayerStateEnum, GameObject> {
    allowableStateChanges: Map<PlayerStateEnum, PlayerStateEnum[]>;
    validateStateTransition(currentObjectState: PlayerStateEnum, desiredState: PlayerStateEnum): boolean;
    tryPerformStateChange(objectWithState: GameObject, desiredState: PlayerStateEnum): boolean;
}
//# sourceMappingURL=playerObjectStateMachineService.d.ts.map