class PushService:

    def send_push(self, device_id: str, message: str) -> None:
        """
        Sends a push notification to the specified device.
        :param device_id: The identifier of the device to which the push notification will be sent.
        :param message: The content of the push notification message to be sent.
        """
        print(f"Sending push notification to {device_id}: {message}")
