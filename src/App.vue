<script setup>
import { ref } from 'vue';
import { AGES, clients, medicals } from './scripts/consts.js';

const copRating = ref(0);
const balance = ref(50);
const clientsArray = ref(Object.values(clients));
const productArray = ref(Object.values(medicals));

const buyVolume = ref(0);
const sellVolume = ref(0);
const selectedProduct = ref(null);
const selectedBuyer = ref(null);
const clientInLine = ref([]);

const historyLog = ref([])
const errorMessage = ref('');

for (let i = 0; i < 3; i++) {
  clientInLine.value.push(getNewRandomClient())
}

function getNewRandomClient() {
  const randomProductId =  productArray.value[Math.floor(Math.random() * productArray.value.length)].id
  const randomClint = {
    ...clientsArray.value[Math.floor(Math.random() * clientsArray.value.length)],
    wishProductId: randomProductId,
  };

  const existedRandomInLine = clientInLine.value.find((client) => client.id === randomClint.id)

  // Если рандомный клиент существует в очереди, запускаем функцию заново. Функция вернет клиента, которого нет в очереди
  if (existedRandomInLine) {
    return getNewRandomClient()
  } else {
    return randomClint
  }
}

function sell() {
  errorMessage.value = '';

  if (!selectedBuyer.value) {
    errorMessage.value = `Не выбран покупатель`
    return;
  }

  const wishProduct = getProductById(selectedBuyer.value.wishProductId);

  if (!wishProduct.volume || sellVolume.value > wishProduct.volume) {
    errorMessage.value = `Недостаточно объема у продукта ${wishProduct.name}`
    return;
  }

  if (sellVolume.value <= 0) {
    errorMessage.value = `Введите значение`
    return;
  }

  let price = wishProduct.price

  if (selectedBuyer.value.age === AGES.old) {
    price -= 8;

    const copsRandom = Math.floor(Math.random() * 2) + 1;
    if (copsRandom === 1 && copRating.value > 0) {
      copRating.value -= copsRandom
    }
  }

  if (selectedBuyer.value.age === AGES.young) {
    price += 3;

    const copsRandom = Math.floor(Math.random() * 2) + 1;
    if (copsRandom === 1) {
      copRating.value += copsRandom
    }
  }

  balance.value += price * sellVolume.value;
  medicals[wishProduct.name].volume -= sellVolume.value;

  // Фильтр убирает выбранного клиента из очереди
  clientInLine.value = clientInLine.value.filter((client) => {
    return client.id !== selectedBuyer.value.id
  })

  // Увеличиваем ожидание оставшимся клиентам в очереди
  clientInLine.value.forEach((client) => {
    client.awaiting += 1;
  });

  // Добавляем нового клиента в очередь
  clientInLine.value.push(getNewRandomClient());

  historyLog.value.push(`Клиент ${selectedBuyer.value.name}, купил ${sellVolume.value} ${wishProduct.name}, по цене ${price}`);

  if (copRating.value === 10) {
    errorMessage.value = `GameOver: potracheno`;
  }

  if (balance === 0) {
    errorMessage.value = `GameOver: deneg.net`;
  }

  selectedBuyer.value = null;
  sellVolume.value = 0;
}

function buy() {

  if (!selectedProduct.value) {
    errorMessage.value = `Не выбран продукт`
    return;
  }

  if (buyVolume.value <= 0) {
    errorMessage.value = `Че ты хочешь?`
    return;
  }

  const totalPrice = selectedProduct.value.warehousePrice * buyVolume.value

  if (balance.value < totalPrice) {
    errorMessage.value = `Нужно больше золота!`
    return;
  }


  medicals[selectedProduct.value.name].volume += buyVolume.value;
  balance.value -= totalPrice;

  historyLog.value.push(`Вы закупились ${buyVolume.value} ${selectedProduct.value.name} по цене ${selectedProduct.value.warehousePrice}`);

  selectedProduct.value = null;
  buyVolume.value = 0;
  errorMessage.value = '';

}

