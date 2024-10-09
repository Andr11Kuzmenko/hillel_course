"""task 7 6"""

import pytest


class BankAccount:
    """
    Represents a simple bank account that allows deposits and withdrawals.
    """

    def __init__(self) -> None:
        self._amount = 0  # type: float

    def deposit(self, amount) -> None:
        """
        Adds a specified amount to the current balance.
        :param amount: The amount to be deposited.
        """
        self._amount += amount

    def withdraw(self, amount) -> None:
        """
        Withdraws a specified amount from the current balance.
        :param amount: The amount to be withdrawn.
        """
        self._amount = max(0, self._amount - amount)

    def get_balance(self) -> float:
        """
        Retrieves the current balance.
        :return: The current balance.
        """
        return self._amount


@pytest.fixture(name="bank_account")
def create_bank_account() -> BankAccount:
    """
    Fixture that creates a BankAccount instance with an initial deposit.
    :return: An instance of the BankAccount class with an initial balance of 555.
    """
    bank_account = BankAccount()
    bank_account.deposit(555)
    return bank_account


@pytest.fixture(name="empty_bank_account")
def create_empty_bank_account() -> BankAccount:
    """
    Fixture to create an empty BankAccount instance for testing.
    :return: A new instance of the BankAccount class.
    """
    return BankAccount()


@pytest.mark.parametrize(
    "amount, expected", [(100, 655), (10, 565), (0, 555), (1000, 1555)]
)
def test_deposit(bank_account, amount, expected) -> None:
    """
    Tests the deposit functionality of the BankAccount class.
    :param bank_account: A pre-configured BankAccount instance created
                        by the 'bank_account' fixture.
    :param amount: The amount to be deposited.
    :param expected: The expected balance after the deposit.
    """
    bank_account.deposit(amount)
    assert bank_account.get_balance() == expected


@pytest.mark.parametrize(
    "amount, expected", [(100, 455), (0, 555), (10, 545), (1000, 0)]
)
def test_withdraw(bank_account, amount, expected) -> None:
    """
    Tests the withdrawal functionality of the BankAccount class.
    :param bank_account: A pre-configured BankAccount instance created
                        by the 'bank_account' fixture.
    :param amount: The amount to be withdrawn.
    :param expected: The expected balance after the withdrawal.
    """
    bank_account.withdraw(amount)
    assert bank_account.get_balance() == expected


def test_empty_bank_account_withdraw(empty_bank_account) -> None:
    """
    Test the withdrawal functionality of an empty BankAccount.
    :param empty_bank_account: A fresh instance of BankAccount with an initial balance of 0.
    """
    if empty_bank_account.get_balance() == 0:
        pytest.skip("Skipping test for withdrawal on an empty account")

    empty_bank_account.withdraw(100)
    assert empty_bank_account.get_balance() == 0
