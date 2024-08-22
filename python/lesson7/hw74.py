def common_elements() -> set:
    nums_to_100 = [n for n in range(100)]
    common_nums = set(nums_to_100[::5]) & set(nums_to_100[::3])
    return common_nums


assert common_elements() == {0, 75, 45, 15, 90, 60, 30}
print('OK')
