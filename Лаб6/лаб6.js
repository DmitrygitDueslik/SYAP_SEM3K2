        
        
console.log('----------------------- Задача 1 -----------------------');

function showLocation(latitude,longitude,altitude=0){
      console.log(`Координаты: ${latitude}, ${longitude}. Высота: ${altitude} м.`);
}

{
  const coordinates = [53.902284, 27.561831, 215];

const [latitude,longitude,altitude=0]=coordinates;
console.log('latitude:', latitude);
  console.log('longitude:', longitude);
  console.log('altitude:', altitude);

  showLocation(...coordinates)
}
{
    const coordinates = [53.902284, 27.561831];
 
  const [latitude, longitude, altitude = 0] = coordinates;
  console.log('latitude:', latitude);
  console.log('longitude:', longitude);
  console.log('altitude:', altitude);
 
  showLocation(...coordinates);
}


console.log('\n----------------------- Задача 2 -----------------------');

const user = {
  id: 17,
  firstName: 'Анна',
  lastName: 'Ковалева',
  email: 'anna@example.com',
  role: 'student',
  isActive: true,
};

const{
    id: userId,
    firstName:name,
    lastName:surname,
    avatar='default-avatar.png',
    ...userDetails
}=user;

console.log('userId:', userId);           
console.log('name:', name);               
console.log('surname:', surname);        
console.log('avatar:', avatar);          
console.log('userDetails:', userDetails); 

const admin={
    ...user,
    role:'admin ',
    permissions: ['read','create','edit'],
};

console.log('user',user);
console.log('admin',admin);
console.log('user не изменён:',user.role==='student' && !('remissions' in user));

console.log('\n----------------------- Задача 3 -----------------------');

const event = {
  id: 101,
  title: 'Frontend Meetup',
  category: 'education',
  location: {
    building: {
      name: 'Главный корпус',
      address: {
        city: 'Минск',
        street: 'ул. Свердлова',
        buildingNumber: '13а',
      },
    },
    room: {
      number: '305',
      floor: 3,
    },
  },
  schedule: {
    date: '2026-10-15',
    time: {
      start: '18:00',
      end: '20:30',
    },
  },
  organizer: {
    profile: {
      firstName: 'Мария',
      lastName: 'Соколова',
      contacts: {
        email: 'maria@example.com',
        phone: '+375291234567',
      },
    },
  },
  participants: [
    { id: 1, name: 'Анна', status: 'confirmed' },
    { id: 2, name: 'Иван', status: 'waiting' },
    { id: 3, name: 'Ольга', status: 'confirmed' },
  ],
};
 
const {
  id: eventId,
  title,
  location: {
    building: {
      name: buildingName,
      address: { city, street, buildingNumber },
    },
    room: { number: roomNumber, floor },
  },
  schedule: {
    date,
    time: { start, end },
  },
  organizer: {
    profile: {
      firstName: organizerFirstName,
      lastName: organizerLastName,
      contacts: { email: organizerEmail },
    },
  },
  participants,
} = event;

console.log('eventId:', eventId, '| title:', title);
console.log('Корпус:', buildingName);
console.log('Адрес:', city, street, buildingNumber);
console.log('Аудитория:', roomNumber, '| этаж:', floor);
console.log('Дата:', date, '| время:', start, '-', end);
console.log('Организатор:', organizerFirstName, organizerLastName, organizerEmail);
console.log('Участники:', participants);

const[year,month,day]=date.split('-');
const formattedDate = `${day}.${month}.${year}`;

const eventInfo =
  `${title} пройдёт ${formattedDate} с ${start} до ${end} ` +
  `по адресу: ${city}, ${street}, ${buildingNumber}, ${buildingName}, ` +
  `аудитория ${roomNumber}. Организатор: ${organizerFirstName} ${organizerLastName}.`;
 
console.log(eventInfo);

const confirmedNames=participants.filter(({status})=>status==='confirmed').map((name)=>name);
console.log('Подтвердили участие:', confirmedNames); 



console.log('\n----------------------- Задача 4 -----------------------');


const profile = {
  id: 7,
  name: 'Ирина',
  settings: {
    theme: 'light',
    language: 'ru',
    notifications: {
      email: true,
      push: true,
      sms: false,
    },
  },
};


const updatedProfile={
    ...profile,
    name:'Ирина Петрова',
    settings:{
        ...profile.settings,
        theme:'dark',
        notifications:{
            ...profile.settings.notifications,
            push:'false',
        },
    },
};

console.log('profile.name:', profile.name);                                         
console.log('profile.settings.theme:', profile.settings.theme);                     
console.log('profile push:', profile.settings.notifications.push);                  
console.log('settings — разные объекты:', profile.settings !== updatedProfile.settings);
console.log(
  'notifications — разные объекты:',
  profile.settings.notifications !== updatedProfile.settings.notifications
); 

