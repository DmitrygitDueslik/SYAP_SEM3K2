'use strict';

/* =====================================================================
 * Лабораторная работа №8. ООП: модель музыкального стримингового сервиса
 * Запуск: node lab8.js   (или подключить в HTML и смотреть консоль)
 * ===================================================================== */

// ---------- Вспомогательные функции ----------

const isNonEmptyString = (value) => typeof value === 'string' && value.trim() !== '';
const isPositiveNumber = (value) =>
  typeof value === 'number' && Number.isFinite(value) && value > 0;

function requireString(value, fieldName, className) {
  if (!isNonEmptyString(value)) {
    throw new TypeError(`${className}: поле "${fieldName}" должно быть непустой строкой`);
  }
  return value.trim();
}

// 205 → "03:25", 3725 → "1:02:05"
function formatDuration(totalSeconds) {
  const seconds = Math.round(totalSeconds);
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const pad = (n) => String(n).padStart(2, '0');
  return h > 0 ? `${h}:${pad(m)}:${pad(s)}` : `${pad(m)}:${pad(s)}`;
}

/* =====================================================================
 * 1. Базовый класс медиаконтента
 * ===================================================================== */

class MediaContent {
  // Приватное статическое поле: доступно только внутри класса MediaContent
  static #createdCount = 0;

  #id;
  #title;
  #duration;
  #audioPath;
  #isAvailable;

  constructor({ title, duration, audioPath, isAvailable = true } = {}) {
    // Сначала проверяем всё, и только потом меняем состояние:
    // если данные плохие, объект не создастся и счётчик не увеличится
    const cleanTitle = requireString(title, 'title', 'MediaContent');
    if (!isPositiveNumber(duration)) {
      throw new RangeError('MediaContent: duration должен быть положительным числом (секунды)');
    }
    const cleanPath = requireString(audioPath, 'audioPath', 'MediaContent');
    if (typeof isAvailable !== 'boolean') {
      throw new TypeError('MediaContent: isAvailable должен быть boolean');
    }

    // Обращаемся именно к MediaContent.#createdCount, а не this.constructor.#createdCount:
    // у дочерних классов (Track) этого приватного поля нет
    MediaContent.#createdCount += 1;
    this.#id = MediaContent.#createdCount; // уникальный id = порядковый номер объекта
    this.#title = cleanTitle;
    this.#duration = duration;
    this.#audioPath = cleanPath;
    this.#isAvailable = isAvailable;
  }

  // Только геттеры → свойства доступны снаружи лишь для чтения
  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  get duration() {
    return this.#duration;
  }

  get audioPath() {
    return this.#audioPath;
  }

  get formattedDuration() {
    return formatDuration(this.#duration);
  }

  get isAvailable() {
    return this.#isAvailable;
  }

  set isAvailable(value) {
    if (typeof value !== 'boolean') {
      throw new TypeError('isAvailable: ожидается true или false');
    }
    this.#isAvailable = value;
  }

  getInfo() {
    return `Медиа: ${this.title}, ${this.formattedDuration}`;
  }

  static getCreatedCount() {
    return MediaContent.#createdCount;
  }
}

/* =====================================================================
 * 2. Дочерние классы
 * ===================================================================== */

class Track extends MediaContent {
  #artist;
  #album;
  #genre;

  constructor({ artist, album, genre, ...mediaData } = {}) {
    // Проверка своих полей до super(): this здесь ещё использовать нельзя,
    // а обычные переменные — можно. Так невалидный трек не увеличит счётчик.
    const cleanArtist = requireString(artist, 'artist', 'Track');
    const cleanAlbum = requireString(album, 'album', 'Track');
    const cleanGenre = requireString(genre, 'genre', 'Track');

    super(mediaData); // родитель создаёт this и заполняет общие поля

    this.#artist = cleanArtist;
    this.#album = cleanAlbum;
    this.#genre = cleanGenre;
  }

  get artist() {
    return this.#artist;
  }

