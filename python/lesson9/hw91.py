def popular_words(text: str, words: list[str]) -> dict:
    res = dict.fromkeys(words, 0)
    text = text.lower().split(' ')

    for word in words:
        res.update({word: text.count(word)})

    return res


assert popular_words('''When I was One I had just begun When I was Two I was nearly new''', ['i', 'was', 'three', 'near']) == { 'i': 4, 'was': 3, 'three': 0, 'near': 0 }, 'Test1'
print('OK')
