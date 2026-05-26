function removeCharacters(userInputStr, chars) {
    for (let current_char of chars) {
        userInputStr = userInputStr.replaceAll(current_char, '');
    }

    return userInputStr;
}

const userInputStr = prompt('Type any words here: ');
const chars = [];

while (true) {
    let userInputChar = prompt('Write a single character (click \'Cancel\' if you are done): ');

    if (!userInputChar) {
        break;
    }
    chars.push(userInputChar);
}

const updatedUserStr = removeCharacters(userInputStr, chars);
alert(updatedUserStr);