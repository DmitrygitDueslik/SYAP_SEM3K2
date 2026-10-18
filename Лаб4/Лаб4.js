const categories=new Set();

function addCategory(category){
    categories.add(category);
}

function removeCategory(category){
    return categories.delete(category);
}

function hasCategory(category){
    return categories.has(category);
}

function getCategoriesCount(){
    return categories.size;
}

function getCategories(){
   let result=[];
    categories.forEach(category => {
        result.push(category);
    });
    return result.sort();
}

addCategory('Спорт');
addCategory('Образование');
addCategory('Развлечения');
addCategory('Спорт'); 
 
console.log(getCategories());           // [ 'Образование', 'Развлечения', 'Спорт' ]
console.log(getCategoriesCount());      // 3
console.log(hasCategory('Спорт'));      // true
removeCategory('Спорт');
console.log(hasCategory('Спорт'));      // false
console.log(getCategoriesCount());


console.log("==================== Задание 2 ====================");

console.log("\n");


const events = [
  {
    id: 1,
    title: 'Вечер настольных игр',
    category: 'Развлечения',
    participants: 24,
    isActive: true,
  },
  {
    id: 2,
    title: 'Frontend Meetup',
    category: 'Образование',
    participants: 40,
    isActive: true,
  },
  {
    id: 3,
    title: 'Осенний забег',
    category: 'Спорт',
    participants: 18,
    isActive: false,
  },
];


function findEventById(events,id){
    return events.find(event=>event.id===id);
}

function getActiveEvents(events){
    return events.filter(event=>event.isActive);
}

function filterByCategory(events,category){
    return events.filter(event=>event.category===category)
};

function hasEventsWithoutParticipants(events){
    return events.some(event=>event.participants===0);
}

function sortByParticipants(events){
    return [...events].sort((a,b)=>a.participants-b.participants);
}
//расшириение

function getEventTitles(events){
    return events.map(event=>event.title);
}

function getTotalParticipants(events){
    return events.reduce((sum,event)=>sum+event.participants,0);
}

console.log(findEventById(events, 2),"\n");
console.log(getActiveEvents(events),"\n");
console.log(filterByCategory(events, 'Спорт'),"\n");
console.log(hasEventsWithoutParticipants(events),"\n"); // false
console.log(sortByParticipants(events),"\n");
console.log(getEventTitles(events),"\n");
console.log(getTotalParticipants(events),"\n");



console.log("==================== Задание 3 ====================");


const registrations = new Map();

registrations.set(1, {
  title: 'Вечер настольных игр',
  participants: 2,
  price: 10,
});


function addRegistration(id,title,participants,price){
    if(registrations.has(id)){
        let registration = registrations.get(id);
        registration.participants += participants;
    }else{
        registrations.set(id,{title,participants,price});
    }
}

function hasRegistration(id) {
    return registrations.has(id);
}
 
function removeRegistration(id) {
    return registrations.delete(id);
}

function updateParticipants(id, participants){
    if(!registrations.has(id)){
        return false;
    }
    registrations.get(id).participants=participants;
    return true;
}

function updatePrice(id,price){
    if(!registrations.has(id)){
        return false;
    }
    registrations.get(id).price=price;
    return true;
}


function getRegistrationsCount() {
    return registrations.size;
}

function getTotalTickets(){
    let total=0;
    for(let registration of registrations.values()){
        total+=registration.participants;
    }
    return total;
}


function getTotalCost(){
    let total=0;
    for(let registration of registrations.values()){
        total+=registration.participants*registration.price;
    }
    return total;
}

function getRegistrationsCount() {
    return registrations.size;
}

addRegistration(2, 'Frontend Meetup', 3, 15);
addRegistration(1, 'Вечер настольных игр', 1, 10); // повтор: участников станет 3
 
console.log(registrations);
console.log(hasRegistration(2));       // true
console.log(getRegistrationsCount());  // 2
console.log(getTotalTickets());        // 3 + 3 = 6
console.log(getTotalCost());           // 3*10 + 3*15 = 75
 
updateParticipants(2, 5);
updatePrice(1, 12);
console.log(getTotalTickets());        // 3 + 5 = 8
console.log(getTotalCost());           // 3*12 + 5*15 = 111
 
removeRegistration(2);
console.log(hasRegistration(2));       // false
console.log(getRegistrationsCount());  // 1

console.log("==================== Задание 4 ====================");

const statistics = {
  education: 12,
  sport: 8,
  entertainment: 15,
};

const categoryNames={
     education: 'Образование',
  sport: 'Спорт',
  entertainment: 'Развлечения'
};

let keys=Object.keys(statistics);
console.log(keys);   

let values=Object.values(statistics);
console.log(values);

let lines=Object.entries(statistics).map(
    ([key,value])=>categoryNames[key]+": "+value
);
console.log(lines);


let total=Object.values(statistics).reduce((sum,value)=>sum+value,0);
console.log(total);

let popular=Object.fromEntries(
    Object.entries(statistics).filter(([key,value])=>value>10));
    console.log(popular);


    console.log("==================== Задание 5 ====================");

    const cache = new WeakMap();

    function getEventStatistics(event){
        if(cache.has(event)){
            console.log("Результат получен из кеша");
            return cache.get(event);
        }

        console.log("Выполняется расчет");
        let result={
            availablePlaces:event.capacity-event.participants,
            occupancyPercent: Math.round((event.participants/event.capacity)*100)
        };
        cache.set(event,result);
        return result;
    }

const event = {
  title: 'Вечер настольных игр',
  participants: 24,
  capacity: 40,
};
console.log(getEventStatistics(event));        // Выполняется расчёт
console.log(getEventStatistics(event));        // Результат получен из кеша
console.log(getEventStatistics({ ...event })); // Выполняется расчёт (новый объект)




let mapnew=new Map();
let first="Stroka";
let second=[1,2,3];
mapnew.set(first,second);
mapnew.set("Hello",[1,3,4,5]);
for(let value of mapnew.values()){
    for(let i=0;i<value.length;i++){
        console.log(value[i]);
    }
}
