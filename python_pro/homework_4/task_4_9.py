class DynamicProperties:

    def __init__(self):
        self._props = {}

    def add_property(self, name: str, value: object) -> None:
        """
        create a property, setter and getter
        :param name: property name
        :param value: initial value
        """
        def getter(self):
            return self._props.get(name, None)

        def setter(self, value):
            self._props[name] = value

        setattr(self.__class__, name, property(getter, setter))
        self._props[name] = value


obj = DynamicProperties()
obj.add_property("name", "default_name")
assert obj.name == "default_name", "Test 1"
obj.name = "Python"
assert obj.name == "Python", "Test 2"
