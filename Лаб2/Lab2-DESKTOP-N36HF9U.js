// function basicOperation(opretaion,value1,value2){
//     if(opretaion==='+')return value1+value2;
    
//     if(opretaion==='-')return value1-value2;
    
//     if(opretaion==='*')return value1+value2;
    
//     if(opretaion==='/')return value1+value2;


//     return undefined;//неизвестный оператор
// }

// let result=basicOperation('+',Number(prompt("Введите первое число")),Number(prompt("Введите второе число")));
// alert(result);

const Myf=(a)=>{
    let arr=[];
    for(let i=0;i<a.length;i++){
        arr+=a[i]+' ';
    }
    return arr;
}
console.log(Myf("Stroka"));

// //Задание 2

// function calculateSumOfCubes(n){
//     let sum=0;
//     for(let i=0;i<=n;i++){
//         sum+=i**3;
//     }
//     return sum;
// }
// console.log(calculateSumOfCubes(3));


// //Задание 3
// function getAverage(arr){
//     let sum=0;
//     for(let i=0;i<arr.length;i++){
//         sum+=arr[i];
//     }
//     return sum/arr.length;
// }
// console.log(getAverage([2,4,6,8,10]));



// //Задание 4
// function reverseEnglishOnly(str){
//     let EnglishLetters='';
//     for(let i=0;i<str.length;i++){
//         if(/[a-zA-Z]/.test(str[i])){
//             EnglishLetters+=str[i];
//         }
//     }
//     let reserved='';
//     for(let i=EnglishLetters.length-1;i>=0;i--){
//         reserved+=EnglishLetters[i];
//     }
//     return reserved;
// }
// console.log(reverseEnglishOnly("JavaScript"));      // "tpircSavaJ"
// console.log(reverseEnglishOnly("JavaScr53э? ipt")); // "tpircSavaJ"

// //Задание 5

// function repeatString(s,n){
//     let result='';
//     for(let i=0;i<n;i++){
//         result+=s;
//     }
//     return result;
// }
// console.log(repeatString("as/",4));

// //Задание 6

// function getArrayDiff(arr1,arr2){
//     let arr3=[];
//     for(let i=0;i<arr1.length;i++){
//         if(!arr2.includes(arr1[i])){
//             arr3.push(arr1[i]);
//         }
//     }
//     return arr3;
// }
// console.log(getArrayDiff(["a","b","c"],["b","d"]));