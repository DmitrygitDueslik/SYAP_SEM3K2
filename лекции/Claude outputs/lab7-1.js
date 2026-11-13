// Лабораторная работа №7. Методы объектов и контекст вызова

// ===== Задача 1. Товары =====
function Product(id, title, price, category) {
  if (typeof price !== 'number' || price <= 0) {
    throw new Error('Цена должна быть положительным числом');
  }
  this.id = id;
  this.title = title;
  this.price = price;
  this.category = category;
  this.isAvailable = true;

  this.getInfo = function () {
    return `${this.title} (${this.category}) — ${this.price} BYN, ${this.isAvailable ? 'в наличии' : 'нет в наличии'}`;
  };

  this.changePrice = function (newPrice) {
    if (typeof newPrice !== 'number' || newPrice <= 0) {
      console.log('Некорректная цена');
      return;
    }
    this.price = newPrice;
  };

  this.applyDiscount = function (percent) {
    if (typeof percent !== 'number' || percent < 0 || percent > 100) {
      console.log('Скидка должна быть от 0 до 100');
      return;
    }
    this.changePrice(this.price - (this.price * percent) / 100);
  };

  this.disable = function () {
    this.isAvailable = false;
  };

  this.enable = function () {
    this.isAvailable = true;
  };
}

// ===== Задача 2. Корзины =====
function ShoppingCart(customerName) {
  this.customerName = customerName;
  this.currency = 'BYN';
  this.items = [];
  this.discount = 0;

  this.addItem = function (product, quantity) {
    if (!product.isAvailable) {
      console.log(`Товар "${product.title}" недоступен`);
      return;
    }
    if (!Number.isInteger(quantity) || quantity <= 0) {
      console.log('Количество должно быть целым положительным числом');
      return;
    }
    const item = this.items.find((i) => i.product.id === product.id);
    if (item) {
      item.quantity += quantity;
    } else {
      this.items.push({ product: product, quantity: quantity });
    }
  };

  this.removeItem = function (productId) {
    this.items = this.items.filter((i) => i.product.id !== productId);
  };

  this.changeQuantity = function (productId, quantity) {
    if (!Number.isInteger(quantity) || quantity <= 0) {
      console.log('Количество должно быть целым положительным числом');
      return;
    }
    const item = this.items.find((i) => i.product.id === productId);
    if (!item) {
      console.log(`Товара с id ${productId} нет в корзине`);
      return;
    }
    item.quantity = quantity;
  };

  this.setDiscount = function (percent) {
    if (typeof percent !== 'number' || percent < 0 || percent > 100) {
      console.log('Скидка должна быть от 0 до 100');
      return;
    }
    this.discount = percent;
  };

  this.getTotalBeforeDiscount = function () {
    return this.items.reduce((sum, i) => sum + i.product.price * i.quantity, 0);
  };

  this.getTotal = function () {
    const total = this.getTotalBeforeDiscount();
    return total - (total * this.discount) / 100;
  };

  this.getSummary = function () {
    return this.items.map(
      (i) => `${i.product.title} x ${i.quantity} = ${i.product.price * i.quantity} ${this.currency}`
    );
  };
}

// ===== Задача 3. Тарифы доставки =====
function DeliveryTariff(title, basePrice, pricePerKilogram, maxWeight) {
  this.title = title;
  this.basePrice = basePrice;
  this.pricePerKilogram = pricePerKilogram;
  this.maxWeight = maxWeight;

  this.canDeliver = function (weight) {
    return typeof weight === 'number' && weight > 0 && weight <= this.maxWeight;
  };

  this.calculate = function (weight) {
    if (!this.canDeliver(weight)) return null;
    const cost = this.basePrice + this.pricePerKilogram * weight;
    return cost < 0 ? 0 : cost;
  };

  this.getInfo = function (weight) {
    const cost = this.calculate(weight);
    if (cost === null) return `${this.title}: доставка ${weight} кг невозможна`;
    return `${this.title}: ${weight} кг — ${cost} BYN`;
  };
}