function getProductById(id) {
  return productArray.value.find((medical) => medical.id === id)
}
</script>

<template>
  <div>
    <h3>Начнем твой первый день в Аптеке. К тебе будут приходить разные клиенты.
      Следи за кассой: если у тебя не останется денег, ты уволен. И помни — от тебя зависят жизни!
    </h3>

    <div class="statistics">
      <h3>Статистика</h3>
      <span>Баланс: {{ balance }}</span>
      <span>Копы: {{ copRating }}</span>
    </div>

    <div class="game-board">
      <div>
        <h3>Клиенты</h3>
        <div class="cards-wrapper">
          <div
            v-for="client in clientInLine"
            class="card"
            :class="{selected: selectedBuyer?.name === client.name}"
            @click="selectedBuyer = {...client}"
          >
            <div class="card__row">
              <span class="label">Имя: </span>
              <span>{{ client.name }}</span>
            </div>

            <div class="card__row">
              <span class="label">Возраст: </span>
              <span>{{ client.age }}</span>
            </div>

            <div class="card__row">
              <span class="label">Хочу: </span>
              <span>{{ getProductById(client.wishProductId).name }}</span>
            </div>

            <div class="card__row">
              <span class="label">Ожидание: </span>
              <span>{{ client.awaiting }}</span>
            </div>
          </div>
        </div>
      </div>


      <div class="center-section">
        <div v-if="errorMessage" class="error-wrapper">
          <h3 class="error-label">Ошибка:</h3>
          <span>{{errorMessage}}</span>
        </div>

        <div class="buttons-wrapper">
          <div>
            <span>Объем: </span>
            <input v-model="sellVolume" type="number" />

            <button class="sell-button" @click="sell">Продать</button>
          </div>

          <div>
            <span>Объем: </span>
            <input v-model="buyVolume" type="number" />

            <button class="buy-button" @click="buy">Пополнить</button>
          </div>
        </div>

        <h3>История действий:</h3>
        <div class="history-log-wrapper">
          <div
              v-for="message in historyLog"
          >
            <span>
              {{message}}

            </span>
          </div>
        </div>
      </div>

      <div>
        <h3>Товары</h3>
        <div class="cards-wrapper">
          <div
            v-for="product in Object.values(medicals)"
            class="card"
            :class="{selected: selectedProduct?.name === product.name}"
            @click="selectedProduct = {...product}"
          >
            <div>
              <span class="label">Название:</span>
              <span>{{ product.name }}</span>
            </div>

            <div>
              <span class="label">Цена:</span>
              <span>{{ product.price }}</span>
            </div>

            <div>
              <span class="label">Цена склада:</span>
              <span>{{ product.warehousePrice }}</span>

            </div>

            <div>
              <span class="label">Количество:</span>
              <span>{{ product.volume }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.game-board {
  display: flex;
  justify-content: space-between;
}

.label {
  color: #c6c6c6;
}

.error-label {
  color: #aa2d2d;
}

.error-wrapper {
  display: flex;
  align-items: center;
  gap: 5px;
  padding-bottom: 10px;

  h3 {
    margin: 0;
  }
}

.statistics {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  background: #2d3277;
  width: fit-content;
  padding: 1px;
  border-radius: 10px;
}

.card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  background: #818080;
  border-radius: 10px;
}

.card__row {
  display: flex;
}

.card.selected {
  outline: 3px solid #4CAF50;
}

.cards-wrapper {
  display: flex;
  flex-flow: column;
  gap: 10px;
}

.buttons-wrapper {
  display: flex;
  justify-content: space-between;

  button {
    padding: 30px 60px;
    font-size: 28px;
  }

  .sell-button {
    background: cornflowerblue;
  }

  .buy-button {
    background: red;
  }
}

.history-log-wrapper {
  display: flex;
  flex-flow: column;
  gap: 5px;
}
</style>
