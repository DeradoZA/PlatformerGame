import { PlayerStateEnum } from '../models/gameModels.js';
const allowableStateChanges = new Map();
allowableStateChanges.set(PlayerStateEnum.Idle, [PlayerStateEnum.Collision, PlayerStateEnum.Jumping]);
allowableStateChanges.set(PlayerStateEnum.Jumping, [PlayerStateEnum.Collision, PlayerStateEnum.Idle]);
// Terminal state.
allowableStateChanges.set(PlayerStateEnum.Collision, []);
// If change occured, return true
export function tryPerformStateChange(playerObject, desiredState) {
    const isStateTransitionAllowed = validateStateTransition(playerObject, desiredState);
    if (isStateTransitionAllowed) {
        playerObject.playerState = desiredState;
        return true;
    }
    return false;
}
function validateStateTransition(playerObject, desiredState) {
    let currentPlayerState = playerObject.playerState;
    let availableStateChanges = allowableStateChanges.get(currentPlayerState);
    return availableStateChanges.includes(desiredState);
}
//# sourceMappingURL=stateMachineService.js.map