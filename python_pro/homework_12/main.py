"""
This module provides a set of utilities for validating and processing strings
with regular expressions.
"""

import re


def validate_email(email_address: str) -> bool:
    """
    Validates an email address to ensure it follows a standard format.
    :param email_address: The email address to validate.
    :return: True if the email address is valid according to the defined pattern;
            otherwise, False.
    """
    return bool(
        re.fullmatch(r"^[a-zA-Z0-9._]+@[a-zA-Z0-9]+\.[a-zA-Z]{2,6}$", email_address)
    )


def validate_phone(phone_number_: str) -> bool:
    """
    Validates a phone number against common formats.
    :param phone_number_: The phone number to validate.
    :return: True if the phone number matches one of the valid formats;
            otherwise, False.
    """
    patterns = [
        r"^[0-9]{10}$",
        r"^[0-9]{3}\.[0-9]{3}\.[0-9]{4}$",
        r"^[0-9]{3}-[0-9]{3}-[0-9]{4}$",
        r"^\([0-9]{3}\) [0-9]{3}-[0-9]{4}$",
    ]
    is_valid = False
    for pattern in patterns:
        is_valid = is_valid or bool(re.match(pattern, phone_number_))
    return is_valid


def get_hashtags(text_to_explore: str) -> list[str]:
    """
    Extracts all hashtags from a given text.
    :param text_to_explore: The text from which to extract hashtags.
    :return: A list of hashtags found in the text, each starting with '#'.
    """
    return re.findall(r"#[a-zA-Z0-9]+", text_to_explore)


def change_date_format(date_to_format: str) -> str:
    """
    Converts a date from the format DD/MM/YYYY to YYYY-MM-DD.
    :param date_to_format: The date string to be reformatted, expected in DD/MM/YYYY format.
    :return: The date in YYYY-MM-DD format.
    """
    return re.sub(r"(\d{2})/(\d{2})/(\d{4})", r"\3-\2-\1", date_to_format)


def remove_html_tags(text_to_clear: str) -> str:
    """
    Removes HTML tags from a given text.
    :param text_to_clear: The input string containing HTML tags.
    :return: The input string with all HTML tags removed.
    """
    return re.sub(r"<.*?>", "", text_to_clear)


def get_ip_addresses(text_with_ips: str) -> list[str]:
    """
    Extracts all IP addresses from a given text.
    :param text_with_ips: The input string containing potential IP addresses.
    :return: A list of IP addresses extracted from the input text.
    """
    return re.findall(r"\d{3}\.\d{3}\.\d{3}\.\d{3}", text_with_ips)


def validate_password(password_: str) -> bool:
    """
    Validates a password based on specific criteria.
    :param password_: The password string to validate.
    :return: True if the password meets all the specified criteria; otherwise, False.
    """
    return bool(
        re.fullmatch(
            "^(?=.*[A-Za-z])(?=.*\\d)(?=.*[@$!%*#?&])[A-Za-z\\d@$!%*#?&]{8,}$",
            password_,
        )
    )


def contains_template(text_: str) -> bool:
    """
    Checks if the given text contains a specific pattern.
    :param text_: The input text to search for the specified pattern.
    :return: True if the pattern is found in the text; otherwise, False.
    """
    return bool(re.search(r"[A-Z]{2}\d{2}[A-Z]{2}\d{2}", text_))


if __name__ == "__main__":
    emails = ["a.test.1234@test.com", "@fdf@.com"]
    for email in emails:
        print(f"Email: {email} is {'' if validate_email(email) else 'not '}valid")

    phone_numbers = [
        "1234567890",
        "111111111111",
        "023.123.1111",
        "012.123-1111",
        "(123) 123-1234",
    ]
    for phone_number in phone_numbers:
        print(
            f"Phone number: {phone_number} is {'' if validate_phone(phone_number) else 'not '}valid"
        )

    text = """
    some long long #text here.
    the #FunctionShould find a few #tags3
    this #hash_tag is not valid, since #it contains _
    """
    print(get_hashtags(text))
    print(change_date_format("08/12/1980"))
    html_text = """
    <html>
    <head>
        <title>Some Title</title>
    </head>
    <body>
        <ul>
            some text here
        </ul>
    </body>
    </html>
    """
    print(remove_html_tags(html_text))
    text_with_ip_addresses = """
    123.120.001.255 2024-10-31 22:39:35 - Using selector: KqueueSelector
    :39:35 - Using selector: KqueueSelector
    :39:35 - Using selector: KqueueSelector
    :39:35 - Using selector: KqueueSelector 123.120.001.asv
    FFF.FFF.FFF.AAA
    """
    print(get_ip_addresses(text_with_ip_addresses))
    print(validate_password("<PASSWORD>"))
    print(validate_password("Some1234%PwD"))
    print(contains_template("bbcs343 dew w3"))
    print(contains_template("bbcs3AA43BB34ds sda"))
