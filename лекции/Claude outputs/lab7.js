'use strict';

/* =====================================================================
 * Лабораторная работа №7. Методы объектов и контекст вызова
 * Запуск: node lab7.js   (или подключить в HTML и смотреть консоль)
 * ===================================================================== */

// ---------- Общие функции проверки (используются во всех задачах) ----------

const isPositiveNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

const isPositiveInteger = (value) => Number.isInteger(value) && value > 0;

const isPercent = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 100;

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';

// Деньги округляем до копеек, чтобы не копить ошибки вида 0.1 + 0.2
const roundMoney = (value) => Math.round(value * 100) / 100;

// Защита от вызова конструктора без new (иначе this === undefined в strict mode)
function assertCalledWithNew(target, name) {
  if (!target) {
    throw new TypeError(`${name} нужно вызывать через new: new ${name}(...)`);
  }
}

/* =====================================================================
 * Задача 1. Функция-конструктор Product
 * ===================================================================== */

function Product(id, title, price, category) {
  assertCalledWithNew(new.target, 'Product');
  if (id === undefined || id === null) throw new TypeError('Product: id обязателен');
  if (!isNonEmptyString(title)) throw new TypeError('Product: title должен быть непустой строкой');
  if (!isPositiveNumber(price)) throw new RangeError('Product: price должен быть положительным числом');
  if (!isNonEmptyString(category)) throw new TypeError('Product: category должна быть непустой строкой');

  // this — новый пустой объект, который создал оператор new
  this.id = id;
  this.title = title.trim();
  this.price = roundMoney(price);
  this.category = category.trim();
  this.isAvailable = true;

  this.getInfo = function () {
    const status = this.isAvailable ? 'в наличии' : 'нет в наличии';
    return `#${this.id} «${this.title}» [${this.category}] — ${this.price.toFixed(2)} BYN, ${status}`;
  };

  this.changePrice = function (newPrice) {
    if (!isPositiveNumber(newPrice)) {
      console.log(`  ✗ «${this.title}»: цена ${newPrice} некорректна, остаётся ${this.price} BYN`);
      return false;
    }
    this.price = roundMoney(newPrice);
    return true;
  };

  this.applyDiscount = function (percent) {
    if (!isPercent(percent)) {
      console.log(`  ✗ «${this.title}»: скидка ${percent}% вне диапазона 0–100, цена не изменена`);
      return false;
    }
    const discounted = roundMoney(this.price * (1 - percent / 100));
    // Скидка 100% дала бы цену 0, а цена обязана оставаться положительной
    if (!isPositiveNumber(discounted)) {
      console.log(`  ✗ «${this.title}»: после скидки ${percent}% цена стала бы ${discounted}, отклонено`);
      return false;
    }
    this.price = discounted;
    return true;
  };

  this.disable = function () {
    this.isAvailable = false;
  };

  this.enable = function () {
    this.isAvailable = true;
  };
}

/* =====================================================================
 * Задача 2. Функция-конструктор ShoppingCart
 * ===================================================================== */

function ShoppingCart(customerName) {
  assertCalledWithNew(new.target, 'ShoppingCart');
  if (!isNonEmptyString(customerName)) {
    throw new TypeError('ShoppingCart: customerName должен быть непустой строкой');
  }

  this.customerName = customerName.trim();
  this.currency = 'BYN';
  this.items = []; // у КАЖДОЙ корзины свой массив, т.к. он создаётся при каждом new
  this.discount = 0;

  this.addItem = function (product, quantity = 1) {
    if (!(product instanceof Product)) {
      console.log('  ✗ В корзину можно добавить только объект Product');
      return false;
    }
    if (!product.isAvailable) {
      console.log(`  ✗ «${product.title}» недоступен, в корзину ${this.customerName} не добавлен`);
      return false;
    }
    if (!isPositiveInteger(quantity)) {
      console.log(`  ✗ Количество ${quantity} должно быть целым положительным числом`);
      return false;
    }

    const existing = this.items.find((item) => item.id === product.id);
    if (existing) {
      existing.quantity += quantity;
      return true;
    }

    // Сохраняем копию нужных данных: исходный product не изменяется
    this.items.push({
      id: product.id,
      title: product.title,
      price: product.price,
      quantity,
    });
    return true;
  };

  this.removeItem = function (productId) {
    const countBefore = this.items.length;
    this.items = this.items.filter((item) => item.id !== productId);
    return this.items.length < countBefore;
  };

  this.changeQuantity = function (productId, quantity) {
    if (!isPositiveInteger(quantity)) {
      console.log(`  ✗ Количество ${quantity} должно быть целым положительным числом`);
      return false;
    }
    const item = this.items.find((entry) => entry.id === productId);
    if (!item) {
      console.log(`  ✗ Товара с id=${productId} нет в корзине`);
      return false;
    }
    item.quantity = quantity;
    return true;
  };

  this.setDiscount = function (percent) {
    if (!isPercent(percent)) {
      console.log(`  ✗ Скидка ${percent}% вне диапазона 0–100, остаётся ${this.discount}%`);
      return false;
    }
    this.discount = percent;
    return true;
  };

  this.getTotalBeforeDiscount = function () {
    return roundMoney(this.items.reduce((sum, item) => sum + item.price * item.quantity, 0));
  };

  this.getTotal = function () {
    return roundMoney(this.getTotalBeforeDiscount() * (1 - this.discount / 100));
  };

  this.getSummary = function () {
    return this.items.map(
      (item) =>
        `${item.title} × ${item.quantity} = ${roundMoney(item.price * item.quantity).toFixed(2)} ${this.currency}`
    );
  };
}

