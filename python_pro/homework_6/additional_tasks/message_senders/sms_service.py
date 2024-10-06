class SMSService:

    def send_sms(self, phone_number: str, message: str) -> None:
        """
        Sends an SMS message to the specified phone number.
        :param phone_number: The phone number to which the SMS message will be sent.
        :param message: The content of the SMS message to be sent.
        """
        print(f"Sending SMS to {phone_number}: {message}")
