import {PlayerStateEnum, type PlayerObject} from '../models/gameModels.js'
import type { StateMachineService } from './interfaces/stateMachineService.js';

export class PlayerObjectStateMachineService implements StateMachineService<PlayerStateEnum, PlayerObject>
{
    allowableStateChanges: Map<PlayerStateEnum, PlayerStateEnum[]> = new Map([
        [PlayerStateEnum.Idle, [PlayerStateEnum.Collision, PlayerStateEnum.Jumping]],
        [PlayerStateEnum.Jumping, [PlayerStateEnum.Collision, PlayerStateEnum.Idle]],
        [PlayerStateEnum.Collision, []]
    ]);

    validateStateTransition(currentObjectState: PlayerStateEnum, desiredState: PlayerStateEnum): boolean {
        let availableStateChanges = this.allowableStateChanges.get(currentObjectState);

        return availableStateChanges.includes(desiredState);
    }

    tryPerformStateChange(objectWithState: PlayerObject, desiredState: PlayerStateEnum): boolean {
        const isStateTransitionAllowed = this.validateStateTransition(objectWithState.state, desiredState);

        if (isStateTransitionAllowed)
        {
            objectWithState.state = desiredState;
            return true;
        }

        return false;
    }
    
}