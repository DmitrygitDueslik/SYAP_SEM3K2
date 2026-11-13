// Лабораторная работа №8. ООП

// ===== 1. Базовый класс медиаконтента =====
class MediaContent {
  static count = 0;
  #isAvailable;

  constructor(title, duration, audioPath) {
    if (typeof title !== 'string' || title.trim() === '') {
      throw new Error('Название не может быть пустым');
    }
    if (typeof duration !== 'number' || duration <= 0) {
      throw new Error('Продолжительность должна быть положительным числом');
    }
    MediaContent.count++;
    this.id = MediaContent.count; // id = номер объекта, поэтому всегда уникален
    this.title = title;
    this.duration = duration;
    this.audioPath = audioPath;
    this.#isAvailable = true;
  }

  get formattedDuration() {
    const minutes = String(Math.floor(this.duration / 60)).padStart(2, '0');
    const seconds = String(this.duration % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  }

  get isAvailable() {
    return this.#isAvailable;
  }

  set isAvailable(value) {
    if (typeof value !== 'boolean') {
      console.log('isAvailable должен быть true или false');
      return;
    }
    this.#isAvailable = value;
  }

  getInfo() {
    return `${this.title}, ${this.formattedDuration}`;
  }

  static getCreatedCount() {
    return MediaContent.count;
  }
}

// ===== 2. Композиции и подкасты =====
class Track extends MediaContent {
  constructor(title, duration, audioPath, artist, album, genre) {
    super(title, duration, audioPath);
    this.artist = artist;
    this.album = album;
    this.genre = genre;
  }

  getInfo() {
    return `Композиция: ${this.title} — ${this.artist}, ${this.formattedDuration}`;
  }
}

class PodcastEpisode extends MediaContent {
  constructor(title, duration, audioPath, author, podcastName, episodeNumber) {
    super(title, duration, audioPath);
    this.author = author;
    this.podcastName = podcastName;
    this.episodeNumber = episodeNumber;
  }

  getInfo() {
    return `Подкаст: ${this.podcastName}, выпуск ${this.episodeNumber} — ${this.title}`;
  }
}

// ===== 3. Плейлист =====
class Playlist {
  #items = [];

  constructor(id, title) {
    this.id = id;
    this.title = title;
  }

  addItem(item) {
    if (!(item instanceof MediaContent)) {
      console.log('В плейлист можно добавлять только MediaContent');
      return;
    }
    if (this.#items.includes(item)) {
      console.log(`"${item.title}" уже есть в плейлисте`);
      return;
    }
    this.#items.push(item);
  }

  removeItem(id) {
    this.#items = this.#items.filter((item) => item.id !== id);
  }

  findItem(id) {
    return this.#items.find((item) => item.id === id);
  }

  hasItem(id) {
    return this.#items.some((item) => item.id === id);
  }

  clear() {
    this.#items = [];
  }

  getTotalDuration() {
    return this.#items.reduce((sum, item) => sum + item.duration, 0);
  }

  get items() {
    return [...this.#items];
  }

  get itemsCount() {
    return this.#items.length;
  }
}

// ===== 4. Проигрыватель =====
class Player {
  #items = [];
  #currentIndex = 0;
  #volume = 50;
  #status = 'stopped';

  get currentItem() {
    return this.#items[this.#currentIndex];
  }

  get status() {
    return this.#status;
  }

  get volume() {
    return this.#volume;
  }

  set volume(value) {
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      console.log('Громкость должна быть целым числом от 0 до 100');
      return;
    }
    this.#volume = value;
    console.log(`Громкость: ${value}`);
  }

  loadPlaylist(playlist) {
    if (!(playlist instanceof Playlist)) {
      console.log('Можно загрузить только Playlist');
      return;
    }
    this.#items = playlist.items;
    this.#currentIndex = 0;
    this.#status = 'stopped';
    console.log(`Загружен плейлист "${playlist.title}"`);
  }

  play() {
    if (!this.currentItem) {
      console.log('Плейлист пуст');
      return;
    }
    this.#status = 'playing';
    console.log(`Играет: ${this.currentItem.getInfo()}`);
  }

  pause() {
    if (this.#status !== 'playing') {
      console.log('Сейчас ничего не играет');
      return;
    }
    this.#status = 'paused';
    console.log(`Пауза: ${this.currentItem.title}`);
  }

  next() {
    if (this.#items.length === 0) {
      console.log('Плейлист пуст');
      return;
    }
    this.#currentIndex = (this.#currentIndex + 1) % this.#items.length;
    console.log(`Следующий: ${this.currentItem.getInfo()}`);
  }

  previous() {
    if (this.#items.length === 0) {
      console.log('Плейлист пуст');
      return;
    }
    this.#currentIndex = (this.#currentIndex - 1 + this.#items.length) % this.#items.length;
    console.log(`Предыдущий: ${this.currentItem.getInfo()}`);
  }
}

// ===== Проверка =====
const t1 = new Track('Night Drive', 205, 'audio/1.mp3', 'Neon Lights', 'City Glow', 'Synthwave');
const t2 = new Track('Midnight City', 244, 'audio/2.mp3', 'M83', 'Hurry Up', 'Electronic');
const t3 = new Track('Instant Crush', 337, 'audio/3.mp3', 'Daft Punk', 'RAM', 'Electronic');
const t4 = new Track('Intro', 128, 'audio/4.mp3', 'The xx', 'xx', 'Indie');
const t5 = new Track('Clair de Lune', 302, 'audio/5.mp3', 'Debussy', 'Suite bergamasque', 'Classical');
const p1 = new PodcastEpisode('Как работает браузер', 1800, 'audio/6.mp3', 'Анна', 'Web Inside', 12);
const p2 = new PodcastEpisode('Что такое DOM', 1500, 'audio/7.mp3', 'Анна', 'Web Inside', 13);

console.log('Создано объектов:', MediaContent.getCreatedCount());

try {
  new Track('', 100, 'audio/8.mp3', 'X', 'Y', 'Z');
} catch (error) {
  console.log('Ошибка:', error.message);
}

console.log('--- Полиморфизм ---');
const all = [t1, t2, t3, t4, t5, p1, p2];
all.forEach((item) => console.log(item.getInfo()));

console.log('--- Приватные свойства ---');
t3.isAvailable = false;
console.log('t3 доступен:', t3.isAvailable);
console.log('Ключи объекта:', Object.keys(t3)); // #isAvailable не виден

console.log('--- Плейлисты ---');
const playlist1 = new Playlist(1, 'Вечерний');
const playlist2 = new Playlist(2, 'Для учёбы');
playlist1.addItem(t1);
playlist1.addItem(t2);
playlist1.addItem(t3);
playlist1.addItem(t4);
playlist1.addItem(t1); // повтор
playlist1.addItem('не медиа'); // не MediaContent
playlist2.addItem(t5);
playlist2.addItem(p1);
playlist2.addItem(p2);
playlist1.removeItem(3);
console.log(playlist1.title, '- элементов:', playlist1.itemsCount, ', длительность:', playlist1.getTotalDuration(), 'сек');
console.log(playlist2.title, '- элементов:', playlist2.itemsCount, ', длительность:', playlist2.getTotalDuration(), 'сек');
console.log('hasItem(3):', playlist1.hasItem(3), '| findItem(2):', playlist1.findItem(2).title);

console.log('--- Проигрыватель ---');
const player = new Player();
player.loadPlaylist(playlist1);
player.play();
player.next();
player.next();
player.next(); // с последнего на первый
player.previous();
player.pause();
player.volume = 80;
player.volume = 150; // некорректно
console.log('Статус:', player.status, '| громкость:', player.volume);
