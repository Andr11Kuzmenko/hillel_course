def analyze_inheritance(class_) -> None:
    """
    prints methods of class that are inherited from base classes
    :param class_:
    """
    for base in class_.__bases__:
        for attr_name, attr_val in base.__dict__.items():
            if callable(attr_val):
                print(f"{attr_name} inherited from {base.__name__}")


class Parent:
    def parent_method(self):
        pass


class Child(Parent):
    def child_method(self):
        pass


analyze_inheritance(Child)
