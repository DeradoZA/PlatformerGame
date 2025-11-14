export var PlayerStateEnum;
(function (PlayerStateEnum) {
    PlayerStateEnum[PlayerStateEnum["Idle"] = 0] = "Idle";
    PlayerStateEnum[PlayerStateEnum["Collision"] = 1] = "Collision";
    PlayerStateEnum[PlayerStateEnum["Jumping"] = 2] = "Jumping";
})(PlayerStateEnum || (PlayerStateEnum = {}));
export var GameStateEnum;
(function (GameStateEnum) {
    GameStateEnum[GameStateEnum["BeginningScreen"] = 0] = "BeginningScreen";
    GameStateEnum[GameStateEnum["InGame"] = 1] = "InGame";
    GameStateEnum[GameStateEnum["FailedGame"] = 2] = "FailedGame";
    GameStateEnum[GameStateEnum["GameEndedByPlayer"] = 3] = "GameEndedByPlayer";
    GameStateEnum[GameStateEnum["BetweenAttempts"] = 4] = "BetweenAttempts";
    GameStateEnum[GameStateEnum["CompletedGame"] = 5] = "CompletedGame";
})(GameStateEnum || (GameStateEnum = {}));
//# sourceMappingURL=gameModels.js.map