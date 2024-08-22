def common_elements() -> set:
    nums_to_100 = [n for n in range(100)]
    return set(nums_to_100[::5]) & set(nums_to_100[::3])


assert common_elements() == {0, 75, 45, 15, 90, 60, 30}
print('OK')
