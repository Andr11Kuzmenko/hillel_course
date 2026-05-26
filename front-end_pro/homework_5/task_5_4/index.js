const userNum = parseInt(prompt('Enter your num:'));
let counter = 0;

for (let i = 2; i <= Math.sqrt(userNum); i++) {
    if (!(userNum % i)) {
        counter++;
    }
}

console.log(`The number is ${counter ? 'not ' : ''}prime`);

