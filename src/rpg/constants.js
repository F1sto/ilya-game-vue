// База данных - Места, Враги, Персонаж
export const items = [
  {name: `chest`, attack: 0, hp: 10, lvl: 3},
  {name: `leg`, attack: 0, hp: 4, lvl: 2},
  {name: `feet`, attack: 0, hp: 4, lvl: 2},
  {name: `gloves`, attack: 0, hp: 4, lvl: 2},
  {name: `hat`, attack: 0, hp: 2, lvl: 1},
  {name:`sword`, attack: 1, hp: 0, lvl: 2},
];

export let fieldEnemy = [
  {name: `pig 1`, hp: 2, attack: 1, giveExp: 4, lvl: 1},
  {name: `pig 2`, hp: 2, attack: 3, giveExp: 4, lvl: 2},
  {name: `pig 3`, hp: 2, attack: 4, giveExp: 4, lvl: 2},
];

export let caveEnemy = [
  {name: `goblin`, hp: 3, attack: 3, giveExp: 8},
  {name: `stoneElement`, hp: 6, attack: 2, giveExp: 8},
  {name: `ork`, hp: 5, attack: 3, giveExp: 8}
];

export let castleEnemy = [
  {name: `vampier`, hp: 2, attack: 1, giveExp: 1},
  {name: `skeletonKing`, hp: 1, attack: 3, giveExp: 2},
  {name: `lavamonster`, hp: 2, attack: 4, giveExp: 4}
];

export function filterAliveFieldEnemies() {
  fieldEnemy = fieldEnemy.filter((enemy) => enemy.hp > 0);
  console.log(fieldEnemy);
  return fieldEnemy;
}
