def create_user_settings(theme: str, language: str, notifications: bool):
    def action(**kwargs):
        nonlocal theme, language, notifications

        if kwargs.get("action") == "set":
            theme, language, notifications = (
                kwargs.get("theme", theme),
                kwargs.get("language", language),
                kwargs.get("notifications", notifications),
            )
        else:
            return {
                "theme": theme,
                "language": language,
                "notifications": notifications,
            }

        return None  # according to PEP8

    return action


settings = create_user_settings("black", "en", False)
settings(action="set", theme="white", notifications=True)
print(settings(action="get"))
