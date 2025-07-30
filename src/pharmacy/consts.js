export const AGES = {
  young: `young`,
  old: `old`,
  adult: `adult`,
};

export const medicals = {
  baralgin: {
    price: 10,
    name: `baralgin`,
    volume: 10,
    warehousePrice: 9,
    id: 1
  },
  trigande: {
    price: 10,
    name: `trigande`,
    volume: 10,
    warehousePrice: 6,
    id: 2
  },
};

export const clients = {
  Oleg: {
    id: 1,
    name: `Oleg`,
    age: AGES.young,
    awaiting: 0,
    wishProductId: 1, // todo: wishVolume
  },
  Semen: {
    id: 2,
    name: `Semen`,
    age: AGES.old,
    awaiting: 0,
    wishProductId: 1,
  },
  Kate: {
    id: 3,
    name: `Kate`,
    age: AGES.young,
    awaiting: 0,
    wishProductId: 1,
  },
  Bob: {
    id: 4,
    name: `Bob`,
    age: AGES.old,
    awaiting: 0,
    wishProductId: 1,
  },
};