/* =====================================================================
 * Задача 3. Функция-конструктор DeliveryTariff
 * ===================================================================== */

function DeliveryTariff(title, basePrice, pricePerKilogram, maxWeight) {
  assertCalledWithNew(new.target, 'DeliveryTariff');
  const isNonNegative = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0;

  if (!isNonEmptyString(title)) throw new TypeError('DeliveryTariff: title должен быть непустой строкой');
  if (!isNonNegative(basePrice)) throw new RangeError('DeliveryTariff: basePrice не может быть отрицательным');
  if (!isNonNegative(pricePerKilogram)) throw new RangeError('DeliveryTariff: pricePerKilogram не может быть отрицательным');
  if (!isPositiveNumber(maxWeight)) throw new RangeError('DeliveryTariff: maxWeight должен быть положительным');

  this.title = title.trim();
  this.basePrice = basePrice;
  this.pricePerKilogram = pricePerKilogram;
  this.maxWeight = maxWeight;

  this.canDeliver = function (weight) {
    return isPositiveNumber(weight) && weight <= this.maxWeight;
  };

  this.calculate = function (weight) {
    if (!this.canDeliver(weight)) return null;
    const cost = this.basePrice + this.pricePerKilogram * weight;
    return roundMoney(Math.max(0, cost));
  };

  this.getInfo = function (weight) {
    const cost = this.calculate(weight);
    if (cost === null) {
      return `${this.title}: груз ${weight} кг доставить нельзя (допустимо 0 < вес ≤ ${this.maxWeight} кг)`;
    }
    return `${this.title}: ${weight} кг — ${cost.toFixed(2)} BYN`;
  };
}

/* =====================================================================
 * Задача 4. Объект настроек интерфейса (геттеры и сеттеры)
 * ===================================================================== */

const SETTINGS_RULES = Object.freeze({
  themes: ['light', 'dark'],
  languages: ['ru', 'en', 'be'],
  minFontSize: 10,
  maxFontSize: 32,
  defaults: Object.freeze({ theme: 'light', fontSize: 16, language: 'ru' }),
});

const interfaceSettings = {
  _theme: 'light',
  _fontSize: 16,
  _language: 'ru',

  get theme() {
    return this._theme;
  },
  set theme(value) {
    if (!SETTINGS_RULES.themes.includes(value)) {
      console.log(`  ✗ Тема "${value}" не поддерживается, остаётся "${this._theme}"`);
      return;
    }
    this._theme = value;
  },

  get fontSize() {
    return this._fontSize;
  },
  set fontSize(value) {
    const { minFontSize, maxFontSize } = SETTINGS_RULES;
    if (!Number.isInteger(value) || value < minFontSize || value > maxFontSize) {
      console.log(`  ✗ Размер шрифта ${value} вне ${minFontSize}–${maxFontSize}, остаётся ${this._fontSize}`);
      return;
    }
    this._fontSize = value;
  },

  get language() {
    return this._language;
  },
  set language(value) {
    if (!SETTINGS_RULES.languages.includes(value)) {
      console.log(`  ✗ Язык "${value}" не поддерживается, остаётся "${this._language}"`);
      return;
    }
    this._language = value;
  },

  // Геттеры только читают состояние и ничего не меняют
  get cssClasses() {
    return [`theme-${this.theme}`, `font-${this.fontSize}`, `lang-${this.language}`];
  },

  get summary() {
    return `Тема: ${this.theme}, шрифт: ${this.fontSize}px, язык: ${this.language}`;
  },

  reset() {
    const { theme, fontSize, language } = SETTINGS_RULES.defaults;
    // Присваивание вызывает сеттеры, а не пишет в _-поля напрямую
    this.theme = theme;
    this.fontSize = fontSize;
    this.language = language;
  },
};

/* =====================================================================
 * Задача 5. Музыкальный проигрыватель
 * ===================================================================== */

