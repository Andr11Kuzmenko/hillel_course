import random


default_time = 60

def training_session(num_of_rounds: int):

    def adjust_time() -> int:
        return time_per_round - random.randint(5, 10)

    time_per_round = default_time

    for session_round in range(1, num_of_rounds + 1):
        print(f'Round {session_round}: {time_per_round} minutes')
        time_per_round = adjust_time()


training_session(5)
