<script setup>
import {ref} from 'vue';
import {getMaxHp, getRandomEnemy} from './helper.js';
import {fieldEnemy, filterAliveFieldEnemies} from './constants.js';

const character = ref({
  name: `Biba`,
  hp: 10,
  maxHp: 10,
  currentHP: null,
  attack: 1,
  exp: 0,
  lvlUpExp: 10,
  lvl: 1,
  equipment: {
    sword: null,
    chest: null,
    leg: null,
    feet: null,
    gloves: null,
    hat: null,
  }
});


// ------------------------------------------------------------------------------------------------------------------

// function selectLocation() {
// console.log(`Выберите локацию написав`)
// console.log(`-------------------------------------`)
// console.log(`"fieldFight()" - это поле`)
// console.log(`-------------------------------------`)
// console.log(`caveFight - это пещера`)
// console.log(`-------------------------------------`)
// console.log(`castleFight - это замок`)
// }
//
// selectLocation();

let activeEnemy = null;

function fieldFight() {
  if (character.value.hp <= 0 || !fieldEnemy.length){
    return;
  }

  if (!activeEnemy) {
    activeEnemy = getRandomEnemy()
    console.log(`Враг ${activeEnemy.name} приближается. Его здоровье: ${activeEnemy.hp} , Его атака: ${activeEnemy.attack} !`)
  }

  activeEnemy.hp -= character.value.attack;
  character.value.hp = activeEnemy.attack > character.value.hp ? 0 : character.value.hp - activeEnemy.attack;

  console.log(`Состояния врага: атака - ${activeEnemy.attack}, здоровье - ${activeEnemy.hp}`);
  console.log(`Ваше состояние: атака - ${character.value.attack}, здоровье - ${character.value.hp}`);

  if (activeEnemy.hp <= 0) {
    character.value.exp += activeEnemy.giveExp;
    console.log(`${activeEnemy.name} храбро пал в бою. Вы получаете ${activeEnemy.giveExp} опыта`);

    filterAliveFieldEnemies()
    activeEnemy = null;
  }

  if (!fieldEnemy.length) {
    console.log(`Вы победили всех свиней!`);
  }

  if (character.value.exp >= character.value.lvlUpExp) {
    lvlUp();
  }

  if (character.value.hp <= 0) {
    character.value.exp = Math.floor(character.value.exp / 2);
    console.log(`Вы умерли. И ваш опыт уменьшился в два раза.`);
  }
}

function reborn() {
  character.value.maxHp = getMaxHp(character.value);
  character.value.hp = getMaxHp(character.value);
}

function lvlUp () {
  character.value.lvl += 1;
  character.value.lvlUpExp *= 2;
  character.value.exp = 0;
  console.log(`Ваш уровень вырос. Для достижения следующего уровня вам нужно ${character.value.lvlUpExp} опыта`);
}

function getHpBarColor(hpPercent) {
  if (hpPercent > 60) {
    return `filled_green`;
  }

  if (hpPercent <= 20) {
    return `filled_red`;
  }

  return `filled_yellow`;
}
</script>

<template>
  <div class="game-board">
    <div class="character-wrapper">
      <h3>{{character.name}}</h3>

      <div class="stats">
        <div class="attack"> Атака: {{character.attack}}</div>
        <div class="attack"> Уровень: {{character.lvl}}</div>
      </div>

      <div class="health-point">
        <span class="label">{{character.hp}}/{{character.maxHp}}</span>
        <div
            class="filled"
            :style="{width: `${character.hp * 100 / character.maxHp}%`}"
            :class="getHpBarColor(character.hp * 100 / character.maxHp)"
        >

        </div>
      </div>

      <div class="xp">
        <span class="label">{{character.exp}}/{{character.lvlUpExp}}</span>
        <div class="filled" :style="{width: `${character.exp * 100 / character.lvlUpExp}%`}"></div>
      </div>
    </div>

    <div class="buttons-wrapper">
      <button class="fight-button" @click="fieldFight">Field</button>

      <button class="reborn-button" @click="reborn">Reborn</button>
    </div>
  </div>
</template>

<style scoped>
.game-board {
  display: flex;
  flex-flow: column;
  gap: 20px;
  justify-content: space-between;
}

.character-wrapper {
  display: flex;
  flex-direction: column;
  border-radius: 10px;
  border: 1px solid #a19c9c;

  h3 {
    margin: 0;
  }

  .stats {
    display: grid;
    grid-template-columns: 1fr 1fr;
    background: #c5c6c8;
  }

  .label {
    position: absolute;
    right: 50%;
    transform: translateX(50%);
    color: #1a1a1a;
    z-index: 2;
  }

  .health-point, .xp {
    position: relative;
    height: 25px;

    .filled {
      position: absolute;
      top: 0;
      left: 0;
      height: 100%;
    }
  }

  .health-point {
    .filled_green {
      background: #14ff20
    }

    .filled_yellow {
      background: #c17613;
    }

    .filled_red {
      background: #da2f2f;
    }
  }

  .xp {
    .filled {
      background: #389fe6
    }
  }
}

.buttons-wrapper {
  display: flex;
  justify-content: space-between;
  gap: 10px;

  button {
    padding: 30px 60px;
    font-size: 28px;
  }

  .reborn-button {
    background: cornflowerblue;
  }

  .fight-button {
    background: red;
  }
}
</style>
