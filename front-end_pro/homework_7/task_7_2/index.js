function multiply(a) {
    return function (b) {
        return a * b;
    }
}

console.log(multiply(2)(3));
console.log(multiply(0)(1));
console.log(multiply(-1)(10));