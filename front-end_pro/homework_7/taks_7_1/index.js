function calculateSum(initialVal) {
    let currentSum = initialVal;

    return function (valueToAdd) {
        currentSum += valueToAdd;
        return currentSum;
    }
}

const sum = calculateSum(5);
console.log(sum(5));  // 10
console.log(sum(5));  // 15
console.log(sum(10));  // 25
console.log(sum(9));  // 34