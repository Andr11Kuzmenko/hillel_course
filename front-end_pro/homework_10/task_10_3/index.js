const myContacts = {
    contacts: [],
    findContactByName: function (contactName) {
        return this.contacts.find(item => item.name === contactName);
    },
    addContact: function (contact) {
        this.contacts.push(contact);
    }
}

console.log(myContacts.findContactByName('Andrii'));
myContacts.addContact({
    name: 'Andrii',
    phone: '222-222-2222',
    email: 'someEmail.12@test.com'
});
console.log(myContacts.findContactByName('Andrii'));
