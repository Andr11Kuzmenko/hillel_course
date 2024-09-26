userInputs = [];

for (let i = 0; i < 3; i++) {
    userInputs.push(prompt(`Please enter your text ${i + 1}:`));
}

alert(`Your text:\n${userInputs.join('\n')}`);