// ===== Задача 4. Настройки интерфейса =====
const interfaceSettings = {
  _theme: 'light',
  _fontSize: 16,
  _language: 'ru',

  get theme() {
    return this._theme;
  },
  set theme(value) {
    if (value !== 'light' && value !== 'dark') {
      console.log('Тема может быть только light или dark');
      return;
    }
    this._theme = value;
  },

  get fontSize() {
    return this._fontSize;
  },
  set fontSize(value) {
    if (!Number.isInteger(value) || value < 10 || value > 32) {
      console.log('Размер шрифта должен быть от 10 до 32');
      return;
    }
    this._fontSize = value;
  },

  get language() {
    return this._language;
  },
  set language(value) {
    if (value !== 'ru' && value !== 'en' && value !== 'be') {
      console.log('Язык может быть ru, en или be');
      return;
    }
    this._language = value;
  },

  get cssClasses() {
    return `theme-${this.theme} font-${this.fontSize} lang-${this.language}`;
  },

  get summary() {
    return `Тема: ${this.theme}, шрифт: ${this.fontSize}px, язык: ${this.language}`;
  },

  reset() {
    this.theme = 'light';
    this.fontSize = 16;
    this.language = 'ru';
  },
};

// ===== Задача 5. Музыкальный проигрыватель =====
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
    return this.tracks[this._currentTrackIndex];
  },

  get volume() {
    return this._volume;
  },
  set volume(value) {
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      console.log('Громкость должна быть целым числом от 0 до 100');
      return;
    }
    this._volume = value;
  },

  get status() {
    const state = this.isPlaying ? 'Играет' : 'Пауза';
    return `${state}: ${this.currentTrack.title} — ${this.currentTrack.artist}, громкость ${this.volume}`;
  },

  play() {
    this.isPlaying = true;
  },

  pause() {
    this.isPlaying = false;
  },

  next() {
    if (this._currentTrackIndex === this.tracks.length - 1) {
      this._currentTrackIndex = 0;
    } else {
      this._currentTrackIndex++;
    }
  },

  previous() {
    if (this._currentTrackIndex === 0) {
      this._currentTrackIndex = this.tracks.length - 1;
    } else {
      this._currentTrackIndex--;
    }
  },
};

// ===== Проверка =====
console.log('--- Задача 1 ---');
const laptop = new Product(1, 'Ноутбук', 2500, 'Электроника');
const mouse = new Product(2, 'Мышь', 60, 'Электроника');
const book = new Product(3, 'Книга по JS', 45, 'Книги');
laptop.changePrice(2300);
laptop.changePrice(-5); // цена не изменится
mouse.applyDiscount(10);
mouse.applyDiscount(150); // цена не изменится
book.disable();
try {
  new Product(4, 'Ошибка', -10, 'Тест');
} catch (error) {
  console.log('Ошибка:', error.message);
}
console.log(laptop.getInfo());
console.log(mouse.getInfo());
console.log(book.getInfo());

console.log('--- Задача 2 ---');
const cart1 = new ShoppingCart('Анна');
const cart2 = new ShoppingCart('Иван');
cart1.addItem(laptop, 1);
cart1.addItem(mouse, 2);
cart1.addItem(mouse, 1); // количество мыши станет 3
cart1.addItem(book, 1); // недоступна
cart2.addItem(mouse, 1);
cart1.changeQuantity(2, 2);
cart1.setDiscount(10);
console.log(cart1.getSummary());
console.log('Без скидки:', cart1.getTotalBeforeDiscount(), 'Со скидкой:', cart1.getTotal());
cart1.removeItem(1);
console.log('После удаления:', cart1.getSummary());
console.log('Корзина Ивана:', cart2.getSummary());

console.log('--- Задача 3 ---');
const post = new DeliveryTariff('Белпочта', 5, 1.5, 30);
const courier = new DeliveryTariff('Курьер', 10, 1, 20);
console.log(post.getInfo(4));
console.log(courier.getInfo(4));
console.log(courier.getInfo(25));
console.log(post.calculate(-2));

console.log('--- Задача 4 ---');
interfaceSettings.theme = 'dark';
interfaceSettings.fontSize = 20;
interfaceSettings.language = 'fr'; // останется ru
console.log(interfaceSettings.summary);
console.log(interfaceSettings.cssClasses);
interfaceSettings.reset();
console.log(interfaceSettings.summary);

console.log('--- Задача 5 ---');
player.play();
console.log(player.status);
player.next();
player.next();
player.next(); // с последнего на первый
console.log(player.currentTrack.title);
player.previous(); // с первого на последний
console.log(player.currentTrack.title);
player.volume = 80;
player.volume = 150; // останется 80
player.pause();
console.log(player.status);
