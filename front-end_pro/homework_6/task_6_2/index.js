function calculateNumbersAvg(arr) {
    const nums = arr.filter(item => typeof (item) === 'number');
    const numsSum = nums.reduce((sum, item) => sum + item, 0);
    return numsSum / nums.length;
}

const someArray = ['1', 2, 3, 5.5, true, false, Symbol('some Symbol'), null, 0];
const res = calculateNumbersAvg(someArray);
console.log(res);