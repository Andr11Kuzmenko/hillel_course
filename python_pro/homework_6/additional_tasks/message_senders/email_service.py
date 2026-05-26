class EmailService:

    def send_email(self, email_address: str, message: str) -> None:
        """
        Sends an email message to the specified email address.
        :param email_address: The email address to which the message will be sent.
        :param message: The content of the email message to be sent.
        """
        print(f"Sending email to {email_address}: {message}")
