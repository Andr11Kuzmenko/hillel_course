const someInitialArray = [1, 2, 3, 4, 5, 6, 7, 1 ,2];

function filterArray(array) {
    return array.filter(item => !(item % 2));
}

console.log(filterArray(someInitialArray));