  get album() {
    return this.#album;
  }

  get genre() {
    return this.#genre;
  }

  getInfo() {
    return `Композиция: ${this.title} — ${this.artist}, ${this.formattedDuration}`;
  }
}

class PodcastEpisode extends MediaContent {
  #author;
  #podcastName;
  #episodeNumber;

  constructor({ author, podcastName, episodeNumber, ...mediaData } = {}) {
    const cleanAuthor = requireString(author, 'author', 'PodcastEpisode');
    const cleanPodcast = requireString(podcastName, 'podcastName', 'PodcastEpisode');
    if (!Number.isInteger(episodeNumber) || episodeNumber <= 0) {
      throw new RangeError('PodcastEpisode: episodeNumber должен быть целым положительным числом');
    }

    super(mediaData);

    this.#author = cleanAuthor;
    this.#podcastName = cleanPodcast;
    this.#episodeNumber = episodeNumber;
  }

  get author() {
    return this.#author;
  }

  get podcastName() {
    return this.#podcastName;
  }

  get episodeNumber() {
    return this.#episodeNumber;
  }

  getInfo() {
    return `Подкаст: ${this.podcastName}, выпуск ${this.episodeNumber} — ${this.title}`;
  }
}

/* =====================================================================
 * 3. Плейлист
 * ===================================================================== */

class Playlist {
  static #nextId = 1;

  #id;
  #title;
  #items = [];

  constructor(title) {
    this.#title = requireString(title, 'title', 'Playlist');
    this.#id = Playlist.#nextId;
    Playlist.#nextId += 1;
  }

  get id() {
    return this.#id;
  }

  get title() {
    return this.#title;
  }

