from abc import abstractmethod
import logging

logging.basicConfig(
    level=logging.INFO,
    handlers=[
        logging.FileHandler("task_4_6.log"),
        logging.StreamHandler()
    ]
)


class Greeter:

    @abstractmethod
    def greet(self, name: str) -> None:
        pass


class MyClass(Greeter):

    def greet(self, name: str) -> None:
        """
        prints a greeting
        :param name:
        """
        print(f"Hello, {name}")


class Proxy(Greeter):

    def __init__(self, my_class: MyClass):
        self._my_class = my_class

    def greet(self, name: str) -> None:
        """
        use log_a_call method and calls greet method from the original class
        :param name:
        """
        self.log_a_call("greet", name)
        self._my_class.greet(name)

    def log_a_call(self, method_name: str, *args: tuple[object]) -> None:
        """
        writes to a file info which method is called, and what args were passed to the method
        :param method_name:
        :param args:
        """
        logging.info(f"Proxy: Calling method '{method_name}' with args: {args}\n")


obj = MyClass()
proxy = Proxy(obj)

proxy.greet("Jack")
