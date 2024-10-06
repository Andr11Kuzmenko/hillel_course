import adapters

from message_sender import MessageSender

MESSAGE = 'Hello! How are you?'


def send_message(sender: MessageSender, message: str) -> None:
    """
    Sends a message using a provided sender object that implements the MessageSender interface.
    :param sender: An object that implements the `MessageSender` interface and
                    contains the `send_message(message: str)` method.
    :param message: The message to be sent.
    """
    sender.send_message(message)


if __name__ == '__main__':
    sms_adapter = adapters.SMSAdapter('+48500823913')
    email_adapter = adapters.EmailAdapter('a.kuzmenko.12.94@gmail.com')
    push_adapter = adapters.PushAdapter('1234343')

    send_message(sms_adapter, MESSAGE)
    send_message(email_adapter, MESSAGE)
    send_message(push_adapter, MESSAGE)
