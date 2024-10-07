function removeElement(array, item) {
    while (array.includes(item)) {
        let shiftNext = false;

        for (let i = 0; i < array.length; i++) {
            if (!shiftNext && array[i] === item) {
                shiftNext = true;
            }

            if (shiftNext && (i !== array.length - 1)) {
                array[i] = array[i + 1];
            }
        }

        if (shiftNext) {
            array.length--;
        }
    }
}

const array = [1, 3, 4, 6, 2, 4, 5, 7];
removeElement(array, 4);
console.log(array);