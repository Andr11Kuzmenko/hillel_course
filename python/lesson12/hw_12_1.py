import codecs
import re


def delete_html_tags(html_file, result_file='cleaned.txt'):
    with codecs.open(html_file, 'r', 'utf-8') as file:
        html = file.read()
        cleaned_text = re.sub('<[^>]+>', '', html)

    cleaned_text = re.sub('\\s{2,}', '\n', cleaned_text).strip()

    with codecs.open(result_file, 'w', 'utf-8') as file:
        file.write(cleaned_text)


delete_html_tags('draft.html')
