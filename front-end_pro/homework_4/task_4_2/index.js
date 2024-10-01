const userNumber = prompt("Enter your number");
const sortedRow = userNumber.split('').sort();
const areSameDigits = sortedRow[0] === sortedRow[sortedRow.length-1];
const anyRepeatedDigits = sortedRow.reduce(
    (res, item, idx, arr) => res || (idx === 0 ? false : item === arr[idx-1]),
    false
);
alert(`All digits are the same: ${areSameDigits}\nAny digits are repeated: ${anyRepeatedDigits}`);