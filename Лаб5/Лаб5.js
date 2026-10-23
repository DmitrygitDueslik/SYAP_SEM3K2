function debounce(callback, delay) {
    let timerId;

    return function (...args) {
       clearTimeout(timerId);
        timerId = setTimeout(() => {
            callback(...args);
        }, delay);

    }
}

function searchEvents(query) {
    console.log(`Выполняется поиск: ${query}`);
}


const searchInput = document.querySelector('#search');

const handleSearch = debounce(searchEvents, 500);

searchInput.addEventListener('input', (event) => {
    handleSearch(event.target.value);
});


//Задача 2 --------------------------------


function once(callback) {
    let flag = false;
    let result;
    return function (...args) {
        if (!flag) {
            flag = true;
            result = callback(...args);
        }
        return result;
    }
}

function sumbitForm() {
    console.log(`Форма отправлена`);
}
const submitOnce = once(sumbitForm);

submitOnce();
submitOnce();
submitOnce();

const initialize = once(() => {
    return 'Приложение инициализировано';
});

console.log(initialize());
// 'Приложение инициализировано'

console.log(initialize());
// 'Приложение инициализировано'


//Задание 3 --------------------------------------


function filterBy(property) {
    return (value) => {
        return (items) => {
            return items.filter((item) => item[property] === value)
        }
    }
}


const events = [
    {
        id: 1,
        title: 'JavaScript Meetup',
        category: 'education',
        isActive: true,
    },
    {
        id: 2,
        title: 'University Run',
        category: 'sport',
        isActive: false,
    },
    {
        id: 3,
        title: 'React Workshop',
        category: 'education',
        isActive: true,
    },
];

const filterByCategory = filterBy('category');
const filterEducationEvents = filterByCategory('education');

console.log(events);
console.log(filterEducationEvents(events));


//Задание 4 --------------------------------------

const users = [
    'Анна',
    'Иван',
    'Мария',
    'Алексей',
    'Ольга',
    'Максим',
    'Елена',
];


function* createBatches(items, batchSize) {
   if (!Number.isInteger(batchSize) || batchSize <= 0) {
    throw new Error('batchSize должен быть положительным целым числом');   // ✓
    }
    for (let i = 0; i < items.length; i += batchSize) {
        yield items.slice(i, i + batchSize);
    }
}

const batches = createBatches(users, 3);
console.log(batches.next());
console.log(batches.next());
console.log(batches.next());
console.log(batches.next());

//Задание 5 -------------------------

function createRegistrationHandler(eventId,callback){
    return function(event){
        callback(eventId,event);
    }
}


function registerForEvent(eventId, event) {
    console.log(`Регистрация на мероприятие ${eventId}`);
    if (event) {
        console.log('Тип события:', event.type);
    }
}

const handleFirstEvent = createRegistrationHandler(
  101,
  registerForEvent
);

const handleSecondEvent = createRegistrationHandler(
  205,
  registerForEvent
);
handleFirstEvent();
// 'Регистрация на мероприятие 101'

handleSecondEvent();
// 'Регистрация на мероприятие 205'
const button = document.querySelector('#register-button');

button.addEventListener(
  'click',
  createRegistrationHandler(101, registerForEvent)
);
