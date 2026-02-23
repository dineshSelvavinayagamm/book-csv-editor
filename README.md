# NestPatho-Web

Digital Pathology - Web layer repository

// 1. declare varibles and them into array
let a = 10;
let b= 20;
let c = 30;

const declareVariableNumbers = [a,b,c];
console.log(declareVariableNumbers,'Dclare Varibale Into Array');

// declare and initailize Directly in array
const directArraynumbers = [10, 20 ,30];
console.log(directArraynumbers, 'Dierectly ArrayNumbers');

// Add Variables using push
let arr = [];

let x = 10;
let y = 20;

arr.push(x);
arr.push(y);

console.log(arr, 'Add Variables using push');

// Store different data types
let name = "Dinesh";
let age = 28;
let isDeveloper = true;

const profile = [name,age, isDeveloper];
console.log(profile,'Store different data types');

//using spread operator
let spreadA = 1;
let spreadB = 2;

let speradArr = [...[spreadA,spreadB],3,4];
console.log(speradArr, "using seprad operator");

//using object variables inside array
let user1 = {id: 1, name: "Dinesh", age:27};
let user2 = {id: 2, name: "BAbu", age: 27};

let users = [user1, user2]
console.log(users,"using object variable inside array")
