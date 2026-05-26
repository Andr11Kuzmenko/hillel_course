const userInfo = {
    name: 'Ivan',
    age: 20,
    address: {
        city: 'Kyiv',
        country: 'Ukraine',
        street: 'Glushkova 11',
        toString: function() {
            return `Country: ${this.country}; City: ${this.city}; Street: ${this.street}`;
        }
    },
    showInfo: function() {
        console.log(`User name: ${this.name}; Age: ${this.age}; Address: ${this.address}`);
    }
};

userInfo.showInfo();