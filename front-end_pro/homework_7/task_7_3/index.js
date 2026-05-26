let lastInput;

for (let i = 0; i < 10; i++) {
    let userInput = prompt('Please enter a number greater than 100:');

    if (userInput) {
        lastInput = userInput;
        let tmp = parseFloat(userInput);

        if (isNaN(tmp) || tmp > 100) {
            break;
        }
    }
}

console.log(`Last input: ${lastInput}`);