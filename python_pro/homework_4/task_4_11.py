class LimitedAttributesMeta(type):

    def __call__(cls, *args, **kwargs):
        attributes_count = len(
            list(
                filter(
                    lambda name: not callable(cls.__dict__.get(name))
                    and not (name.startswith("__") and name.endswith("__")),
                    cls.__dict__.keys(),
                )
            )
        )

        if attributes_count > 3:
            raise TypeError("Too many attributes")


class LimitedClass(metaclass=LimitedAttributesMeta):
    attr1 = 1
    attr2 = 2
    attr3 = 3
    attr4 = 4  # Викличе помилку


obj = LimitedClass()
