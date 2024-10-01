const CAPITAL_CITIES = ['Kyiv', 'London', 'Washington'];
const SPORT_FAMOUS_PEOPLE = {
    'Football' : 'Ronaldo',
    'Baseball' : 'Ted Bundy',
    'Basketball' : 'LeBron James',
    'F1 Racing' : 'Max Verstappen',
};
const QUESTIONS = [
    {
        questionName : 'Birth Year',
        question: 'What is your birth year?',
        result: function() {
            if (!answers[this.questionName]) {
                return '';
            }

            return `Your age: ${new Date().getFullYear() - parseInt(answers[this.questionName])}`;
        }
    },
    {
        questionName : 'City',
        question: 'Where do you live?',
        result: function() {
            if (!answers[this.questionName]) {
                return '';
            }
            let city = answers[this.questionName];
            return CAPITAL_CITIES[city] ? `You live in the capital city ${city}` : `You live in the city ${city}`;
        }
    },
    {
        questionName : 'Sport',
        question: 'What is your favourite sport?',
        result: function() {
            if (!answers[this.questionName]) {
                return '';
            }

            let sport = answers[this.questionName];
            return SPORT_FAMOUS_PEOPLE[sport] ? `Cool! Do you want to be like ${SPORT_FAMOUS_PEOPLE[sport]}?` : '';
        }
    },
];

const answers = {};

QUESTIONS.forEach(item => {
    let {questionName, question} =  item;
    answers[questionName] = prompt(question);
});

let answersToShow = QUESTIONS.reduce((res, item) => {
        let tmp_res = item.result();
        return res + (tmp_res ? '\n' + tmp_res : '');
    },
    ''
);

let unanswered = QUESTIONS.reduce((res, item) => {
    if (!answers[item.questionName]) {
        res += `\nUnfortunately, you have not provided your ${item.questionName}`;
    }
    return res;
}, '');

alert(answersToShow + unanswered);