console.log('\n----------------------- Задача 5 -----------------------');


const events = [
  {
    id: 1,
    title: 'JavaScript Meetup',
    category: 'education',
    participants: 35,
  },
  {
    id: 2,
    title: 'University Run',
    category: 'sport',
    participants: 48,
  },
];


const newEvent = {
  id: 3,
  title: 'Design Workshop',
  category: 'education',
  participants: 20,
};


const eventsWithNewEvent=[...events,newEvent];


function updateEvent(events,eventId,changes){
    return events.map((event)=>
    event.id===eventId?{...event,...changes}:event);
}

const updatedEvents = updateEvent(
  eventsWithNewEvent,
  2,
  {
    title: 'Autumn University Run',
    participants: 55,
  }
);

console.log('events:', events);                         
console.log('eventsWithNewEvent:', eventsWithNewEvent); 
console.log('updatedEvents:', updatedEvents);           
 
// Проверки
console.log('Новый массив:', updatedEvents !== eventsWithNewEvent);                   
console.log('Исходный объект не изменён:', eventsWithNewEvent[1].title === 'University Run'); 
console.log('Обновлённый объект — новый:', updatedEvents[1] !== eventsWithNewEvent[1]); 
console.log('Остальные объекты те же:', updatedEvents[0] === eventsWithNewEvent[0]);


console.log('\n----------------------- Задача 6 -----------------------');
 
function calculateAverage(...values) {
  if (values.length === 0) {
    return 'Некорректные данные';
  }
 
  const allNumbers = values.every(
    (value) => typeof value === 'number' && isFinite(value)
  );
  if (!allNumbers) {
    return 'Некорректные данные';
  }
 
  const sum = values.reduce((total, value) => total + value, 0);
  return sum / values.length;
}
console.log(calculateAverage(8, 9, 10));     
console.log(calculateAverage(5, 7, 8, 10));  
console.log(calculateAverage());            
console.log(calculateAverage(5, '7', 8));    
console.log(calculateAverage(5, NaN));   

const grades=[6,8,9,10,7];
console.log(calculateAverage(...grades));


console.log('\n----------------------- Задача 7 -----------------------');



const data = {
  project: {
    info: {
      name: 'Digital Space',
      version: '2.4.0',
      authors: [
        {
          id: 1,
          profile: {
            name: 'Анна',
            contacts: {
              email: 'anna@example.com',
              social: {
                telegram: '@anna_dev',
              },
            },
          },
        },
        {
          id: 2,
          profile: {
            name: 'Иван',
            contacts: {
              email: 'ivan@example.com',
              social: {
                telegram: '@ivan_dev',
              },
            },
          },
        },
      ],
    },
    settings: {
      interface: {
        language: 'ru',
        theme: {
          name: 'dark',
          colors: {
            primary: '#6c5ce7',
          },
        },
      },
      features: {
        registration: true,
        notifications: true,
        analytics: false,
      },
    },
    statistics: {
      users: {
        total: 1250,
        activity: {
          today: 145,
          week: 684,
          month: 1027,
        },
      },
    },
  },
};

const{
    project:{
        info:{
            name:projectName,
            version,
            authors:[firstAuthor,...otherAuthors],
            authors:[
                {
                    profile:{
                        name:firstAuthorName,
                        contacts:{
                            email:firstAuthorEmail,
                            social:{telegram:firstAuthorTelegram},
                        },
                    },
                },
            ],
        },
        settings:{
            interface:{
                language,
                theme:{
                    name:themeName,
                    colors:{primary:primaryColor,secondary:secondaryColor='#ffffff'},
                },
            },
            features:{registration,notifications},
        },
        statistics:{
            users:{
                total:totalUsers,
                activity:{today:activeToday,week:activeWeek,month:activeMonth},
            },
        },
    },
}=data;


console.log('projectName:', projectName);                
console.log('version:', version);                        
console.log('firstAuthor:', firstAuthor);                
console.log('otherAuthors:', otherAuthors);              
console.log('firstAuthorName:', firstAuthorName);        
console.log('firstAuthorEmail:', firstAuthorEmail);       
console.log('firstAuthorTelegram:', firstAuthorTelegram); 
console.log('language:', language);                       
console.log('themeName:', themeName);                     
console.log('primaryColor:', primaryColor);              
console.log('secondaryColor:', secondaryColor);           
console.log('registration:', registration);               
console.log('notifications:', notifications);             
console.log('totalUsers:', totalUsers);                   
console.log('activeToday:', activeToday);                 
console.log('activeWeek:', activeWeek);                   
console.log('activeMonth:', activeMonth);   