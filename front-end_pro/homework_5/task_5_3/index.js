const userNum = parseInt(prompt('Enter your num:'));

let i = 1;
while (i * i <= userNum && i <= 100) {
    console.log(`current num: ${i}; its sqr: ${i * i}`);
    i++;
}