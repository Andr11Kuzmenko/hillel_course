from abc import abstractmethod, ABC


class MessageSender(ABC):

    @abstractmethod
    def send_message(self, message: str):
        pass
