from message_sender import MessageSender
from sms_service import SMSService
from push_service import PushService
from email_service import EmailService


class SMSAdapter(MessageSender, SMSService):

    def __init__(self, phone_number):
        self.phone_number = phone_number

    def send_message(self, message: str) -> None:
        """
        Sends an SMS message to the specified phone number using the SMSService's send_sms method.
        :param message: The content of the SMS message to be sent.
        """
        self.send_sms(self.phone_number, message)


class EmailAdapter(MessageSender, EmailService):

    def __init__(self, email_address):
        self.email_address = email_address

    def send_message(self, message: str) -> None:
        """
        Sends an email message to the specified email address using the EmailService's send_email method.
        :param message: The content of the email message to be sent.
        """
        self.send_email(self.email_address, message)


class PushAdapter(MessageSender, PushService):

    def __init__(self, device_id):
        self.device_id = device_id

    def send_message(self, message: str) -> None:
        """
        Sends a push notification to the specified device using the PushService's send_push method.
        :param message: The content of the push notification message to be sent.
        """
        self.send_push(self.device_id, message)
