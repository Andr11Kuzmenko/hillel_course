user_input = int(input())

tmp = user_input

tmp, p_sec = divmod(tmp, 60)
tmp, p_min = divmod(tmp, 60)
p_days, p_hours = divmod(tmp, 24)
p_days_descr = 'днів'

p_time = f'{str(p_hours).zfill(2)}:{str(p_min).zfill(2)}:{str(p_sec).zfill(2)}'

if 2 <= p_days % 10 <= 4:
    p_days_descr = 'дні'
elif p_days % 10 == 1:
    p_days_descr = 'день'

if 11 <= p_days % 100 <= 14:
    p_days_descr = 'днів'

print(f"{p_days} {p_days_descr}, {p_time}")
