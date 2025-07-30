import {fieldEnemy} from './constants.js';

export function getMaxHp(character) {
  const equipmentHp = getEquipmentStatSum(character.equipment, `hp`) ;
  return character.lvl * 10 + equipmentHp;
}

function getEquipmentStatSum(equipment, stat) {
  return Object.values(equipment)
    .filter(item => item !== null)
    .reduce((sum, item) => sum + (item[stat] || 0), 0);
}

export function getRandomEnemy() {
  const randomEnemy = Math.floor(Math.random() * fieldEnemy.length);
  return fieldEnemy[randomEnemy];
}