  // Копия массива: внешний код не может сделать push/splice во внутренний #items
  get items() {
    return [...this.#items];
  }

  get itemsCount() {
    return this.#items.length;
  }

  addItem(item) {
    if (!(item instanceof MediaContent)) {
      throw new TypeError(`Playlist «${this.#title}»: можно добавлять только экземпляры MediaContent`);
    }
    if (this.hasItem(item.id)) {
      console.log(`  ✗ «${item.title}» уже есть в плейлисте «${this.#title}»`);
      return false;
    }
    this.#items.push(item);
    return true;
  }

  removeItem(id) {
    const index = this.#items.findIndex((item) => item.id === id);
    if (index === -1) {
      console.log(`  ✗ Элемента с id=${id} нет в плейлисте «${this.#title}»`);
      return false;
    }
    this.#items.splice(index, 1);
    return true;
  }

  findItem(id) {
    return this.#items.find((item) => item.id === id) ?? null;
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
}

/* =====================================================================
 * 4. Проигрыватель
 * ===================================================================== */

class Player {
  static STATUS = Object.freeze({ STOPPED: 'stopped', PLAYING: 'playing', PAUSED: 'paused' });
  static #STATUS_LABELS = Object.freeze({ stopped: '⏹ Остановлен', playing: '▶ Играет', paused: '⏸ Пауза' });

  #queue = [];
  #currentIndex = -1;
  #volume = 50;
  #status = Player.STATUS.STOPPED;

  get currentItem() {
    return this.#queue[this.#currentIndex] ?? null;
  }

  get status() {
    return this.#status;
  }

  get volume() {
    return this.#volume;
  }

  set volume(value) {
    if (!Number.isInteger(value) || value < 0 || value > 100) {
      throw new RangeError(`Громкость должна быть целым числом от 0 до 100, получено: ${value}`);
    }
    this.#volume = value;
    console.log(`🔊 Громкость: ${value}%`);
  }

  loadPlaylist(playlist) {
    if (!(playlist instanceof Playlist)) {
      throw new TypeError('loadPlaylist: ожидается экземпляр Playlist');
    }
    this.#queue = playlist.items; // геттер уже вернул копию
    this.#status = Player.STATUS.STOPPED;
    this.#currentIndex = this.#queue.length > 0 ? 0 : -1;
    console.log(`📂 Загружен плейлист «${playlist.title}», элементов: ${this.#queue.length}`);
  }

  play() {
    const item = this.currentItem;
    if (!item) {
      console.log('  ✗ Нечего воспроизводить: плейлист не загружен или пуст');
      return false;
    }
    if (!item.isAvailable) {
      console.log(`  ✗ «${item.title}» недоступен для воспроизведения`);
      return false;
    }
    if (this.#status === Player.STATUS.PLAYING) {
      console.log(`  (уже играет: ${item.getInfo()})`);
      return true;
    }
    this.#status = Player.STATUS.PLAYING;
    console.log(`▶ Воспроизведение: ${item.getInfo()} [${item.audioPath}]`);
    return true;
  }

  pause() {
    if (this.#status !== Player.STATUS.PLAYING) {
      console.log('  ✗ Пауза невозможна: сейчас ничего не играет');
      return false;
    }
    this.#status = Player.STATUS.PAUSED;
    console.log(`⏸ Пауза: ${this.currentItem.title}`);
    return true;
  }

  next() {
    return this.#switchTo(1);
  }

  previous() {
    return this.#switchTo(-1);
  }

  describe() {
    const item = this.currentItem;
    const what = item ? item.getInfo() : '—';
    return `${Player.#STATUS_LABELS[this.#status]} | ${what} | громкость ${this.#volume}%`;
  }

  // Общая логика next/previous: по кругу, пропуская недоступные элементы
  #switchTo(step) {
    const count = this.#queue.length;
    if (count === 0) {
      console.log('  ✗ Переключение невозможно: очередь пуста');
      return false;
    }
    for (let shift = 1; shift <= count; shift += 1) {
      const index = (((this.#currentIndex + step * shift) % count) + count) % count;
      if (this.#queue[index].isAvailable) {
        this.#currentIndex = index;
        const verb = this.#status === Player.STATUS.PLAYING ? '▶ Сейчас играет' : '⏭ Выбрано';
        console.log(`${verb}: ${this.currentItem.getInfo()}`);
        return true;
      }
    }
    this.#status = Player.STATUS.STOPPED;
    console.log('  ✗ В очереди нет доступных элементов');
    return false;
  }
}

/* =====================================================================
 * Демонстрация
 * ===================================================================== */

function section(title) {
  console.log(`\n========== ${title} ==========`);
}

section('Создание объектов через new');
const tracks = [
  new Track({ title: 'Night Drive', artist: 'Neon Lights', album: 'City Glow', genre: 'Synthwave', duration: 205, audioPath: 'audio/night-drive.mp3' }),
  new Track({ title: 'Midnight City', artist: 'M83', album: 'Hurry Up, We\'re Dreaming', genre: 'Electronic', duration: 244, audioPath: 'audio/midnight-city.mp3' }),
  new Track({ title: 'Instant Crush', artist: 'Daft Punk', album: 'Random Access Memories', genre: 'Electronic', duration: 337, audioPath: 'audio/instant-crush.mp3' }),
  new Track({ title: 'Intro', artist: 'The xx', album: 'xx', genre: 'Indie', duration: 128, audioPath: 'audio/intro.mp3' }),
  new Track({ title: 'Clair de Lune', artist: 'Claude Debussy', album: 'Suite bergamasque', genre: 'Classical', duration: 302, audioPath: 'audio/clair-de-lune.mp3' }),
];
const podcasts = [
  new PodcastEpisode({ title: 'Как работает браузер', author: 'Анна Смирнова', podcastName: 'Web Inside', episodeNumber: 12, duration: 2710, audioPath: 'audio/web-inside-12.mp3' }),
  new PodcastEpisode({ title: 'Event Loop без магии', author: 'Анна Смирнова', podcastName: 'Web Inside', episodeNumber: 13, duration: 3725, audioPath: 'audio/web-inside-13.mp3' }),
];
console.log('Создано объектов:', MediaContent.getCreatedCount());

section('Проверка входных данных в конструкторе');
const invalidInputs = [
  { title: '   ', artist: 'X', album: 'Y', genre: 'Z', duration: 100, audioPath: 'a.mp3' },
  { title: 'Bad', artist: 'X', album: 'Y', genre: 'Z', duration: -5, audioPath: 'a.mp3' },
  { title: 'Bad', artist: '', album: 'Y', genre: 'Z', duration: 100, audioPath: 'a.mp3' },
];
invalidInputs.forEach((data) => {
  try {
    new Track(data);
  } catch (error) {
    console.log(`  ${error.constructor.name}: ${error.message}`);
  }
});
console.log('Счётчик не изменился:', MediaContent.getCreatedCount());

section('Полиморфизм: getInfo() без проверки класса');
const library = [...tracks, ...podcasts];
library.forEach((item) => console.log(item.getInfo()));

section('instanceof');
console.log('tracks[0] instanceof Track:', tracks[0] instanceof Track);
console.log('tracks[0] instanceof MediaContent:', tracks[0] instanceof MediaContent);
console.log('podcasts[0] instanceof Track:', podcasts[0] instanceof Track);

section('Приватные свойства и геттеры');
const sample = tracks[0];
console.log('Object.keys(track):', Object.keys(sample), '— приватные поля не видны');
console.log('formattedDuration (геттер без скобок):', sample.formattedDuration);
try {
  sample.title = 'Взлом'; // сеттера нет → в strict mode TypeError
} catch (error) {
  console.log('Запись в title без сеттера →', error.constructor.name);
}
try {
  sample.isAvailable = 'да';
} catch (error) {
  console.log('isAvailable = "да" →', error.message);
}
// sample.#title  ← такая строка даже не скомпилируется: SyntaxError вне класса
console.log('Статический метод через объект:', typeof sample.getCreatedCount, '| через класс:', MediaContent.getCreatedCount());

section('Плейлисты: добавление и удаление');
const evening = new Playlist('Вечерний драйв');
const study = new Playlist('Для учёбы');

tracks.slice(0, 4).forEach((track) => evening.addItem(track));
evening.addItem(tracks[0]); // повтор
study.addItem(tracks[4]);
podcasts.forEach((episode) => study.addItem(episode));

try {
  evening.addItem({ title: 'Подделка', duration: 100 });
} catch (error) {
  console.log(`  ${error.constructor.name}: ${error.message}`);
}

[evening, study].forEach((playlist) => {
  console.log(`«${playlist.title}» (id=${playlist.id}): ${playlist.itemsCount} шт., ${formatDuration(playlist.getTotalDuration())}`);
});

const copy = evening.items;
copy.push(tracks[4]);
console.log('Изменение копии items не влияет на плейлист:', evening.itemsCount);

console.log('findItem(3):', evening.findItem(3)?.getInfo());
console.log('hasItem(4):', evening.hasItem(4));
console.log('removeItem(4):', evening.removeItem(4), '→ hasItem(4):', evening.hasItem(4));
evening.removeItem(999);

section('Проигрыватель');
const player = new Player();
player.play(); // плейлист ещё не загружен
player.loadPlaylist(evening);
player.play();
player.next();
tracks[2].isAvailable = false; // трек «Instant Crush» снят с публикации
player.next(); // пропускает недоступный и по кругу уходит на первый
player.previous(); // с первого назад: снова пропускает недоступный
player.pause();
console.log(player.describe());

player.volume = 75;
[150, 33.3].forEach((value) => {
  try {
    player.volume = value;
  } catch (error) {
    console.log(`  ${error.constructor.name}: ${error.message}`);
  }
});

player.loadPlaylist(study);
player.play();
player.next();
console.log(player.describe());

study.clear();
console.log('После clear() в плейлисте:', study.itemsCount, '— у плеера своя копия очереди:', player.currentItem?.title);
