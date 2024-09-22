subscribers = []

def subscribe(subscriber_name: str):

    def confirm_subscription():
        print(f'Subscription has been confirmed for {subscriber_name}')

    subscribers.append(subscriber_name)
    confirm_subscription()

def unsubscribe(subscriber_name: str) -> str:
    message_to_return = f'{subscriber_name} has been successfully unsubscribed'

    if subscriber_name in subscribers:
        subscribers.remove(subscriber_name)
    else:
        message_to_return = 'Subscription not found'

    return message_to_return


subscribe("Olena")
subscribe("Igor")

assert subscribers == ['Olena', 'Igor'], 'Test 1'
assert unsubscribe('Igor') == 'Igor has been successfully unsubscribed', 'Test 2'
assert subscribers == ['Olena'], 'Test 3'
print('OK')
