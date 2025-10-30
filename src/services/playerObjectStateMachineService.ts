import {PlayerStateEnum, type GameObject} from '../models/gameModels.js'
import type { StateMachineService } from './interfaces/stateMachineService.js';

export class PlayerObjectStateMachineService implements StateMachineService<PlayerStateEnum, GameObject>
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
    
    tryPerformStateChange(objectWithState: GameObject, desiredState: PlayerStateEnum): boolean {
        const isStateTransitionAllowed = this.validateStateTransition(objectWithState.playerState, desiredState);

        if (isStateTransitionAllowed)
        {
            objectWithState.playerState = desiredState;
            return true;
        }

        return false;
    }
    
}