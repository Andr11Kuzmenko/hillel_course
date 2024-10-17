let company = {
    sales: [
        {
            name: 'John',
            salary: 1000,
        },
        {
            name: 'Alice',
            salary: 600,
        },
    ],
    development: {
        web: [
            {
                name: 'Peter',
                salary: 2000,
            },
            {
                name: 'Alex',
                salary: 1800,
            },
        ],
        internals: [
            {
                name: 'Jack',
                salary: 1300,
            },
        ]
    },
    ceo: {
        name: 'Will',
        salary: 11000,
    }
}

function getSalarySum(currentEntity, sum = 0) {
    for (let attrName in currentEntity) {
        let entity = currentEntity[attrName];

        if (entity.hasOwnProperty('salary')) {
            sum += entity.salary;
        } else {
            sum += getSalarySum(entity);
        }
    }

    return sum;
}

console.log(getSalarySum(company));