class BinaryNumber:

    def __init__(self, binary):
        self.binary = binary

    def __and__(self, other: "BinaryNumber") -> "BinaryNumber":
        return BinaryNumber(self.binary & other.binary)

    def __or__(self, other: "BinaryNumber") -> "BinaryNumber":
        return BinaryNumber(self.binary | other.binary)

    def __invert__(self) -> "BinaryNumber":
        return BinaryNumber(~self.binary)

    def __xor__(self, other: "BinaryNumber") -> "BinaryNumber":
        return BinaryNumber(self.binary ^ other.binary)

    def __eq__(self, other: "BinaryNumber") -> bool:
        return self.binary == other.binary


bin_num1 = BinaryNumber(0b10001010101010)
bin_num2 = BinaryNumber(0b11111)
bin_num3 = BinaryNumber(0b11000000000000000)
bin_num4 = BinaryNumber(0b1)
bin_num5 = BinaryNumber(0b0)
assert bin_num5 & bin_num4 == BinaryNumber(0b0), "Test1"
assert bin_num5 | bin_num4 == BinaryNumber(0b1), "Test2"
assert bin_num1 ^ bin_num2 == BinaryNumber(0b10001010110101), "Test3"
assert bin_num1 ^ bin_num3 == BinaryNumber(0b11010001010101010), "Test4"
print("OK")
