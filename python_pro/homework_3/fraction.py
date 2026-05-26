class Fraction:

    def __init__(self, numerator: int, denominator: int):
        self.numerator = numerator
        self.denominator = denominator

    def __add__(self, other: "Fraction") -> "Fraction":
        cpy_self, cpy_other = Fraction.create_fraction_copies(self, other)
        Fraction.adjust_to_common_denominator(cpy_self, cpy_other)
        cpy_self.numerator += cpy_other.numerator
        return cpy_self

    def __sub__(self, other: "Fraction") -> "Fraction":
        cpy_self, cpy_other = Fraction.create_fraction_copies(self, other)
        Fraction.adjust_to_common_denominator(cpy_self, cpy_other)
        cpy_self.numerator -= cpy_other.numerator
        return cpy_self

    def __mul__(self, other: "Fraction") -> "Fraction":
        cpy_self, cpy_other = Fraction.create_fraction_copies(self, other)
        cpy_self.numerator *= cpy_other.numerator
        cpy_self.denominator *= cpy_other.denominator
        return cpy_self

    def __truediv__(self, other: "Fraction") -> "Fraction":
        cpy_self, cpy_other = Fraction.create_fraction_copies(self, other)
        cpy_self.numerator *= cpy_other.denominator
        cpy_self.denominator *= cpy_other.numerator
        return cpy_self

    def __repr__(self) -> str:
        return f"Fraction: {self.numerator}/{self.denominator}"

    def __eq__(self, other: "Fraction") -> bool:
        return (
            self.numerator == other.numerator and self.denominator == other.denominator
        )

    @staticmethod
    def create_fraction_copies(
        fraction1_: "Fraction", fraction2_: "Fraction"
    ) -> tuple["Fraction", "Fraction"]:
        return (
            Fraction(fraction1_.numerator, fraction1_.denominator),
            Fraction(fraction2_.numerator, fraction2_.denominator),
        )

    @staticmethod
    def adjust_to_common_denominator(fraction1_: "Fraction", fraction2_: "Fraction"):
        min_den = min(fraction1_.denominator, fraction2_.denominator)
        max_den = max(fraction1_.denominator, fraction2_.denominator)
        multiplier = 0
        if max_den == min_den:
            return None
        multiplier = max_den // min_den if not max_den % min_den else multiplier
        if not multiplier:
            fraction1_.numerator, fraction2_.numerator = (
                fraction2_.denominator * fraction1_.numerator,
                fraction1_.denominator * fraction2_.numerator,
            )
            fraction1_.denominator, fraction2_.denominator = (
                fraction2_.denominator * fraction1_.denominator,
                fraction2_.denominator * fraction1_.denominator,
            )
        else:
            if fraction1_.denominator == max_den:
                fraction2_.numerator, fraction2_.denominator = (
                    fraction2_.numerator * multiplier,
                    fraction2_.denominator * multiplier,
                )
            else:
                fraction1_.numerator, fraction1_.denominator = (
                    fraction1_.numerator * multiplier,
                    fraction1_.denominator * multiplier,
                )


fraction1 = Fraction(1, 2)
fraction2 = Fraction(2, 3)
fraction3 = Fraction(4, 5)
fraction4 = Fraction(5, 6)
assert fraction1 + fraction2 == Fraction(7, 6), "Test1"
assert fraction1 + fraction4 == Fraction(8, 6), "Test2"
assert fraction4 - fraction3 == Fraction(1, 30), "Test3"
assert fraction4 * fraction1 == Fraction(5, 12), "Test4"
assert fraction1 / fraction3 == Fraction(5, 8), "Test5"
print("OK")
