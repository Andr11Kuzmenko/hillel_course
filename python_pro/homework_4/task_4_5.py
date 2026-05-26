class MutableClass:

    def add_attribute(self, name_: str, value: object) -> None:
        """
        adds an attribute to the current object
        :param name_: attribute name
        :param value: attribute value
        """
        self.__setattr__(name_, value)

    def remove_attribute(self, name_: str) -> None:
        """
        removes an attribute from the current object
        :param name_: attribute name
        """
        self.__delattr__(name_)


obj = MutableClass()

obj.add_attribute("name", "Python")
assert obj.name == "Python", "Test 1"

obj.remove_attribute("name")
try:
    print(obj.name)
except Exception as ex:
    print(ex)
