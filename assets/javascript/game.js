var GameSettings = {
  words: ["tattoine", "vader", "luke", "falcon", "planet", "chewie", "blaster", "moon"],
  guessesAllowedPerGame: 10,
  characterCodes: { a: 97, z: 122, A: 65, Z: 90 },
  UnrevealedSecretPlaceholder: "_",
  gameStatus: { playing: "playing", won: "won", lost: "lost" }
};

var GameState = {
  wins: 0,
  guessesRemaining: 0,
  currentSecretIndex: 0,
  currentSecret: undefined,  
  currentSecretDisplayValue: undefined,
  lettersAlreadyGuessed: []
};

$(function () {
  StartNewGame();
  RefreshUi();
  $(window).on("keypress", HandleKeyPress);
});

function StartNewGame() {
  GameState.lettersAlreadyGuessed = [];
  GameState.guessesRemaining = GameSettings.guessesAllowedPerGame;
  GameState.currentSecret = GameSettings.words[GameState.currentSecretIndex];  
  GameState.currentSecretDisplayValue = ScoreCurrentGame().secretDisplayValue;
  GameState.currentSecretIndex++;  

  if (GameState.currentSecretIndex >= GameSettings.words.length) {
    GameState.currentSecretIndex = 0;
  }
}

function RefreshUi() {
  $("#winCount").html(GameState.wins);
  $("#guessesRemaining").html(GameState.guessesRemaining);
  $("#lettersGuessed").html(GameState.lettersAlreadyGuessed.join(' ') + "&nbsp;");
  $("#currentWord").html(GameState.currentSecretDisplayValue);
}

function HandleKeyPress(e) {
  if (IsValidGuess(e.which)) {
    HandleLetterGuess(String.fromCharCode(e.which).toLowerCase());
  }
}

function IsValidGuess(keyCode) {
  return IsLetterKeyLowercase(keyCode) || IsLetterKeyUppercase(keyCode);
}

function IsLetterKeyLowercase(keyCode) {
  return keyCode >= GameSettings.characterCodes.a && keyCode <= GameSettings.characterCodes.z;
}

function IsLetterKeyUppercase(keyCode) {
  return keyCode >= GameSettings.characterCodes.A && keyCode <= GameSettings.characterCodes.Z;
}

function ScoreCurrentGame() {
  var lettersInSecret = GameState.currentSecret.split('');
  var numberOfPlaceholders = 0;

  for (var i = 0; i < lettersInSecret.length; i++) {
    if (GameState.lettersAlreadyGuessed.indexOf(lettersInSecret[i]) === -1) {
      lettersInSecret[i] = GameSettings.UnrevealedSecretPlaceholder;
      numberOfPlaceholders++;
    }
  }

  return {
    status: GetCurrentGameStatus(numberOfPlaceholders),
    secretDisplayValue: lettersInSecret.join(' '),
    numberOfPlaceholders: numberOfPlaceholders
  };
}

function GetCurrentGameStatus(numberOfPlaceholders) {
  if (numberOfPlaceholders === 0) {
    return GameSettings.gameStatus.won;
  } else if (GameState.guessesRemaining === 0) {
    return GameSettings.gameStatus.lost;
  }

  return GameSettings.gameStatus.playing;
}

function HandleLetterGuess(letter) {
  if (GameState.lettersAlreadyGuessed.indexOf(letter) === -1) {
    var updateResult = UpdateGameState(letter);
    var gameOver = false;

    if (updateResult.status === GameSettings.gameStatus.won) {
      gameOver = true;
      GameState.wins++;
    } else if (updateResult.status === GameSettings.gameStatus.lost) {
      gameOver = true;
    }

    if (gameOver) {
      StartNewGame();
    }

    RefreshUi();
  }
}

function UpdateGameState(letter) {
  GameState.lettersAlreadyGuessed.push(letter);
  GameState.guessesRemaining--;

  var scoreResult = ScoreCurrentGame();
  GameState.currentSecretDisplayValue = scoreResult.secretDisplayValue;

  return scoreResult;
}