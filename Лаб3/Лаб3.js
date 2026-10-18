function mergeEventIds(firstSchedule, secondSchedule){
    let allGroups=firstSchedule.concat(secondSchedule);
    return allGroups.reduce((acc,group)=>acc.concat(group),[]);
}
const firstSchedule = [
  [101, 102],
  [103],
  [104, 105],
];

const secondSchedule = [
  [201],
  [202, 203],
];
console.log(mergeEventIds(firstSchedule, secondSchedule));



// ==================== Задание 2 ====================

function sumParticipants(participants){
   return participants.reduce((sum,item)=>{
    if(Array.isArray(item)){
        return sum+sumParticipants(item);
    }else{
        return sum+item;
    }
   },0);
}


const participants = [
  12,
  [5, 8],
  [3, [7, 10]],
  [],
];

console.log(sumParticipants(participants));


// ==================== Задание 3 ====================

function groupAvailableEvents(events){
    let available = events.filter(event => event.participants < event.capacity);

 return available.reduce((result, event) => {
        if (!result[event.category]) {
            result[event.category] = [];
        }
        result[event.category].push(event); 
        return result;
    }, {});
}

const events = [
  {
    title: 'Frontend Meetup',
    category: 'education',
    participants: 45,
    capacity: 60,
  },
  {
    title: 'Campus Run',
    category: 'sport',
    participants: 30,
    capacity: 30,
  },
  {
    title: 'JavaScript Workshop',
    category: 'education',
    participants: 18,
    capacity: 25,
  },
  {
    title: 'Music Evening',
    category: 'culture',
    participants: 70,
    capacity: 100,
  },
];

console.log(groupAvailableEvents(events));  


// ==================== Задание 4 ====================
function analyzeEventTitle(title){
    let cleanTitle=title.trim();
    let wordsWithEmpty=cleanTitle.split(' ');
    let words=wordsWithEmpty.filter(function(word){
        return word!=='';
    });


    let wordCount=words.length;
    let longestWord='';
    for(let i=0;i<words.length;i++){
        if(words[i].length>longestWord.length){
            longestWord=words[i];
        }
    }
     let totalLength = 0;
    for (let i = 0; i < words.length; i++) {
        totalLength += words[i].length;
    }
    let averageLength = totalLength / wordCount;

    return { wordCount, longestWord, averageLength };
}

console.log(analyzeEventTitle("  JavaScript   for modern interfaces  "));

// ==================== Задание 5 ====================
function mergeSettings(...setitngs){
return Object.assign({},...setitngs);
}

const defaultSettings = {
  theme: 'light',
  language: 'ru',
  pageSize: 10,
};

const userSettings = {
  theme: 'dark',
  pageSize: 20,
};

const sessionSettings = {
  language: 'en',
};

const result = mergeSettings(
  defaultSettings,
  userSettings,
  sessionSettings
);
const results = mergeSettings(defaultSettings, userSettings, sessionSettings);
console.log(results);


// ==================== Задание 6 ====================

function createStorageBar(used, limit, length){
    if(typeof used!=='number' || used<0){
                return 'Некорректные данные';
    }
    if (typeof limit !== 'number' || limit <= 0) {
        return 'Некорректные данные';
    }
    if (typeof length !== 'number' || length <= 0 || !Number.isInteger(length)) {
        return 'Некорректные данные';
    }
    if (used > limit) {
        return 'Некорректные данные';
    }
    let filledCount=Math.round((used/limit)*length);
    let emptyCount=length-filledCount;
    return '#'.repeat(filledCount)+'-'.repeat(emptyCount);
}


console.log(createStorageBar(25, 100, 10));
console.log(createStorageBar(50, 100, 10));
console.log(createStorageBar(100, 100, 10));

function createStorageReport(storages, length){
    let report=[];
    for(let i=0;i<storages.length;i++){
        let storage=storages[i];
        let bar=createStorageBar(storage.used,storage.limit,length);
        if(bar === 'Некорректные данные'){
            report.push(storage.user+': Некорректные данные');
        }else{
            let percent=Math.round((storage.used/storage.limit)*100);
            report.push(storage.user+': '+bar + ' '+ percent + '%');
        }
    }
    return report;
}

const storages = [
  {
    user: 'Анна',
    used: 45,
    limit: 60,
  },
  {
    user: 'Максим',
    used: 100,
    limit: 100,
  },
];
console.log(createStorageReport(storages, 10));