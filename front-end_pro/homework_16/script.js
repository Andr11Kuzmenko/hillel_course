function Student({firstName, lastName, birthYear, marks}) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.birthYear = birthYear;
    this.marks = marks;

    let _visits = Array(25);

    this.present = () => {
        _visits.push(true);
        _visits.shift();
        return this;
    }
    this.absent = () => {
        _visits.push(false)
        _visits.shift();
        return this;
    }
    this.summary = () => {
        let avgVisit = _visits.filter(visit => visit).length / _visits.length;
        let avgMark = this.marks.reduce((sum, mark) => sum + mark, 0) / this.marks.length;

        if (avgVisit > 0.9 && avgMark > 90) {
            return 'Молодець!';
        } else if (avgVisit < 0.9 && avgMark < 90) {
            return 'Редиска!';
        }

        return 'Добре, але можна краще!';
    };
}

let student1 = new Student({
    firstName: 'Ivan',
    lastName: 'Ivanov',
    birthYear: 1993,
    marks: [90, 80, 99, 100, 87]
});

for (let i = 0; i < 30; i++) {
    let r = Math.ceil(Math.random() * 2);
    student1[r % 2 ? 'present' : 'absent']();
}
console.log(student1.summary());

let student2 = new Student({
    firstName: 'Vasyl',
    lastName: 'Kvitkovyi',
    birthYear: 1994,
    marks: [90, 91, 92, 93, 90]
});

for (let i = 0; i < 40; i++) {
    student2.present();
}
console.log(student2.summary());