const player = {
  tracks: [
    { id: 1, title: 'Midnight City', artist: 'M83' },
    { id: 2, title: 'Instant Crush', artist: 'Daft Punk' },
    { id: 3, title: 'Intro', artist: 'The xx' },
  ],
  _currentTrackIndex: 0,
  _volume: 50,
  isPlaying: false,

  get currentTrack() {
    return this.tracks[this._currentTrackIndex] ?? null;
  },

  get volume() {
    return this._volume;
  },
  set volume(value) {
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      console.log(`  ✗ Громкость ${value} должна быть целым числом 0–100, остаётся ${this._volume}`);
      return;
    }
    this._volume = value;
  },

  get status() {
    const track = this.currentTrack;
    if (!track) return 'Плейлист пуст';
    const state = this.isPlaying ? '▶ Играет' : '⏸ Пауза';
    return `${state}: «${track.title}» — ${track.artist}, громкость ${this.volume}%`;
  },

  play() {
    if (!this.currentTrack) return;
    this.isPlaying = true;
  },

  pause() {
    this.isPlaying = false;
  },

  // Индекс меняется по кругу, массив tracks не трогаем
  next() {
    const count = this.tracks.length;
    if (count === 0) return;
    this._currentTrackIndex = (this._currentTrackIndex + 1) % count;
  },

  previous() {
    const count = this.tracks.length;
    if (count === 0) return;
    this._currentTrackIndex = (this._currentTrackIndex - 1 + count) % count;
  },
};

/* =====================================================================
 * Демонстрация
 * ===================================================================== */

function section(title) {
  console.log(`\n========== ${title} ==========`);
}

section('Задача 1. Товары');
const laptop = new Product(1, 'Ноутбук Lenovo', 2499.9, 'Электроника');
const mouse = new Product(2, 'Мышь Logitech', 59.5, 'Электроника');
const book = new Product(3, 'Выразительный JavaScript', 45, 'Книги');
[laptop, mouse, book].forEach((p) => console.log(p.getInfo()));

console.log('changePrice(2299):', laptop.changePrice(2299), '→', laptop.price);
console.log('changePrice(-10):', laptop.changePrice(-10), '→', laptop.price);
console.log('applyDiscount(10):', mouse.applyDiscount(10), '→', mouse.price);
console.log('applyDiscount(150):', mouse.applyDiscount(150), '→', mouse.price);
book.disable();
console.log(book.getInfo());
console.log('Данные независимы:', laptop.price !== mouse.price, '| методы — разные функции:', laptop.getInfo !== mouse.getInfo);

try {
  Product(4, 'Без new', 10, 'Тест');
} catch (error) {
  console.log('Вызов без new →', error.message);
}

section('Задача 2. Корзины');
const cartAnna = new ShoppingCart('Анна');
const cartIvan = new ShoppingCart('Иван');

cartAnna.addItem(laptop, 1);
cartAnna.addItem(mouse, 2);
cartAnna.addItem(mouse, 1); // тот же id → количество увеличится до 3
cartAnna.addItem(book, 1); // недоступен
cartAnna.addItem(mouse, 1.5); // некорректное количество
cartIvan.addItem(mouse, 1);

console.log('Анна:', cartAnna.getSummary());
console.log('Иван:', cartIvan.getSummary());
console.log('Корзины независимы:', cartAnna.items !== cartIvan.items);

cartAnna.changeQuantity(2, 2);
cartAnna.setDiscount(5);
cartAnna.setDiscount(120);
console.log('Анна без скидки:', cartAnna.getTotalBeforeDiscount(), cartAnna.currency);
console.log(`Анна со скидкой ${cartAnna.discount}%:`, cartAnna.getTotal(), cartAnna.currency);
console.log('removeItem(1):', cartAnna.removeItem(1), '→', cartAnna.getSummary());
console.log('Исходный товар не изменился:', mouse.getInfo());

section('Задача 3. Тарифы доставки');
const tariffs = [
  new DeliveryTariff('Белпочта', 5, 1.2, 30),
  new DeliveryTariff('Курьер', 12, 0.8, 20),
  new DeliveryTariff('Самовывоз', 0, 0, 1000),
];
[2.5, 25, -3].forEach((weight) => {
  tariffs.forEach((tariff) => console.log(tariff.getInfo(weight)));
});
console.log('calculate(25) у курьера:', tariffs[1].calculate(25));

section('Задача 4. Настройки интерфейса');
console.log(interfaceSettings.summary);
interfaceSettings.theme = 'dark';
interfaceSettings.fontSize = 18;
interfaceSettings.language = 'en';
interfaceSettings.theme = 'pink';
interfaceSettings.fontSize = 100;
interfaceSettings.language = 'fr';
console.log(interfaceSettings.summary);
console.log('cssClasses:', interfaceSettings.cssClasses.join(' '));
interfaceSettings.reset();
console.log('После reset():', interfaceSettings.summary);

section('Задача 5. Проигрыватель');
console.log(player.status);
player.play();
console.log(player.status);
player.next();
console.log(player.status);
player.next();
player.next(); // с последнего — на первый
console.log('После 3× next():', player.currentTrack.title);
player.previous(); // с первого — на последний
console.log('После previous():', player.currentTrack.title);
player.volume = 80;
player.volume = 150;
player.volume = 33.5;
player.pause();
console.log(player.status);
console.log('Массив треков не изменился:', player.tracks.map((t) => t.id).join(','));

section('Потеря this и bind');
const detachedNext = player.next;
try {
  detachedNext(); // метод отделён от объекта → this === undefined
} catch (error) {
  console.log('detachedNext() →', error.constructor.name + ':', error.message);
}
const boundNext = player.next.bind(player);
boundNext();
console.log('boundNext() работает, текущий трек:', player.currentTrack.title);
