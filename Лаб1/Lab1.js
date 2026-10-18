// //Задание 1
// alert("\nЗадание 1\n");


// let a = 5;
// alert(typeof a);

// let name = "Name";
// alert(typeof name);

// let i = 0;
// alert(typeof i);

// let double = 0.23;
// alert(typeof double);

// let result = 1 / 0;
// alert(typeof result);

// let answer = true;
// alert(typeof answer);

// let no = null;
// alert(typeof no);


// alert("\nЗадание 2\n");

// //Задание 2

// let sideB = 5;
// let widthA = 45;
// let heightA = 21;

// let countByWidth = widthA / sideB;
// let countByHeight = Math.floor(heightA / sideB);

// let totalcount = countByHeight * countByWidth;

// alert(totalcount);

// alert("\nЗадание 3\n");

// //Задание 3

// let i_2=prompt("Введите");

// let a_2 = ++i_2;
// let b = i_2++;

// alert(i_2);

// alert(a_2 == b);

// alert("\nЗадание 4\n");
// //Задание 4
// alert("Котик" > "котик" ? true : false);
// alert("Котик" > "китик" ? true : false);
// alert("Кот" > "Котик" ? true : false);
// alert("Привет" > "Пока" ? true : false);
// alert(73 > "53" ? true : false);
// alert(false>0?true:false);
// alert(54>true?true:false);
// alert(123>false?true:false);
// alert(true>"3"?true:false);
// alert(3>"5mm"?true:false);
// alert(8>"-2"?true:false);
// alert(34>"34"?true:false);
// alert(null>undefined?true:false);

// //Задание 5

// alert("\nЗадание 5\n");

// const NameTeacher="Кудлацкая Марина Фёдоровна";
// const userInput = prompt("Пожалуйста, введите ваше имя или ФИО:");
// const LowerInput=userInput.toLowerCase();
// const lowerCaseTeacher=NameTeacher.toLowerCase();

// const teacherComponents = lowerCaseTeacher.split(" ");
// const userWords = LowerInput.split(" ");

// let find=false;
// for(const userWord of userWords){
//     if(teacherComponents.includes(userWord))
//         {
//             find=true;
//             break;
//     }
// }
// if(find){
//     alert("Данные верные");
// }else{
//     alert("Данные неверные");
// }



// //Задание 6
// alert("Задание 6");

// let exam_1=prompt("Сдал ли студент экз по рускому? (ДА = '+',НЕТ = '-') ");
// let exam_2=prompt("Сдал ли студент экз по математике? (ДА = '+',НЕТ = '-') ");
// let exam_3=prompt("Сдал ли студент экз по английсеий? (ДА = '+',НЕТ = '-') ");

// if(exam1=="+" && exam_2=="+"&& exam_3=="+"){
//     alert("Студен переведен на следующий курс");
// }else if(exam_1=="-"&& exam_2=="-"&& exam_3=="-"){
//     alert("Студент отчислен");
// }else if(exam_1=="-" || exam_2=="-" || exam_3=="-"){
//     alert("Студент отправлен на пересдачу");
// }

// //Задание 7

// alert("Задание 7");

// alert(true+true);
// alert(0+"5");
// alert(5+"мм");
// alert(8/Infinity);
// alert(9*"\n9");
// alert(null-1);
// alert("5"-2);
// alert("5px"-3);
// alert(true-3);
// alert(7||0);

// //Задание 8
// alert("Задание 8");
// let massive=[1,2,3,4,5,6,7,8,9,10];
// for( let i=0;i<massive.length;i++){
//     if(massive[i]%2==0){
//         massive[i]+=2;
//     }else massive[i]+="мм";
//     alert(massive[i]);
// }

// //Задание 9
// alert("Задание 9");
// const Days={
//     1:"MONDAY",
//     2:"THUESDAY",
//     3:"WEDNESDAY",
//     4:"THURDAY",
//     5:"FRIDAY",
//     6:"SATURDAY",
//     7:"SUNDAY"
// };
// const userDay=prompt("Введите ваш день(цифра 1,2...7)");
// if(Days[userDay]){
//     alert("Ваш день "+Days[userDay]);
// }else{
//     alert("Такого дня нету");
// }


// //Задание 10
// alert("Задание 10");

// function getThreeParm(parm1 = 5, parm2="future", userparm = prompt("Введите ваш параметр")) {
//     return String(parm1) + String(parm2) + String(userparm);
// }

// alert(getThreeParm());



// //Задание 11

// alert("Задание 11");
// function paramsDeclaration(a,b){
//     if(a===b){
//        return 4*a;
//     }else{
//         return a*b;
//     }
// }

// const paramsExpression=function(a,b){
//     if(a===b){
//         return 4*a;
//     }else{
//         return a*b;
//     }
// }

// const paramsArrow=(a,b)=>(a===b?4*a:a*b);

// const sideA12 = parseFloat(prompt("Введите сторону A:"));
// const sideB12 = parseFloat(prompt("Введите сторону B:"));
// const shape = sideA12 === sideB12 ? "квадрат" : "прямоугольник";
// const metric = sideA12 === sideB12 ? "периметр" : "площадь";

// alert("Это " + shape + ", его " + metric + " (Declaration): " + paramsDeclaration(sideA12, sideB12));
// alert("Это " + shape + ", его " + metric + " (Expression): " + paramsExpression(sideA12, sideB12));
// alert("Это " + shape + ", его " + metric + " (Arrow): " + paramsArrow(sideA12, sideB12));

alert(5>3 || 6>7);
alert(0 ?? 10);
