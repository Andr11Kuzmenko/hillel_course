class BankAccount {

    constructor(deposit) {
        this.balance = deposit;
    }

    getBalance() {
        return this.balance;
    }

    deposit(sum) {
        this.balance += sum;
    }

    withdraw(sum) {
        this.balance -= sum;
    }

}

const account1 = new BankAccount(1000);
console.log(account1.getBalance()); // 1000
account1.deposit(500);
console.log(account1.getBalance()); // 1500
account1.withdraw(200);
console.log(account1.getBalance()); // 1300