import { PlayerStateEnum } from '../models/gameModels.js';
export class PlayerObjectStateMachineService {
    allowableStateChanges = new Map([
        [PlayerStateEnum.Idle, [PlayerStateEnum.Collision, PlayerStateEnum.Jumping]],
        [PlayerStateEnum.Jumping, [PlayerStateEnum.Collision, PlayerStateEnum.Idle]],
        [PlayerStateEnum.Collision, [PlayerStateEnum.Idle]]
    ]);
    validateStateTransition(currentObjectState, desiredState) {
        let availableStateChanges = this.allowableStateChanges.get(currentObjectState);
        return availableStateChanges.includes(desiredState);
    }
    tryPerformStateChange(objectWithState, desiredState) {
        const isStateTransitionAllowed = this.validateStateTransition(objectWithState.state, desiredState);
        if (isStateTransitionAllowed) {
            objectWithState.state = desiredState;
            return true;
        }
        return false;
    }
}
//# sourceMappingURL=playerObjectStateMachineService.js.map