import { PlayerStateEnum } from '../models/gameModels.js';
export class PlayerObjectStateMachineService {
    allowableStateChanges = new Map([
        [PlayerStateEnum.Idle, [PlayerStateEnum.Collision, PlayerStateEnum.Jumping]],
        [PlayerStateEnum.Jumping, [PlayerStateEnum.Collision, PlayerStateEnum.Idle]],
        [PlayerStateEnum.Collision, []]
    ]);
    validateStateTransition(currentObjectState, desiredState) {
        let availableStateChanges = this.allowableStateChanges.get(currentObjectState);
        return availableStateChanges.includes(desiredState);
    }
    tryPerformStateChange(objectWithState, desiredState) {
        const isStateTransitionAllowed = this.validateStateTransition(objectWithState.playerState, desiredState);
        if (isStateTransitionAllowed) {
            objectWithState.playerState = desiredState;
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=playerObjectStateMachineService.js.map