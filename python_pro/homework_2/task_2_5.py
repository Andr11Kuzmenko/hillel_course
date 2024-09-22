from datetime import date, timedelta


events = []


class Event:
    def __init__(self, event_date: date, event_name: str):
        self.event_date = event_date
        self.event_name = event_name


def create_calendar_processor():  # in case if any additional configs needed for the processor
    def get_action(action_name: str):
        def add_event(event: Event):
            events.append(event)

        def remove_event(event_name: str = "Some event", event_date: date = None):
            events_to_remove = list(
                filter(lambda x: x.event_name == event_name, events)
            )

            if event_date:
                events_to_remove = list(
                    filter(lambda x: x.event_date == event_date, events_to_remove)
                )

            for event in events_to_remove:
                events.remove(event)

        def get_future_events() -> list[Event]:
            return list(filter(lambda x: x.event_date > date.today(), events))

        def print_events(p_events: list[Event]):
            for ev in p_events:
                print(f"Name: {ev.event_name}, Date: {ev.event_date}")

        return locals()[action_name]

    return get_action


calendar_processor = create_calendar_processor()
action_add_event = calendar_processor("add_event")
action_add_event(Event(date.today() + timedelta(days=10), "Some future event"))
action_add_event(Event(date.today() + timedelta(days=22), "Some future event 2"))
action_print_events = calendar_processor("print_events")
action_print_events(events)
action_remove_event = calendar_processor("remove_event")
action_remove_event("Some future event")
action_print_events(events)
