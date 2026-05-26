from uuid import uuid4, UUID


class UniqueIdCreator:

    def __init__(self, num_of_id: int = 5):
        self._num_of_id = num_of_id
        self._current = 0

    def __iter__(self) -> "UniqueIdCreator":
        return self

    def __next__(self) -> UUID:
        """
        :return: unique id
        """
        if self._current < self._num_of_id:
            self._current += 1
            return uuid4()

        raise StopIteration


id_creator = iter(UniqueIdCreator())

while True:
    try:
        print(next(id_creator))
    except StopIteration:
        break
