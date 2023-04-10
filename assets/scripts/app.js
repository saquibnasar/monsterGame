const ATTACK_VALUE = 10;
const MONSTER_ATTACK_VALUE = 30;
const STRONG_ATTACK_VALUE = 14;
const HEAL_VALUE = 16;
const MODE_ATTACK = "ATTACK";
const MODE_STRONG_ATTACK = "STRONG_ATTACK";
const LOG_EVENT_PLAYER_ATTACK = "PLAYER_ATTACK";
const LOG_EVENT_PLAYER_STRONG_ATTACK = "PLAYER_STRONG_ATTACK";
const LOG_EVENT_MONSTER_ATTACK = "MONSTER_ATTACK";
const LOG_EVENT_PLAYER_HEAL = "PLAYER_HEAL";
const LOG_EVENT_GAME_OVER = "GAME_OVER";

let battleLog = [];
let lastLoggedEntry;

const getMaxLifeValue = () => {
  const enteredValue = prompt("Maximum life for you and monster.", "100");
  let parseValue = parseInt(enteredValue);
  if (isNaN(parseValue) || parseValue <= 0) {
    throw { message: "Invalid user input, not a number!" };
  }
  return parseValue;
};
let chosenMaxLife;

try {
  chosenMaxLife = getMaxLifeValue();
} catch (err) {
  console.log(err);
  chosenMaxLife = 100;
  alert("You entered something wrong, default value of 100 was used.");
}
// let chosenMaxLife = getMaxLifeValue();
let currentMonsterHealth = chosenMaxLife;
let currentPlayerHealth = chosenMaxLife;
let hasBounsLife = true;

adjustHealthBars(chosenMaxLife);
const writeToLog = (event, value, monsterHealth, playerHealth) => {
  let logEntry = {
    event: event,
    value: value,
    target: "",
    finalMonsterHealth: monsterHealth,
    finalPlayerHealth: playerHealth,
  };

  switch (event) {
    case LOG_EVENT_PLAYER_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_PLAYER_STRONG_ATTACK:
      logEntry.target = "MONSTER";
      break;
    case LOG_EVENT_MONSTER_ATTACK:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_PLAYER_HEAL:
      logEntry.target = "PLAYER";
      break;
    case LOG_EVENT_GAME_OVER:
      logEntry = {
        event: event,
        value: value,
        finalMonsterHealth: monsterHealth,
        finalPlayerHealth: playerHealth,
      };
  }
  battleLog.push(logEntry);
};
const reset = () => {
  currentMonsterHealth = chosenMaxLife;
  currentPlayerHealth = chosenMaxLife;
  resetGame(chosenMaxLife);
};

const endRound = () => {
  const initialPlayerHealth = currentPlayerHealth;
  const playerDamage = dealPlayerDamage(MONSTER_ATTACK_VALUE);
  currentPlayerHealth -= playerDamage;
  writeToLog(
    LOG_EVENT_MONSTER_ATTACK,
    playerDamage,
    currentMonsterHealth,
    currentPlayerHealth
  );
  if (currentPlayerHealth <= 0 && hasBounsLife) {
    hasBounsLife = false;
    removeBonusLife();
    currentPlayerHealth = initialPlayerHealth;
    setPlayerHealth(initialPlayerHealth);
  } else if (currentMonsterHealth < 0 && currentPlayerHealth > 0) {
    alert("You Won");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER WON",
      currentMonsterHealth,
      currentPlayerHealth
    );
  } else if (currentPlayerHealth < 0 && currentMonsterHealth > 0) {
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "PLAYER LOSE",
      currentMonsterHealth,
      currentPlayerHealth
    );
    alert("You Lose");
  } else if (currentMonsterHealth <= 0 && currentPlayerHealth <= 0) {
    alert("You have a draw");
    writeToLog(
      LOG_EVENT_GAME_OVER,
      "A DRAW",
      currentMonsterHealth,
      currentPlayerHealth
    );
  }
  if (currentMonsterHealth <= 0 || currentPlayerHealth <= 0) {
    reset();
  }
};

const attackMonster = (mode) => {
  const maxDamage = mode === MODE_ATTACK ? ATTACK_VALUE : STRONG_ATTACK_VALUE;
  const logEvent =
    mode === MODE_ATTACK
      ? LOG_EVENT_PLAYER_ATTACK
      : LOG_EVENT_PLAYER_STRONG_ATTACK;

  const damage = dealMonsterDamage(maxDamage);
  currentMonsterHealth -= damage;
  writeToLog(logEvent, damage, currentMonsterHealth, currentPlayerHealth);
  endRound();
};

const attackHendler = () => {
  attackMonster(MODE_ATTACK);
};
const strongAttackHendler = () => {
  attackMonster(MODE_STRONG_ATTACK);
};
const healPlayerHendler = () => {
  let healValue;
  if (currentPlayerHealth >= chosenMaxLife - HEAL_VALUE) {
    alert("You can't heal yourself more");
    healValue = chosenMaxLife - currentPlayerHealth;
  } else {
    healValue = HEAL_VALUE;
  }
  increasePlayerHealth(healValue);
  currentPlayerHealth += healValue;
  writeToLog(
    LOG_EVENT_PLAYER_HEAL,
    healValue,
    currentMonsterHealth,
    currentPlayerHealth
  );
  endRound();
};
const printLogHendler = () => {
  let i = 0;
  for (const logEntry of battleLog) {
    if ((!lastLoggedEntry && lastLoggedEntry !== 0) || lastLoggedEntry < i) {
      console.log(`#${i}`);
      for (const Key in logEntry) {
        console.log(`${Key} => ${logEntry[Key]}`);
      }
      lastLoggedEntry = i;
      break;
    }
    i++;
  }
};

attackBtn.addEventListener("click", attackHendler);
strongAttackBtn.addEventListener("click", strongAttackHendler);
healBtn.addEventListener("click", healPlayerHendler);
logBtn.addEventListener("click", printLogHendler);
